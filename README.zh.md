# dsh-skin-claude-code

[English](README.md) | 中文

一款 **Claude Code 风格**的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面皮肤。

它用 Claude Code 的标志性观感重新渲染浏览器界面:

- **暖炭黑 / 暖米白**的界面底色,替代默认的冷灰
- **陶土橙强调色**(`#D97757`),用于品牌色、焦点环、光标、链接与滚动条
- **等宽终端字体**(JetBrains Mono / ui-monospace 回退)
- 暖色调的代码块与 `code`/`pre` 表面

皮肤以「令牌覆盖层」的形式叠加在当前生效主题之上,因此会随 **亮色 / 暗色 / 跟随系统** 自动适配。

## 预览

| 暗色 | 亮色 |
| --- | --- |
| ![Claude Code 皮肤 - 暗色](https://raw.githubusercontent.com/LucasN0820/dsh-skin-claude-code/main/docs/screenshots/skin-dark.png) | ![Claude Code 皮肤 - 亮色](https://raw.githubusercontent.com/LucasN0820/dsh-skin-claude-code/main/docs/screenshots/skin-light.png) |

---

## 安装

本包是一个 DSH **bundle**:其 `package.json` 声明了 `dsh.bundle.patch`,因此
`dsh plugin add` 会**既安装又自动注册**它为 profile 层,**无需修改 `cordis.patch.yml`**。

```sh
dsh plugin --profile web add dsh-skin-claude-code
dsh web
```

要指定其他 profile,改 `--profile` 即可。仓库里还附带一个便捷脚本:

```sh
./install.sh            # 可选参数:profile 名,默认 web
```

### 为什么无需手改 patch

`dsh plugin add` 会先转发给 profile 目录内的 pnpm,再对 `dsh.profile.bundles` 列表做一次对账:
凡 `package.json` 声明了 `dsh.bundle.patch` 的依赖,会被自动追加进该列表。启动时,加载器应用每个
bundle 自带的 `cordis.patch.yml`(其中包含插入皮肤行的 `- insert:`),因此插件无需任何手工组合编辑即可挂载。

---

## 卸载

```sh
dsh plugin --profile web remove dsh-skin-claude-code
dsh web
```

---

## 工作原理

- `package.json` 声明了两件事:
  - `dsh.bundle.patch` → `cordis.patch.yml`,负责插入插件行;
  - `dsh.client`(`platform: web`,`inject` 了 `@deepseek-ai/dsh-client-ui-theme`),负责提供浏览器半区。
- `lib/index.js` 是空操作的宿主半区(纯客户端插件仍需导出一个宿主入口,组合加载器才能解析该行)。
- `lib/client.js` 向 `window.__ModuleLoader__` 注册自身,激活后:
  - 调用 `ctx.theme.overrideTokens("dsh-skin-claude-code", TOKENS)` —— 在生效主题之上叠加一个可逆的令牌层,携带亮/暗两套取值;
  - 注入一个 `<style>` 元素实现等宽/终端观感,挂在 Cordis fiber 上,停止/更新/删除时自动清理。

不使用任何产品内部 DOM 选择器——只用公开的 `--dsw-alias-*` 主题令牌和通用元素——因此皮肤在 harness 升级后能安全降级。

---

## 自定义

编辑 `lib/client.js` 里的 `TOKENS` 映射和 `CSS` 模板,然后重新发布(或从你的 clone 安装)。`lib/` 下的文件是手写的构建产物,迭代时无需任何打包步骤。

## License

[MIT](./LICENSE)
