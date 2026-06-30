---
name: test-pv-scripts
description: >-
  Verify local (uncommitted) pv-scripts changes by running a real build against a
  consumer project that uses pv-scripts. Use when testing or verifying pv-scripts
  dependency bumps, webpack-config/task changes, or any change under
  packages/pv-scripts before publishing. The skill ALWAYS asks which consumer
  project to build — no project is hardcoded.
---

# Test pv-scripts against a real consumer project

Verifies the **local, possibly uncommitted** `packages/pv-scripts` against a real
consumer project by running an actual webpack build with it. This is the documented
way to validate pv-scripts changes (there is no unit-test suite in this repo).

## Step 1 — Determine the consumer project (ALWAYS ask)

Never assume a specific project. If the user did not pass a project path as an
argument, ask them for it, e.g. with `AskUserQuestion` (header `Projekt`) or a
plain question:

> "Gegen welches Consumer-Projekt soll ich pv-scripts testen? (absoluter Pfad zum
> Frontend-Ordner, der eine `pv.config.js` enthält)"

Accept an absolute path to the project's frontend directory (the folder containing
`pv.config.js` and a `package.json` that depends on `@pro-vision/pv-scripts`).

Then validate the target:

```sh
PROJ="<absolute path the user gave>"
test -f "$PROJ/pv.config.js"   || echo "WARN: no pv.config.js — is this a pv-scripts project?"
node -e "const p=require('$PROJ/package.json'); console.log('pv-scripts:', (p.devDependencies||{})['@pro-vision/pv-scripts'] || (p.dependencies||{})['@pro-vision/pv-scripts'])"
```

The project must be **installed** already (`node_modules` present). Read its
`pv.config.js` `destPath` (default `target`) and note any custom build scripts in
its `package.json` (`build:prod`, `build:clientlibs`, …).

## Step 2 — Run the build with the LOCAL pv-scripts (direct-bin method)

Run the local pv-scripts bin directly with the consumer project as the working
directory. pv-scripts resolves the app path from `process.cwd()`, so this runs the
**local/updated** pv-scripts code while leaving the consumer's `node_modules`
untouched:

```sh
REPO="$(git rev-parse --show-toplevel)"          # run from inside the fe-tools repo
BIN="$REPO/packages/pv-scripts/bin/pv-scripts.js"
LOG="$(mktemp -t pvtest).log"

cd "$PROJ"
rm -rf target                                    # use the project's destPath if customized
node "$BIN" prod > "$LOG" 2>&1
echo "BUILD EXIT: $?"
```

Notes:
- Use `prod` for a clean one-shot build. For AEM clientlib parity, mirror the
  project's own script env, e.g. `AEM_BUILD='true' PUBLIC_PATH='/etc.clientlibs/.../' node "$BIN" prod`.
- Run on **Node ≥ 22.11** (pv-scripts' current `engines` floor; some deps require it).
- First-run baseline: if unsure whether a failure is pre-existing, also build once
  with the project's *installed* pv-scripts (`cd "$PROJ" && npm run build:prod`) and
  compare.

## Step 3 — Evaluate the result

```sh
grep -iE "error|failed to compile|ERROR in|Module not found|Cannot find module|TS[0-9]{3,}" "$LOG" | head -20
tail -25 "$LOG"
find target -type f | wc -l        # expect a non-trivial artifact count
```

A pass = **exit code 0**, no error markers, and artifacts produced in `destPath`.

Distinguish failure causes — report which it is:
- **pv-scripts regression** (what we care about): a `Module not found` for a loader/
  plugin pv-scripts owns, a webpack-config crash, a broken loader option, etc.
- **Project-code issue** (NOT a pv-scripts regression): SASS deprecation warnings
  (e.g. `darken()`, `percentage()`), TypeScript errors in the project's own source,
  missing ambient declarations (`TS2882` for `import "./x.scss"`), etc. These are
  the consumer's to fix.

## Why direct-bin and NOT `npm link`

`npm link` is unreliable for this: it symlinks pv-scripts to a path **outside** the
consumer's tree, so npm no longer hoists pv-scripts' transitive deps into the
consumer's `node_modules`. Any module the consumer's own `webpack.config.js`
requires but does not declare itself (a **phantom dependency**, commonly
`mini-css-extract-plugin`, `webpack`) then fails with `MODULE_NOT_FOUND` — a
test-setup artifact, not a real bug. It also splits loaders (from the pv-scripts
tree) and plugins (from the consumer tree) across two module copies. Direct-bin
keeps the consumer install intact and avoids all of this.

If you must use `npm link` anyway, first ensure the consumer declares every module
its own webpack config `require()`s as a real `devDependency`.

## Cleanup

The build writes to the consumer's `destPath` (`target/`), which the project's own
build scripts regenerate — leaving it built is fine; mention it. Do not modify the
consumer's `package.json` or `node_modules`.
