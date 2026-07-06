# 秀米样式锁定编辑器

这是一个面向微信公众号排版的本地/静态网页工具。核心目标是：把从秀米编辑器复制出来的 HTML 样式锁住，只修改文字和图片，避免误删排版结构。

## 主要功能

- 粘贴秀米 HTML 或富文本后自动锁定源码结构。
- 中间区域实时预览公众号排版效果。
- 点击文字段落弹出编辑框，支持加粗、颜色、字号、对齐等常见格式。
- 右侧自动列出图片，可查看地址、尺寸、格式和 alt 文本。
- 支持本地图片替换、图片 URL 替换。
- 支持七牛云 Kodo + Cloudflare Worker 上传凭证图床。
- 支持源码模板、撤销/重做、一键复制完整源码。
- 支持选择项目文件夹，把当前源码 HTML 保存到指定文件夹，并复制项目路径。

## 本地启动

```bash
python -m http.server 8765
```

打开：

```text
http://127.0.0.1:8765/index.html
```

## GitHub Pages 部署

本仓库内置 `.github/workflows/pages.yml`。推送到 `main` 分支后，GitHub Actions 会自动部署静态页面。

## 七牛云图床

当前方案不依赖 Cloudflare R2。Cloudflare Worker 只负责保存七牛 AK/SK 并签发上传凭证，浏览器拿到凭证后直传七牛云。

当前默认配置：

```text
Bucket: edwards20260706
Public domain: http://thqcs8zxp.hn-bkt.clouddn.com
Upload endpoint: https://up-z2.qiniup.com
```

部署 Worker：

```bash
npx wrangler secret put QINIU_ACCESS_KEY
npx wrangler secret put QINIU_SECRET_KEY
npx wrangler secret put UPLOAD_TOKEN
npx wrangler deploy
```

在网页工具里点击 `图床设置`，填写 Worker 地址、上传口令和文件名前缀。

## 安全说明

- 不要把七牛 `AccessKey` / `SecretKey` 或微信 AppSecret 写进 `index.html`。
- 上传口令只适合个人使用；如果公开给多人用，应接入登录鉴权、用量限制和域名限制。
- 微信公众号最终是否接受图片域名，建议先用测试草稿验证。
