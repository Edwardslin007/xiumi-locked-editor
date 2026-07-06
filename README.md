# 秀米样式锁定编辑器

> 版本冻结说明：当前冻结版本用于继续 fork 开发和交接，冻结日期为 2026-07-06。该版本包含本地静态编辑器、微信公众号排版预览、图片替换、七牛云 Kodo 图床、Cloudflare Worker 上传凭证服务、源码复制/富文本复制拆分、项目文件夹保存等核心能力。

## 项目定位

秀米样式锁定编辑器是一个面向微信公众号排版的本地/静态网页工具。它解决的问题是：从秀米、公众号编辑器或其他 HTML 排版工具复制出来的文章，往往结构复杂、内联样式多，普通编辑容易误删布局或破坏样式。本工具会把原始 HTML 解析后锁定结构，只暴露文字与图片编辑入口，让用户在不破坏排版骨架的前提下替换内容、调整图片、复制最终源码或富文本排版。

适合场景：

- 从秀米复制一篇排版稿，锁定结构后只改文字和图片。
- 将本地图片上传到七牛云图床，并把公开 URL 写回 HTML。
- 快速制作微信公众号文章源码，复制到公众号草稿箱继续发布。
- 给运营/编辑人员提供一个本地可运行、无需后端数据库的轻量排版工具。
- 作为静态网页项目发布到 GitHub Pages，继续由其他开发者 fork 迭代。

## 当前核心功能

- 粘贴 HTML 或富文本后自动解析并锁定源码结构。
- 中间区域实时预览公众号排版效果。
- 点击预览中的文字段落，弹出文字编辑器，支持加粗、颜色、字号、对齐等常用格式。
- 右侧自动识别图片，展示图片地址、格式、尺寸、alt 文本和样式宽度。
- 支持本地图片替换、图片 URL 替换、当前图片上传图床、本地图片上传图床。
- 支持七牛云 Kodo + Cloudflare Worker 上传凭证图床。
- 支持远程图片经 Worker 转存到七牛云。
- 支持批量上传文章内图片到图床。
- 支持源码模板管理。
- 支持撤销/重做。
- 支持项目文件夹保存，把当前源码保存到指定本地目录。
- 支持 GitHub Pages 静态部署。
- 顶部复制能力已拆分为两个按钮：
  - `复制源码`：复制完整 HTML 源码文本，适合粘贴到源码框或保存。
  - `复制排版`：复制适合公众号正文区域粘贴的富文本片段，使用 `<!--StartFragment-->` / `<!--EndFragment-->` 包裹正文。

## 项目结构

```text
.
├── index.html                     # 主应用，静态单页工具
├── cloudflare-qiniu-worker.js      # 七牛云 Kodo 上传凭证 Worker
├── cloudflare-qiniu-setup.md       # 七牛云图床配置说明
├── cloudflare-r2-worker.js         # 旧版/备用 R2 Worker 方案
├── cloudflare-r2-setup.md          # R2 方案说明
├── wrangler.toml                   # Cloudflare Worker 部署配置
├── package.json                    # npm 脚本和 Wrangler 依赖
├── package-lock.json               # 依赖锁定文件
├── scripts/check-html-scripts.cjs   # 检查 index.html 内联脚本语法
├── examples/                       # 示例资源
└── .github/workflows/pages.yml      # GitHub Pages 自动部署配置
```

不应提交的本地文件：

- `worker-access-info.txt`：本地 Worker 地址和访问口令记录。
- `.dev.vars`：本地 Worker 环境变量。
- `.wrangler/`：Wrangler 本地状态。
- `xiumi_exports/`：可能包含用户粘贴过的文章内容。
- 临时生成的文章 HTML，例如 `workbuddy-article.html`。

## 必要条件

### 基础运行

- Windows/macOS/Linux 均可运行。
- 现代浏览器，推荐 Chrome 或 Edge。
- Python 3，用于本地静态服务：

```bash
python -m http.server 8765
```

或使用 npm 脚本：

```bash
npm run serve
```

### 开发与检查

- Node.js 18+，推荐 Node.js 20+。
- npm。
- 安装依赖：

```bash
npm install
```

- 检查内联脚本和 Worker 语法：

```bash
npm run check
```

### Cloudflare Worker 图床

如果只做本地排版和源码编辑，可以不配置图床。如果需要图片上传到七牛云，需要以下条件：

- Cloudflare 账号。
- Wrangler CLI。
- 七牛云 Kodo 存储空间。
- 七牛云 `AccessKey` 和 `SecretKey`。
- 七牛云 Bucket 名称。
- 七牛云公开访问域名。
- 上传区域对应 endpoint，例如华南 z2 常用 `https://up-z2.qiniup.com`。
- 一个自定义的 `UPLOAD_TOKEN`，作为前端访问 Worker 的上传口令。

## 本地启动

```bash
npm install
npm run serve
```

打开：

```text
http://127.0.0.1:8765/index.html
```

当前 Codex 技能固定入口使用：

```text
http://127.0.0.1:8765/index.html?uiFix=1783266197507
```

## 使用流程

1. 打开本地页面。
2. 把秀米或公众号编辑器中的 HTML/富文本粘贴到左侧源码框。
3. 工具自动锁定源码结构，并在中间预览排版。
4. 点击预览中的文字段落进行编辑。
5. 在右侧图片面板替换图片、改 alt 文本或上传图床。
6. 使用顶部按钮导出：
   - 要保存或交给开发者：点击 `复制源码`。
   - 要粘贴到公众号正文编辑区：点击 `复制排版`。
   - 要落盘：点击 `保存源码文件`。

## 七牛云图床配置

当前方案不依赖 Cloudflare R2。Cloudflare Worker 只负责安全保存七牛 AK/SK，并签发临时上传凭证；浏览器拿到凭证后直传七牛云 Kodo。

### 1. 配置 wrangler.toml

`wrangler.toml` 中可以公开提交的是非敏感配置：

```toml
name = "xiumi-qiniu-image-host"
main = "cloudflare-qiniu-worker.js"
compatibility_date = "2026-07-01"
workers_dev = true

[vars]
DEFAULT_PREFIX = "xiumi"
MAX_BYTES = "20971520"
ALLOWED_ORIGIN = "*"
QINIU_BUCKET = "your-bucket"
QINIU_PUBLIC_DOMAIN = "https://your-cdn-domain.example.com"
QINIU_UPLOAD_URL = "https://up-z2.qiniup.com"
```

不要把七牛 AK/SK 或上传口令写进 `wrangler.toml`。

### 2. 写入 Worker Secret

```bash
npx wrangler secret put QINIU_ACCESS_KEY
npx wrangler secret put QINIU_SECRET_KEY
npx wrangler secret put UPLOAD_TOKEN
```

### 3. 部署 Worker

```bash
npm run deploy:worker
```

或：

```bash
npx wrangler deploy
```

### 4. 在网页里配置图床

打开编辑器，点击 `图床设置`，填写：

```text
Worker 地址：https://your-worker.your-subdomain.workers.dev
Worker 访问口令：你设置的 UPLOAD_TOKEN
文件名前缀：xiumi
```

保存后可以点击测试连接。实际上传会调用：

- `POST /token`：本地图片上传，Worker 返回七牛上传凭证。
- `POST /fetch-upload`：远程图片转存，Worker 拉取远程图片后上传七牛。

## 安全边界

- 不要提交七牛 `AccessKey`、`SecretKey`、`UPLOAD_TOKEN`。
- 不要提交 `worker-access-info.txt`。
- 不要提交 `.dev.vars`。
- 不要发布 `xiumi_exports/` 下的用户文章内容。
- 默认七牛测试域名如果是 HTTP，公众号长期使用前建议绑定自有 HTTPS CDN 域名。
- `UPLOAD_TOKEN` 只适合个人或小范围使用。如果公开多人使用，应增加登录鉴权、频率限制、域名限制和审计日志。
- 前端只保存 Worker 地址和上传口令到当前浏览器本地，不应保存七牛 AK/SK。

## GitHub Pages 部署

仓库内置 `.github/workflows/pages.yml`。推送到 `main` 分支后，GitHub Actions 会自动部署静态页面。

部署后访问地址通常为：

```text
https://<github-user>.github.io/xiumi-locked-editor/
```

注意：GitHub Pages 只能部署静态前端。图床签名能力必须另行部署 Cloudflare Worker。

## 开发注意事项

- 这是单文件静态应用，主要逻辑在 `index.html`。
- 编辑器通过 DOMParser 解析输入 HTML，再给可编辑文字和图片打内部标记。
- 导出源码时会清理内部编辑器标记。
- `复制源码` 只复制 HTML 源码文本。
- `复制排版` 写入富文本剪贴板格式，适合公众号正文区域。
- 如果修改复制逻辑，需要同时验证：
  - 粘贴到源码框时能看到完整 HTML。
  - 粘贴到公众号正文区域时能保留主要内联样式。
  - 复制失败时有明确提示。
- 如果修改图片上传逻辑，需要同时验证：
  - 本地图片上传。
  - 远程图片转存。
  - 批量上传。
  - 七牛公开 URL HTTP 200。

## 常用命令

```bash
# 安装依赖
npm install

# 本地启动
npm run serve

# 检查 index.html 内联脚本和 Worker 语法
npm run check

# 部署 Cloudflare Worker
npm run deploy:worker

# 设置上传口令
npm run secret:worker
```

## Fork 继续开发建议

接手者建议按以下顺序上手：

1. Fork 仓库并拉到本地。
2. 运行 `npm install`。
3. 运行 `npm run check`。
4. 运行 `npm run serve`，打开本地页面。
5. 先用无图床模式测试粘贴、编辑、复制源码、复制排版。
6. 再部署自己的 Cloudflare Worker 和七牛 Kodo。
7. 在页面 `图床设置` 中写入自己的 Worker 地址和 `UPLOAD_TOKEN`。
8. 测试本地图片上传、远程图片转存和批量上传。
9. 最后再启用 GitHub Pages。

推荐优先迭代方向：

- 将 `index.html` 拆分为模块化前端工程。
- 给复制源码/复制排版增加更明确的剪贴板格式诊断。
- 增加模板导入导出。
- 增加图片压缩、水印、尺寸裁剪。
- 增加多篇文章项目管理。
- 增加 Worker 侧鉴权、限流、日志和 CORS 白名单。

## 当前冻结版本交接清单

- 主编辑器：可用。
- 本地预览：可用。
- 文字编辑：可用。
- 图片面板：可用。
- 七牛云图床：已验证可上传。
- Cloudflare Worker：已验证 `/token` 和七牛上传链路。
- 复制源码：已拆分为源码文本复制。
- 复制排版：已拆分为公众号富文本复制。
- GitHub Pages 工作流：已配置。
- 安全敏感信息：不得提交，需由接手者自行配置。

## License

MIT
