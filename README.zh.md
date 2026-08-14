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

### 一键安装(推荐)

克隆仓库并运行安装脚本;它会**安装并启用**插件,无需手改 YAML:

```sh
git clone https://github.com/LucasN0820/dsh-skin-claude-code
cd dsh-skin-claude-code
node scripts/install.mjs
```

要指定其他 profile,传入其名称:

```sh
node scripts/install.mjs my-profile
```

脚本是幂等的——重复运行也安全。

### 手动安装

如果你更想自己一步步来:

**1. 将包加入你的 profile**

```sh
dsh plugin --profile web add dsh-skin-claude-code
```

该命令会转发给 `web` profile 目录内的 pnpm,把包安装到 harness 解析树外插件的位置。

> 如果你是从本地 clone 安装而非 registry:
>
> ```sh
> dsh plugin --profile web add ../dsh-skin-claude-code
> ```

**2. 在你的 profile patch 中启用它**

在你的 profile 的 `cordis.patch.yml`
(`$DSH_HOME/profiles/web/cordis.patch.yml`,或 `$DSH_HOME/cordis.patch.yml` 作为 home 级覆盖)里加:

```yaml
- insert:
    - id: claude-code-skin
      name: dsh-skin-claude-code
```

`insert` 会把这一行追加到组合条目列表的顶层——也就是 `dsh.client` 行所在的**浏览器插件清单**。

**3. 重启**

```sh
dsh web
```

皮肤会在加载时生效。如果浏览器已打开,刷新即可。

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
