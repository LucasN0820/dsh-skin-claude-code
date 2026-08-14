# dsh-skin-claude-code

[English](README.md) | 中文

一款 **Claude Code 风格**的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面皮肤。

它用 Claude Code 的标志性观感重新渲染浏览器界面:

- **暖炭黑 / 暖米白**的界面底色,替代默认的冷灰
- **陶土橙强调色**(`#D97757`),用于品牌色、焦点环、光标、链接与滚动条
- **等宽终端字体**(JetBrains Mono / ui-monospace 回退)
- 暖色调的代码块与 `code`/`pre` 表面

皮肤以「令牌覆盖层」的形式叠加在当前生效主题之上,因此会随 **亮色 / 暗色 / 跟随系统** 自动适配。

---

## 安装

本插件是一个以 npm 包形式发布的客户端 Cordis 插件,没有宿主端逻辑——整层皮肤都活在浏览器半区。

### 1. 将包加入你的 profile

```sh
dsh plugin --profile web add dsh-skin-claude-code
```

该命令会转发给 `web` profile 目录内的 pnpm,把包安装到 harness 解析树外插件的位置。

> 如果你是从本地 clone 安装而非 registry:
>
> ```sh
> dsh plugin --profile web add ../dsh-skin-claude-code
> ```

### 2. 在你的 profile patch 中启用它

在你的 profile 的 `cordis.patch.yml`
(`$DSH_HOME/profiles/web/cordis.patch.yml`,或 `$DSH_HOME/cordis.patch.yml` 作为 home 级覆盖)里加一行:

```yaml
- id: claude-code-skin
  name: dsh-skin-claude-code
```

这一行必须落在 **浏览器插件清单**(组合配置里列出 `dsh.client` 行的区块)。在你自己的 patch 层里用一个裸的 `insert` 即可实现;具体形态取决于你是否已有清单区块——见下方说明。

### 3. 重启

```sh
dsh web
```

皮肤会在加载时生效。如果浏览器已打开,刷新即可。

### patch 位置说明

`cordis.patch.yml` 的层是按 `id` 替换目标行的整个 `config`。要**新增**一行而非修改已有行,请使用 `insert:` 块。向浏览器清单追加皮肤的最小自包含写法是:

```yaml
insert:
  - id: claude-code-skin
    name: dsh-skin-claude-code
```

把它放在 patch 文件的顶层。如果你是在一个已经自定义了清单的部署之上叠加,请对应地把 `insert:` 放到相同位置。

---

## 卸载

```sh
dsh plugin --profile web remove dsh-skin-claude-code
```

从 `cordis.patch.yml` 中删除 `claude-code-skin` 行并重启。

---

## 工作原理

- `package.json` 通过 `dsh.client` 清单声明客户端半区:`platform: web`,并 `inject` 了 `@deepseek-ai/dsh-client-ui-theme`。
- `lib/index.js` 是空操作的宿主半区(纯客户端插件仍需导出一个宿主入口,组合加载器才能解析该行)。
- `lib/client.js` 向 `window.__ModuleLoader__` 注册自身,激活后:
  - 调用 `ctx.theme.overrideTokens("dsh-skin-claude-code", TOKENS)` —— 在生效主题之上叠加一个可逆的令牌层,携带亮/暗两套取值;
  - 注入一个 `<style>` 元素实现等宽/终端观感,挂在 Cordis fiber 上,停止/更新/删除时自动清理。

不使用任何产品内部 DOM 选择器——只用公开的 `--dsw-alias-*` 主题令牌和通用元素——因此皮肤在 harness 升级后能安全降级。

---

## 自定义

编辑 `lib/client.js` 里的 `TOKENS` 映射和 `CSS` 模板,然后重新发布(或从你的 clone 安装)。`lib/` 下的两个文件是手写的构建产物,迭代时无需任何打包步骤。

## License

[MIT](./LICENSE)
