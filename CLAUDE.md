# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`pv-fe-tools` is a **Lerna monorepo** (independent versioning) of front-end tooling packages published to npm under the `@pro-vision/*` scope. Most packages are zero-config CLIs that consumer projects install as dev dependencies. The toolchain is built around **webpack** (bundling) and **Handlebars** (templating / living styleguides).

Use Node `v22.11.0` (see `.nvmrc`). CI lints against Node 22/24. Note: `pv-scripts` requires Node `>=22.11.0`; other packages may still run on older Node.

## Commands

Run from the repo root unless noted:

```sh
npm run bootstrap      # lerna bootstrap — installs + symlinks local packages (run this first after clone)
npm run lint           # eslint packages   (CI runs this; no test suite exists)
npm run lint:fix       # eslint --fix packages
npm run build          # lerna run build   (effectively only builds pv-stylemark's UI)
npm run commit         # git-cz — interactive Conventional Commit message
npm run publish        # lerna publish --conventional-commits (maintainers only)
```

There are **no real tests** — `npm test` runs `lerna run test`, but every package's `test` script is a placeholder (`echo`). Do not assume a test harness exists; verify behavior manually or via the `examples/` consumer project.

### Building pv-stylemark's UI

```sh
cd packages/pv-stylemark && npm run build   # tsc && vite build → outputs to lib/
```

### Commit conventions (enforced)

A Husky `commit-msg` hook (`scripts/verify-commit-msg.js`) **rejects commits** that don't match the Conventional Commits format: `type(scope): subject` (≤50 char subject). Allowed types: `feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build`. A `pre-commit` hook runs `lint-staged` (eslint on `*.js`). Package versions and changelogs are derived from these commit messages at publish time.

## Packages

| Package | npm name | Binary | Purpose |
| --- | --- | --- | --- |
| `pv-scripts` | `@pro-vision/pv-scripts` | `pv-scripts` | Zero-config webpack frontend toolchain (`dev`/`prod`) |
| `pv-stylemark` | `@pro-vision/pv-stylemark` | `pv-stylemark` | Living Styleguide (LSG) toolchain + webpack plugin |
| `assemble-lite` | `@pro-vision/assemble-lite` | — | Library to render Handlebars files via Node |
| `handlebars-helpers` | `@pro-vision/handlebars-helpers` | — | Shared collection of `pv-*` Handlebars helpers |
| `custom-elements-data-extractor` | `@pro-vision/custom-elements-data-extractor` | `pv-custom-data` | Extracts custom-element attrs → VSCode HTML custom data |
| `pv-create-component` | `@pro-vision/pv-create-component` | `pv-create-component` | Interactive component-boilerplate scaffolder |
| `vscode-pv-handlebars-language-server` | (unpublished) | — | VSCode LSP extension for Handlebars in Assemble projects |

Packages are mostly plain CommonJS Node (`.js`). The exceptions are the `ui/` of `pv-stylemark` and the `vscode-*` extension, which are TypeScript.

## Key architectural patterns

### Shared `pv.config.js` convention

Both `pv-scripts` and `pv-stylemark` are configured by a single `pv.config.js` file in the **consumer project root**. Each package independently loads it and shallow-merges it over its own defaults:

- `pv-scripts`: `config/default.config.js` + `helpers/buildConfigHelpers.js` (`getBuildConfig`)
- `pv-stylemark`: `config/default.config.js` + `helper/paths.js`

When changing config behavior, update both the default config and the corresponding README config table.

### pv-scripts: composable webpack config

This is the most involved package. Flow:

1. `bin/pv-scripts.js` parses `dev`/`prod` + flags (`--stats`/`--statsJson` set `PV_WEBPACK_STATS`), then spawns `scripts/dev.js` or `scripts/prod.js`.
2. `helpers/prepareWebpackConfig.js` builds the final config by merging (via `webpack-merge`) the default config from `webpack/getConfig.js` with the consumer's optional `webpack.config.js` + `webpack.config.{dev,prod}.js`.
3. The default config is assembled **compositionally** in `webpack/base/combinedConfig.js`: each concern is an isolated module under `webpack/base/settings/*` (entry, output, resolve, …) and `webpack/base/tasks/*` (compileJS, compileCSS, loadHandlebars, …). Tasks are conditionally merged based on config flags (`useTS`, `copyStaticFiles`, etc.). `dev/` and `prod/` then overlay mode-specific settings.

To add a build capability, add a module under `webpack/base/tasks/` and merge it (conditionally if needed) in `combinedConfig.js` — don't inline logic into existing tasks.

### pv-stylemark: two ways to build the LSG

The styleguide build is driven by discrete tasks under `tasks/clickdummy/*` (assemble component/page clickdummies) and `tasks/lsg/*` (`buildDDS`, build the Stylemark styleguide). These are orchestrated two ways:

- **CLI** (`scripts/dev.js` watch mode / `scripts/prod.js` one-shot) — see `scripts/buildStylemarkLsg.js`.
- **Webpack plugin** (`webpack-plugin/index.js`, `PvStylemarkPlugin`) — hooks `compiler.hooks.emit`, registers files via `getFilesToWatch.js`, and re-runs only the affected tasks (assemble vs. copy) on change.

Internally it renders Handlebars via `assemble-lite` and registers `handlebars-helpers`. The `ui/` directory holds the styleguide's own TS web components (`dds-*`) and styles, built by Vite into `lib/` (committed/published, not built on install).

### assemble-lite + handlebars-helpers

`assemble-lite` is a thin Handlebars renderer (`assemble-lite.js` → `Assemble.js`/`Visitor.js`) that takes globs for partials/pages/templates/data/helpers. The `handlebars-helpers` collection (`pv-choose`, `pv-colors`, `pv-icons`, `pv-path`, `pv-concat`) is bundled into it automatically. These are the shared templating substrate beneath `pv-stylemark`.

## Conventions

- **ESLint** extends `prettier`; `.ts` files are ignored by lint (`ignorePatterns`), and `pv-stylemark/` is entirely excluded via `.eslintignore`. Prettier violations are eslint errors.
- Each package vendors its own `node_modules` and `package-lock.json` (Lerna bootstrap symlinks the local cross-dependencies).
- `examples/react-tsx/` is a runnable consumer project for `pv-scripts` (its own `pv.config.js`) — use it to manually verify `pv-scripts` changes.
