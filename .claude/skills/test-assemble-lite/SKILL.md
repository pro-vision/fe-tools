---
name: test-assemble-lite
description: >-
  Verify local (uncommitted) assemble-lite changes by running a real Living
  Styleguide (LSG) build against a consumer project. Use when testing or verifying
  assemble-lite dependency bumps or changes to its render/glob/data/helper code
  before publishing. assemble-lite has no bin and is consumed transitively via
  @pro-vision/pv-stylemark, so the test injects the local package into the
  consumer's node_modules and runs `pv-stylemark prod`. The skill ALWAYS asks which
  consumer project to build — no project is hardcoded.
---

# Test assemble-lite against a real consumer project

Verifies the **local, possibly uncommitted** `packages/assemble-lite` by running an
actual LSG build that renders Handlebars through it. There is no unit-test suite in
this repo, so this is the documented way to validate assemble-lite changes.

`assemble-lite` is **not a CLI** — it is a library required by `@pro-vision/pv-stylemark`
(which renders clickdummies + the Stylemark LSG with it). So unlike `pv-scripts`
(see the `test-pv-scripts` skill, which runs a local bin via the direct-bin method),
assemble-lite can only be exercised by making a consumer's `pv-stylemark` use the
local copy. The reliable way to do that is to **inject** the local package into the
consumer's `node_modules`, build, then **restore** the original.

> The same inject-and-restore method works for any monorepo library consumed
> transitively (e.g. the external-vs-local distinction aside, `handlebars-helpers`),
> not just assemble-lite.

## Step 0 — Make sure the local package's deps are installed

The injection copies the local package **including its own `node_modules`** (see
why in Step 2). So those nested deps must exist and be current first:

```sh
cd "$(git rev-parse --show-toplevel)"
npm run bootstrap        # lerna bootstrap — installs each package's deps + symlinks local cross-deps
# (or, narrower: cd packages/assemble-lite && npm install)
```

Sanity-check the new versions actually landed in the package's nested tree:

```sh
REPO="$(git rev-parse --show-toplevel)"
for d in glob js-yaml fs-extra handlebars yaml-front-matter; do
  echo "$d: $(node -e "console.log(require('$REPO/packages/assemble-lite/node_modules/$d/package.json').version)")"
done
```

## Step 1 — Determine the consumer project (ALWAYS ask)

Never assume a specific project. If the user did not pass a project path, ask, e.g.:

> "Gegen welches Consumer-Projekt soll ich assemble-lite testen? (absoluter Pfad zum
> Frontend-Ordner, der `@pro-vision/pv-stylemark` nutzt und eine `pv.config.js` mit
> LSG-Konfiguration enthält)"

Accept an absolute path to the project's frontend directory. The project must:
- be **installed** already (`node_modules` present),
- depend on `@pro-vision/pv-stylemark`,
- have a `pv.config.js` with LSG config (`cdTemplatesSrc`, `cdPagesSrc`, `hbsHelperSrc`,
  `lsgConfigPath`, `lsgIndex`, `destPath`).

Validate and locate the consumer's assemble-lite copy (usually a single hoisted copy
at the top level):

```sh
PROJ="<absolute path the user gave>"
test -f "$PROJ/pv.config.js" || echo "WARN: no pv.config.js"
node -e "console.log('pv-stylemark:', require('$PROJ/node_modules/@pro-vision/pv-stylemark/package.json').version)"
find "$PROJ/node_modules" -type d -name assemble-lite      # note: should be ONE hoisted dir
```

Note the `destPath` from `pv.config.js` (default `target`) — that is where assembled
HTML lands.

## Step 2 — Inject the local assemble-lite (with backup)

Replace the consumer's installed assemble-lite with the **whole local package
directory, including its nested `node_modules`**, and keep a backup to restore later.

```sh
REPO="$(git rev-parse --show-toplevel)"
DEST="$PROJ/node_modules/@pro-vision/assemble-lite"
BAK="$PROJ/node_modules/@pro-vision/.assemble-lite.bak-claude"

if [ -e "$BAK" ]; then echo "ABORT: stale backup at $BAK — investigate"; exit 1; fi
mv "$DEST" "$BAK"
cp -R "$REPO/packages/assemble-lite" "$DEST"

# verify the injected copy carries the NEW code + NEW nested deps
node -e "console.log('nested glob:', require('$DEST/node_modules/glob/package.json').version, '| js-yaml:', require('$DEST/node_modules/js-yaml/package.json').version)"
```

**Why copy the whole dir incl. `node_modules`, not just the source files:** the
consumer hoists assemble-lite's *old* deps (e.g. `glob@7`) to its top-level
`node_modules`. New code (e.g. the `glob@9+` promise API) needs the *new* deps.
Copying the self-contained local package makes its nested `node_modules/glob@13`
**shadow** the hoisted old one during Node resolution. Copying only `helper/*.js`
would run new code against the old hoisted `glob@7` and break.

**Why not the direct-bin method (as in test-pv-scripts):** assemble-lite is a library,
not a bin — there is no `cwd`-resolved entry point to run. `npm link` is also
unreliable here (splits the dep tree, phantom-dep failures).

## Step 3 — Run the LSG build

`pv-stylemark prod` is **standalone**: it assembles clickdummy components + pages and
builds the DDS/LSG, all through assemble-lite. It does **not** need the webpack /
`pv-scripts` asset build to run, so it isolates the assemble-lite change.

```sh
LOG="$(mktemp -t altest).log"
BIN="$PROJ/node_modules/@pro-vision/pv-stylemark/bin/pv-stylemark.js"
cd "$PROJ"
node "$BIN" prod > "$LOG" 2>&1
echo "BUILD EXIT: $?"
tail -30 "$LOG"
```

Run on **Node ≥ 22** (glob 13 `engines`: `18 || 20 || >=22`; Node 24 is fine — a
`punycode` DeprecationWarning is benign).

## Step 4 — Evaluate the result

A pass = **exit 0**, no error markers, a non-trivial count of assembled HTML, and no
unresolved templates leaking into the output.

```sh
grep -iE "error|cannot find|is not a function|MODULE_NOT_FOUND|TypeError|failed" "$LOG" \
  | grep -viE "punycode|DeprecationWarning" || echo "  (no error markers)"

find "$PROJ/target" -type f -name "*.html" | wc -l            # expect hundreds in a real project
# leftover Handlebars / missing-helper leaks (expect 0):
grep -rlE "Missing helper|\{\{[#/]?pv-|\{\{> " "$PROJ/target" 2>/dev/null | wc -l
```

Distinguish failure causes — report which it is:
- **assemble-lite regression** (what we care about): a `require` error / `is not a
  function` from `glob`/`js-yaml`/`fs-extra`, `MODULE_NOT_FOUND` for one of
  assemble-lite's own deps, or templates left unrendered (`{{…}}` / `Missing helper`
  in the output) where the published version rendered them.
- **Consumer-content issue** (NOT an assemble-lite regression): broken Handlebars in
  the project's *own* templates/data — these fail with the published assemble-lite
  too. If unsure, restore (Step 5) and rebuild with the project's installed copy to
  get a baseline, then compare.

## Step 5 — Restore (always)

```sh
DEST="$PROJ/node_modules/@pro-vision/assemble-lite"
BAK="$PROJ/node_modules/@pro-vision/.assemble-lite.bak-claude"
[ -e "$BAK" ] || { echo "ABORT: backup missing"; exit 1; }
rm -rf "$DEST" && mv "$BAK" "$DEST"
node -e "console.log('restored deps glob:', require('$DEST/package.json').dependencies.glob)"   # expect the published version
```

The build leaves the consumer's `destPath` (`target/`) populated with test artifacts;
the project's own build scripts regenerate it (`rimraf target`), so leaving it is
fine — just mention it. Do not commit anything in the consumer project.
