# 秀米 / 微信公众号 HTML 样式锁定编辑器

一个面向微信公众号排版的本地静态网页工具：把秀米编辑器复制出来的 HTML 或富文本粘贴进来后，工具会尽量保留原有的内联样式和布局结构，只开放文字、图片和少量内容属性的编辑入口。

项目地址：[GitHub 仓库](https://github.com/Edwardslin007/xiumi-locked-editor)

在线地址：[GitHub Pages](https://edwardslin007.github.io/xiumi-locked-editor/)

本地地址：`http://127.0.0.1:8765/index.html?uiFix=1783266197507`

## 1. 这个项目解决什么问题

秀米排版的 HTML 通常包含大量内联样式、嵌套容器和装饰图片。直接在可视化编辑器里改字或换图，容易误删结构，导致字号、间距、边框、背景和定位发生变化。

本工具采用“解析—标记—预览—导出”的思路：

1. 读取用户粘贴的 HTML。
2. 用 DOMParser 解析文档，但不主动重排原始布局。
3. 给可编辑文字和图片附加内部标记。
4. 在中间区域展示公众号排版预览。
5. 通过右侧面板或文字编辑框修改内容。
6. 导出时清理内部标记，只输出可粘贴到公众号的 HTML。

核心原则是：样式是“冻结的骨架”，文字和图片是“可替换的内容”。不过，HTML 的任何自动解析和重新序列化都可能存在边缘差异，因此正式发布前仍建议在微信公众号草稿箱里复核一次。

## 2. 当前功能

### HTML 与预览

- 粘贴秀米 HTML 或富文本后自动解析。
- 中间区域实时显示完整公众号排版效果。
- 左侧源码栏可收纳，右侧图片栏可收纳。
- 源码进入锁定状态后，源码框只读；点击“重新粘贴”可以重新导入。
- 显示 section、style、文字、图片数量等结构统计。
- 检测 HTTP 图片、本机路径、相对路径、Base64 和空图片地址，并给出风险提示。

### 文字编辑

- 点击预览中的文字段落，打开文字编辑框。
- 支持编辑文字内容。
- 支持常用文字格式：颜色、加粗、字号、左对齐、居中、右对齐等。
- 支持实时预览。
- 保存后关闭编辑框，并把编辑结果写回内部 HTML。

### 图片编辑

- 自动识别文章中的图片。
- 右侧显示图片 URL、分辨率、格式、alt、宽度等信息。
- 支持修改图片 URL、alt 和部分图片属性。
- 支持从本地文件夹选择图片替换当前图片。
- 支持把当前图片上传到图床。
- 支持把远程图片转存到图床。
- 支持批量上传文章内图片。
- 图片定位按钮会在预览中的对应图片位置显示，便于快速定位。

### 模板与历史

- 内置 `01模板`、`02模板`、`03模板` 三个模板槽位。
- 模板名称可以修改。
- 模板源码可以编辑、保存、载入和删除。
- 支持新建模板源码。
- 支持撤销和重做，当前历史记录上限为 60 步。

### 导出与本地保存

- “复制源码”：复制当前编辑后的完整 HTML 源码。
- “复制排版”：复制适合粘贴到微信公众号正文区的富文本片段。
- “复制示例源码”：复制示例源码，不会误用成当前源码。
- “保存源码文件”：下载当前 HTML 文件。
- 支持选择本地项目文件夹并保存源码文件。
- 支持复制已确认的项目路径。
- 公众号草稿箱入口：<https://mp.weixin.qq.com/cgi-bin/appmsg?begin=0&count=10&type=77&action=list_card&token=1255399380&lang=zh_CN>

## 3. 技术结构

```text
用户粘贴 HTML
      │
      ▼
index.html：DOMParser 解析与内部标记
      │
      ├── 中间：公众号排版预览
      ├── 文字：文字编辑器与格式操作
      ├── 图片：URL、属性、本地替换、图床操作
      ├── 模板：浏览器本地模板数据
      ├── 历史：撤销 / 重做快照
      └── 导出：源码复制、富文本复制、文件保存
      │
      ▼
Cloudflare Worker：校验 UPLOAD_TOKEN、签发七牛临时上传凭证
      │
      ▼
七牛云 Kodo：保存图片并返回公开 URL
```

项目目前是单页静态应用，不依赖数据库，也没有自己的登录系统。模板、图床配置和部分用户偏好保存在当前浏览器本地；换浏览器或清除网站数据后，需要重新配置。

## 4. 文件说明

```text
index.html                    主编辑器，页面结构、样式和前端逻辑都在这里
cloudflare-qiniu-worker.js    七牛云 Kodo 图床 Worker
cloudflare-qiniu-setup.md     七牛图床配置说明
cloudflare-r2-worker.js       备用的 Cloudflare R2 Worker 方案
cloudflare-r2-setup.md        R2 方案说明
wrangler.toml                 Worker 名称、七牛 Bucket、域名和上传区域配置
package.json                  本地服务、检查和 Worker 部署命令
scripts/check-html-scripts.cjs 检查 index.html 内联脚本语法
examples/sample-xiumi.html    示例秀米源码
showcase.html                 10 套公众号排版展示页
showcase-preview.html         单套排版预览页
showcase-data.js              展示页数据和内联样式 HTML
showcase-assets/              展示页图片和截图资源
.github/workflows/pages.yml   GitHub Pages 自动部署流程
DEVELOPMENT_HANDOFF.md        后续会话继续开发时的交接资料
```

以下内容不能提交到公开仓库：

- `worker-access-info.txt`：本地 Worker 信息记录。
- `.dev.vars`：本地 Worker 环境变量。
- `.wrangler/`：Wrangler 本地状态。
- `xiumi_exports/`：可能含有用户剪贴板文章内容。
- 临时生成的个人文章 HTML、扫描文件和日志。
- 七牛 `AccessKey`、`SecretKey` 和 Worker `UPLOAD_TOKEN`。

这些规则已经写入 `.gitignore`，但开发者仍需在提交前检查 `git status`。

## 5. 本地运行

要求：Node.js 18+、npm、Python 3，以及现代 Chrome 或 Edge 浏览器。

```bash
npm install
npm run serve
```

然后打开：

```text
http://127.0.0.1:8765/index.html
```

在 Codex 中使用固定入口时打开：

```text
http://127.0.0.1:8765/index.html?uiFix=1783266197507
```

也可以直接使用 Python：

```bash
python -m http.server 8765
```

## 6. 使用流程

1. 打开本地页面或 GitHub Pages 页面。
2. 从秀米复制 HTML，粘贴到左侧源码框。
3. 等待中间预览完成，确认布局和图片数量正常。
4. 点击预览中的文字，修改文字或文字格式。
5. 在右侧图片面板修改 URL、alt，或选择本地图片替换。
6. 如果要发布图片，先配置图床，再使用“本地上传图床”“上传当前图片”或“批量上传图床”。
7. 修改前后可以使用撤销 / 重做按钮。
8. 发布到公众号前，点击“复制源码”或“复制排版”，再粘贴到对应区域。
9. 在公众号草稿箱里检查图片加载、换行、间距和手机端显示。

## 7. 七牛云 + Cloudflare Worker 图床

当前采用“浏览器拿临时凭证，图片直传七牛”的结构：

- Cloudflare Worker 保存七牛 AK/SK，不把 AK/SK 放到网页前端。
- 前端用 Worker 地址和 `UPLOAD_TOKEN` 调用 `/token`。
- Worker 返回短期七牛上传凭证。
- 浏览器把图片直传七牛 Kodo。
- 远程图片转存通过 Worker 的 `/fetch-upload` 完成。

当前项目配置的非敏感信息：

```text
Worker：https://xiumi-qiniu-image-host.edwardslin1130.workers.dev
Bucket：edwards20260706
上传区域：https://up-z2.qiniup.com
公开域名：http://thqcs8zxp.hn-bkt.clouddn.com
```

部署自己的 Worker 时，先在 Cloudflare 登录，再配置 Worker Secret：

```bash
npx wrangler secret put QINIU_ACCESS_KEY
npx wrangler secret put QINIU_SECRET_KEY
npx wrangler secret put UPLOAD_TOKEN
npm run deploy:worker
```

网页中的“图床设置”只填写：

```text
Worker 地址：你的 Worker URL
Worker 访问口令：你设置的 UPLOAD_TOKEN
文件名前缀：例如 xiumi
```

不要把七牛 AK/SK 或 `UPLOAD_TOKEN` 写入 `index.html`、`wrangler.toml` 或 README。访问口令不能从 Cloudflare 原值回显；忘记后应重新设置一个新口令。

安全和可用性注意事项：

- 公开多人使用时，不能只依赖一个共享 `UPLOAD_TOKEN`，应增加登录、限流、额度和审计。
- 当前示例公开域名是 HTTP，长期用于微信公众号建议绑定 HTTPS CDN 域名。
- 远程图片转存功能会让 Worker 请求外部图片地址，应继续限制协议、大小、内容类型和请求频率。
- 图床配置保存在当前浏览器本地，不会自动同步给其他设备。

## 8. 检查、提交和部署

语法检查：

```bash
npm run check
```

该命令会检查 `index.html` 中的内联脚本，并检查 `cloudflare-qiniu-worker.js` 的 JavaScript 语法。

部署 Worker：

```bash
npm run deploy:worker
```

部署静态页面：

1. 把变更推送到 `main`。
2. GitHub Actions 执行 `.github/workflows/pages.yml`。
3. 在仓库 Settings → Pages 中确认 Source 使用 GitHub Actions。
4. 访问 <https://edwardslin007.github.io/xiumi-locked-editor/>。

推荐提交前执行：

```bash
git status
npm run check
git diff -- README.md DEVELOPMENT_HANDOFF.md
```

## 9. 已知限制

- `index.html` 仍是一个较大的单文件，后续维护成本较高。
- HTML 经过 DOMParser 解析和序列化后，极端情况下可能出现属性顺序或空白差异。
- 不能保证所有秀米私有标签、脚本或特殊复制格式都能完全保留。
- 浏览器不能直接可靠地暴露电脑完整路径，项目文件夹保存依赖浏览器的 File System Access API。
- 模板、历史记录和图床配置主要是浏览器本地状态，不是云端项目数据。
- 公众号对外链图片、HTTP 图片、图片尺寸和防盗链有自己的限制；工具导出的 HTML 仍需在草稿箱实际验证。
- 当前没有自动化的真实浏览器回归测试，也没有 Worker 端到端测试。

## 10. 推荐后续方向

1. 把 `index.html` 拆成 HTML、CSS、解析器、编辑器、图片服务、模板和历史记录模块。
2. 增加 Playwright 或浏览器手工回归清单，覆盖粘贴、文字编辑、图片替换、复制和撤销重做。
3. 把 Worker 的 CORS、文件大小、远程 URL、内容类型和限流策略收紧。
4. 将默认 HTTP 图片域名切换为自定义 HTTPS CDN。
5. 增加源码导入 / 导出模板文件功能，减少浏览器本地数据丢失风险。
6. 增加清晰的错误诊断：图片加载失败、Worker 未配置、口令错误、七牛返回错误分别提示。
7. 为公开部署增加访问鉴权、上传额度和日志审计。

## 11. 许可证

MIT License，详见 [LICENSE](LICENSE)。
