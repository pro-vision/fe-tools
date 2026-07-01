---
name: post-publish
description: >-
  Finish a release after `lerna publish` has run on `develop` (the
  "chore(root): Publish packages" commit is on develop, versions/tags/CHANGELOGs
  updated, packages pushed to npm). Does the two manual follow-up steps: (1) create
  a GitHub release per newly published package with notes taken from that package's
  CHANGELOG.md, and (2) fast-forward `master` to `develop`. Also strips any
  Co-Authored-By / tool trailers that leaked into a CHANGELOG. Use right after a
  successful publish; do NOT use to run the publish itself.
---

# Post-publish: GitHub releases from CHANGELOGs + fast-forward master

The publish itself (`npm run publish` → `lerna publish --conventional-commits`)
bumps versions, writes CHANGELOGs, tags, and pushes to npm on `develop`. Two things
are **not** automated and are done here, mirroring the established process:

1. one **GitHub release per published package**, body copied from its `CHANGELOG.md`
2. **fast-forward `master`** to the published `develop` tip

Branch model: work lands on `develop`; `master` is fast-forwarded to `develop` after
each release (no merge commit). Lerna uses **independent versioning**, so a single
publish can bump several packages (some only as "Version bump only").

## Step 0 — Sync and locate the publish

```sh
cd "$(git rev-parse --show-toplevel)"
git fetch --all --tags --prune

# the most recent publish commit on develop
PUB=$(git log develop --grep="chore(root): Publish packages" -1 --format=%H)
echo "publish commit: $PUB"
git show --stat "$PUB" | sed -n '1,20p'

# tags created by that publish = exactly the packages that were published
git tag --points-at "$PUB"
```

Sanity checks before doing anything outward-facing:

```sh
git rev-list --left-right --count develop...origin/develop   # expect "0	0" (in sync)
git tag --points-at "$PUB" | while read t; do git ls-remote --tags origin "refs/tags/$t" >/dev/null && echo "on origin: $t"; done
```

If `develop` is **not** in sync with `origin/develop`, stop and reconcile first —
the release + fast-forward must reflect exactly what was published.

## Step 1 — Strip leaked trailers from CHANGELOGs (defensive)

`lerna`/conventional-changelog usually takes only the commit **subject**, but
commit-message trailers (e.g. `Co-Authored-By:`) have leaked into CHANGELOGs before
(see commit `docs(changelog): strip leaked trailers & fix scss links`). Check:

```sh
grep -rn -e "Co-[Aa]uthored-[Bb]y" -e "Generated with" -e "noreply@anthropic" packages/*/CHANGELOG.md
```

- **No hits** → nothing to do; continue.
- **Hits** → remove those lines from the affected `CHANGELOG.md`(s), then commit and
  push on `develop` **before** creating releases (so the release notes are clean):

  ```sh
  git add packages/*/CHANGELOG.md
  git commit -m "docs(changelog): strip leaked trailers"   # passes the commit-msg hook
  git push origin develop
  PUB=$(git log develop --grep="chore(root): Publish packages" -1 --format=%H)  # unchanged
  ```

  This cleanup commit rides along in the Step 3 fast-forward.

## Step 2 — Create a GitHub release per published package

For each tag from Step 0, the package dir is derived from the tag
(`@pro-vision/<pkg>@<version>` → `packages/<pkg>`) and the release body is that
version's section of the package `CHANGELOG.md`. Extract + create:

```sh
for TAG in $(git tag --points-at "$PUB"); do
  PKG=$(printf '%s\n' "$TAG" | sed -E 's#^@pro-vision/([^@]+)@.*#\1#')
  VER=$(printf '%s\n' "$TAG" | sed -E 's#.*@##')
  CL="packages/$PKG/CHANGELOG.md"
  NOTES="$(mktemp -t relnotes).md"
  # slice from this version's header to the next version header
  awk -v ver="$VER" '
    $0 ~ ("^#+ \\[" ver "\\]") {p=1}
    p && seen && $0 ~ /^#+ \[/ {exit}
    p {print; if ($0 ~ ("^#+ \\[" ver "\\]")) seen=1}
  ' "$CL" | sed -e 's/[[:space:]]*$//' > "$NOTES"
  echo "----- $TAG -----"; cat "$NOTES"
  gh release create "$TAG" --title "$TAG" --notes-file "$NOTES" --verify-tag
done
```

Then make the flagship package's release the repo **Latest** (GitHub/`gh` otherwise
marks whichever release was created last). The primary package is **pv-scripts**:

```sh
LATEST_TAG=$(git tag --points-at "$PUB" | grep '/pv-scripts@' | head -1)
[ -n "$LATEST_TAG" ] && gh release edit "$LATEST_TAG" --latest
gh release list --limit 6
```

Notes:
- Create a release for **every** published tag, including "Version bump only" ones —
  that matches prior releases (one per npm package).
- Release title == tag name (e.g. `@pro-vision/pv-scripts@6.0.1`), matching history.
- `--verify-tag` guards against typos; the tag must already be on `origin` (Step 0).

## Step 3 — Fast-forward master to develop

`master` must be a strict ancestor of `develop` (it always is with the develop→master
flow). Verify, then push — no local `master` checkout needed:

```sh
MB=$(git merge-base origin/master develop); MT=$(git rev-parse origin/master)
if [ "$MB" = "$MT" ]; then
  git push origin develop:master
else
  echo "NOT a fast-forward — master has commits not on develop; STOP and investigate"
fi
# verify
git ls-remote origin refs/heads/master refs/heads/develop
```

Both refs should now point at the same SHA.

## Done — report

Summarize: the release URLs (one per package, note which is Latest), whether any
trailers were stripped, and the `old..new  develop -> master` fast-forward line.
