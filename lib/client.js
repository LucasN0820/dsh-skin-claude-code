// Claude Code skin — browser half of the plugin.
//
// Registers itself with the DSH client module loader, then, on activation,
// stacks a token-override layer over the active theme (light AND dark) and
// injects the monospace/terminal chrome CSS. Both effects are owned by the
// Cordis fiber, so stopping or removing the plugin cleans everything up.
window.__ModuleLoader__.load({
  id: "dsh-skin-claude-code",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    // Claude Code palette. Warm charcoal / warm cream surfaces, terracotta
    // accent, and warm neutrals in place of the stock cool grays.
    const TOKENS = {
      "--dsw-alias-bg-base": { light: "#FAF9F5", dark: "#1F1E1B" },
      "--dsw-alias-bg-layer-1": { light: "#FFFFFF", dark: "#262523" },
      "--dsw-alias-bg-layer-2": { light: "#F3F1EA", dark: "#2E2C29" },
      "--dsw-alias-bg-overlay": { light: "#FFFFFF", dark: "#33312D" },
      "--dsw-alias-border-l1": { light: "#E8E6DF", dark: "#37342F" },
      "--dsw-alias-border-l2": { light: "#D6D3CA", dark: "#4A463F" },
      "--dsw-alias-brand-primary": { light: "#C96442", dark: "#D97757" },
      "--dsw-alias-label-primary": { light: "#1F1E1B", dark: "#F0EEE8" },
      "--dsw-alias-label-secondary": { light: "#6B675E", dark: "#A8A49B" },
      "--dsw-alias-state-error-primary": { light: "#D64545", dark: "#E5484D" },
      "--dsw-alias-state-success-primary": { light: "#1F7A4D", dark: "#46A758" },
      "--dsw-alias-state-warn-primary": { light: "#B7791F", dark: "#E2A33B" },
      "--dsw-specific-sidebar-fill": { light: "#F3F1EA", dark: "#1A1917" },
    };

    // Monospace terminal typography + terracotta chrome. Generic selectors and
    // theme CSS variables only — no product DOM hooks, so it degrades safely.
    const CSS = `
      html, body {
        font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', 'SFMono-Regular',
          Menlo, Consolas, 'Liberation Mono', monospace !important;
      }

      ::selection {
        background-color: var(--dsw-alias-brand-primary, #D97757);
        color: #ffffff;
      }

      textarea, input, [contenteditable='true'] {
        caret-color: var(--dsw-alias-brand-primary, #D97757);
      }

      :focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary, #D97757);
        outline-offset: 1px;
      }

      a {
        color: var(--dsw-alias-brand-primary, #D97757);
      }

      code {
        background: color-mix(in srgb, var(--dsw-alias-label-primary, #F0EEE8) 8%, transparent);
        border: 1px solid var(--dsw-alias-border-l1, #37342F);
        border-radius: 4px;
        padding: 0 4px;
      }

      pre {
        background: var(--dsw-alias-bg-layer-2, #2E2C29);
        border: 1px solid var(--dsw-alias-border-l1, #37342F);
        border-radius: 6px;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--dsw-alias-border-l2, #4A463F) transparent;
      }
      *::-webkit-scrollbar { width: 10px; height: 10px; }
      *::-webkit-scrollbar-track { background: transparent; }
      *::-webkit-scrollbar-thumb {
        background: var(--dsw-alias-border-l2, #4A463F);
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      *::-webkit-scrollbar-thumb:hover {
        background: var(--dsw-alias-brand-primary, #D97757);
        background-clip: content-box;
      }
    `;

    const inject = ["theme"];

    function apply(ctx) {
      ctx.effect(
        () => ctx.theme.overrideTokens("dsh-skin-claude-code", TOKENS),
        "claude-code-skin: tokens",
      );

      ctx.effect(() => {
        const style = document.createElement("style");
        style.dataset.plugin = "dsh-skin-claude-code";
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }, "claude-code-skin: css");
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  },
});
