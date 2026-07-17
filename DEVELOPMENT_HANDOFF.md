# 开发交接说明

这份文件用于帮助下一次 Codex 会话或其他开发者快速接手项目。它补充 README，不保存任何真实密钥。

## A. 项目身份

- 本地目录：`D:\WPS_Share\AI\秀米编辑器`
- GitHub：<https://github.com/Edwardslin007/xiumi-locked-editor>
- GitHub Pages：<https://edwardslin007.github.io/xiumi-locked-editor/>
- 本地入口：`http://127.0.0.1:8765/index.html?uiFix=1783264610130`
- 默认分支：`main`
- 主程序：`index.html`
- Worker：`cloudflare-qiniu-worker.js`

## B. 开发者必须先知道的事实

1. 这是一个静态单页应用，不要默认引入数据库或后端框架。
2. 用户的核心要求是：修改文字和图片时尽量不破坏秀米原有样式。
3. 导出 HTML 是最终交付物，预览效果不是唯一标准。
4. 图片能在本地预览，不代表公众号一定能加载；最终 URL 建议使用 HTTPS。
5. Worker 的 AK/SK 和 `UPLOAD_TOKEN` 永远不能写入仓库。
6. `xiumi_exports/` 和临时文章文件可能含有用户真实内容，不能发布。
7. 当前工作区可能存在用户新建的扫描资料、文章和展示截图，修改时不要擅自删除。

## C. 继续开发前的启动顺序

```bash
cd /d "D:\WPS_Share\AI\秀米编辑器"
npm install
npm run check
npm run serve
```

然后打开 `http://127.0.0.1:8765/index.html?uiFix=1783266197507`。

## D. 建议每次会话开头提供给 Codex 的信息

```text
请在 D:\WPS_Share\AI\秀米编辑器 继续开发秀米 / 微信公众号 HTML 样式锁定编辑器。
先阅读 README.md 和 DEVELOPMENT_HANDOFF.md，再检查 git status。
项目的核心约束是：尽量保留用户粘贴 HTML 的原有内联样式和布局，只修改文字、图片及明确要求的内容属性。
不要提交 worker-access-info.txt、.dev.vars、.wrangler、xiumi_exports、真实七牛 AK/SK 或 UPLOAD_TOKEN。
改动后运行 npm run check，并说明实际修改了哪些文件、如何验证、还有哪些风险。
```

## E. 重要代码区域

在 `index.html` 中，后续开发通常可以按以下关键词定位：

- `parseAndLock`：解析输入并锁定源码。
- `getMarkedHtml`：获取带内部标记的当前 HTML。
- `cleanExportHtml`：导出前清理内部标记。
- `openTextEditor` / `saveTextEdit`：文字编辑流程。
- `renderImages`：右侧图片面板。
- `uploadBrowserImageToHostAndReplace`：本地图片上传并替换。
- `uploadRemoteImageToHostAndReplace`：远程图片转存并替换。
- `requestQiniuUploadToken`：向 Worker 请求七牛临时凭证。
- `undo` / `redo`：撤销重做。
- `renderTemplates` / `saveTemplate` / `loadTemplate`：模板管理。
- `chooseProjectFolder` / `saveSourceToProjectFolder`：项目文件夹保存。
- `copyCurrentSource` / `copyCurrentRichText`：两种复制路径。

具体函数名可能会随重构变化；修改前应先搜索当前代码，不要只依赖本文件。

## F. 最小回归测试清单

### 不配置图床时

- 粘贴 `examples/sample-xiumi.html`。
- 预览正常显示，文字和图片数量有统计。
- 修改一段文字并保存。
- 修改字体颜色、加粗、字号和对齐方式。
- 替换一张图片 URL。
- 选择本地图片替换一张图片。
- 点击撤销和重做，确认预览与源码同步。
- 点击“复制源码”，确认复制的是当前源码而不是示例源码。
- 点击“复制排版”，确认可粘贴到公众号正文区域。

### 配置图床后

- 测试 Worker 根地址或连接测试。
- 单张本地图片上传。
- 当前图片上传。
- 远程图片转存。
- 批量上传。
- 确认最终图片 URL 是可公开访问的 HTTPS 地址，并在浏览器返回 HTTP 200。

### 发布前

- 在手机宽度检查排版。
- 检查图片是否有防盗链、HTTP、403 或跨域问题。
- 把导出的 HTML 粘贴到微信公众号草稿箱。
- 对照本地预览检查边距、字号、图片比例、分割线和背景。

## G. 变更边界

### 通常可以安全修改

- 文字编辑器的交互、提示语和错误信息。
- 图片面板字段显示和定位按钮样式。
- 模板列表、历史记录和本地保存体验。
- README、交接文档、测试脚本和示例文件。
- 不改变 HTML 结构的 UI 样式。

### 修改前需要重点验证

- `parseAndLock`、`getMarkedHtml`、`cleanExportHtml`。
- 内联样式复制与富文本复制。
- 图片 URL 的替换和导出。
- Worker 的鉴权、CORS、远程图片抓取和七牛签名。
- `wrangler.toml` 的 Bucket、公开域名和上传区域。

### 不应直接做的事

- 不要用全局正则粗暴替换全部 HTML，容易破坏嵌套结构。
- 不要把所有文字节点重新包一层并覆盖原有 style。
- 不要把七牛 AK/SK 或 Worker 口令写进前端、示例、日志或 GitHub Actions 输出。
- 不要删除用户未提交的扫描资料、文章和展示资源。
- 不要在没有备份或用户确认的情况下重写整篇秀米 HTML。

## H. 当前待办建议

1. 拆分 `index.html`，建立可测试的 HTML 解析、导出和图片服务模块。
2. 增加真实浏览器自动化回归测试。
3. 增加 Worker 端到端测试和错误码说明。
4. 将七牛默认 HTTP 域名更换为 HTTPS 自定义域名。
5. 增加模板文件导入导出。
6. 增加文章项目管理和版本快照。
7. 为公开分享版增加登录、限流、上传配额和审计。

## I. 提交前报告模板

```text
本次修改：
- 文件：
- 功能：
- 是否影响导出 HTML：

验证：
- npm run check：通过 / 失败
- 本地页面：
- 手工测试：

风险与后续：
- 已知问题：
- 需要用户确认的事项：
```
