# @SCOPE/cli

CLI for [@SCOPE/ui](../ui). Copies component styles — or whole components — into your project.

```sh
npx @SCOPE/cli init
npx @SCOPE/cli add button dialog
```

## Modes

Set during `init`, stored in `ui.config.json`:

- **package** — you install `@SCOPE/ui` from npm and import components from it. `add` copies only the consumer-owned `*.variants.css` files into your styles dir; you own and edit those.
- **vendor** — shadcn-style. `add` copies the component source (plus its transitive dependencies and utils) into your project. Relative imports between components are preserved; util imports are rewritten to your configured alias.

## Commands

- `init` — asks a few questions, writes `ui.config.json`.
- `add <component...>` — adds components. Flags: `--all`, `--overwrite`. On collision you're prompted per file (`y/N/all`); non-interactive runs skip existing files.

Component names are kebab-case (`dropdown-menu`, `form/checkbox`). The list of available names lives in the installed package's `registry.json`, and `add` prints it when given an unknown name.

## Requirements

- Node 20+
- package mode: `@SCOPE/ui` installed in the target project (the CLI reads its bundled registry — no network involved)
