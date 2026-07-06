# 七牛云 Kodo 图床配置说明

这套方案的底层逻辑：

1. 前端网页选择图片。
2. 前端向 Cloudflare Worker 请求七牛上传凭证。
3. Worker 使用七牛 `AccessKey` 和 `SecretKey` 生成临时上传 token。
4. 浏览器拿 token 后直传七牛云 Kodo。
5. 前端把返回的公开 URL 写回公众号 HTML 的 `img src`。

## Worker Secret

不要把下面两个密钥写入仓库文件，只放到 Worker Secret：

```bash
npx wrangler secret put QINIU_ACCESS_KEY
npx wrangler secret put QINIU_SECRET_KEY
npx wrangler secret put UPLOAD_TOKEN
```

## 当前配置

```text
Worker: xiumi-qiniu-image-host
Bucket: edwards20260706
CDN domain: http://thqcs8zxp.hn-bkt.clouddn.com
Upload endpoint: https://up-z2.qiniup.com
```

注意：当前七牛默认域名的 HTTPS 证书不匹配，所以暂时使用 HTTP 公开 URL。正式给公众号长期使用时，建议在七牛云绑定自己的 HTTPS CDN 域名。

## 前端填写

```text
Worker 地址：https://xiumi-qiniu-image-host.edwardslin1130.workers.dev
上传口令：Worker Secret 里的 UPLOAD_TOKEN
文件名前缀：xiumi
```
