# dsh-skin-claude-code

A **Claude Code–inspired skin** for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) web GUI.

It restyles the browser surface with Claude Code's signature look:

- **Warm charcoal / warm cream** surfaces instead of the stock cool grays
- **Terracotta accent** (`#D97757`) for brand, focus, caret, links, and scrollbars
- **Monospace terminal typography** (JetBrains Mono / ui-monospace fallback)
- Warm-tinted code blocks and `code`/`pre` surfaces

The skin stacks a token-override layer over whatever theme is active, so it
adapts automatically to **light**, **dark**, and **system** preferences.

---

## Install

The plugin is a client-side Cordis plugin shipped as an npm package. It has no
host-side behavior — the whole skin lives in the browser half.

### 1. Add the package to your profile

```sh
dsh plugin --profile web add dsh-skin-claude-code
```

This forwards to pnpm inside the `web` profile directory, installing the
package where the harness resolves out-of-tree plugins.

> If you install from a local clone instead of the registry:
>
> ```sh
> dsh plugin --profile web add ../dsh-skin-claude-code
> ```

### 2. Enable it in your profile patch

Add one row to your profile's `cordis.patch.yml`
(`$DSH_HOME/profiles/web/cordis.patch.yml`, or `$DSH_HOME/cordis.patch.yml` for
a home-wide override):

```yaml
- id: claude-code-skin
  name: dsh-skin-claude-code
```

The row must land in the **browser plugin roster** (the section of the composed
config that lists the `dsh.client` rows). A bare `insert` in your own patch
layer achieves this; the exact shape depends on whether you already have a
roster block — see the note below.

### 3. Restart

```sh
dsh web
```

The skin applies on load. Refresh the browser if it was already open.

### Patch placement note

`cordis.patch.yml` layers replace a targeted row's whole `config` by `id`. To
add a *new* row rather than edit an existing one, use an `insert:` block. The
minimal, self-contained form that appends the skin to the browser roster is:

```yaml
insert:
  - id: claude-code-skin
    name: dsh-skin-claude-code
```

Place this at the top level of your patch file. If you are layering on top of a
deployment that already customizes the roster, mirror its `insert:` location.

---

## Uninstall

```sh
dsh plugin --profile web remove dsh-skin-claude-code
```

Remove the `claude-code-skin` row from your `cordis.patch.yml` and restart.

---

## How it works

- `package.json` declares the client half through the `dsh.client` manifest:
  `platform: web` and an `inject` on `@deepseek-ai/dsh-client-ui-theme`.
- `lib/index.js` is the no-op host half (client-only plugins still export a
  host entry so the composition loader can resolve the row).
- `lib/client.js` registers with `window.__ModuleLoader__`, then on activation:
  - calls `ctx.theme.overrideTokens("dsh-skin-claude-code", TOKENS)` — a
    reversible token layer over the active theme, with light/dark values;
  - injects a `<style>` element for the monospace/terminal chrome, owned by the
    Cordis fiber so stop/update/remove cleans it up.

No product DOM selectors are used — only the public `--dsw-alias-*` theme
tokens and generic elements — so the skin degrades safely across harness
updates.

---

## Customize

Edit the `TOKENS` map and `CSS` template in `lib/client.js`, then republish (or
install from your clone). The two files under `lib/` are hand-written build
artifacts, so no bundler step is required to iterate.

## License

[MIT](./LICENSE)
