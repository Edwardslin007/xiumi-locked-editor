# Cloudflare R2 图床配置说明

这套方案的底层逻辑是：

1. 当前网页工具负责选择图片、发起上传。
2. Cloudflare Worker 接收图片。
3. Worker 把图片写入 R2 存储桶。
4. Worker 返回一个公网图片 URL。
5. 当前工具把公众号 HTML 里的 `img src` 替换成这个公网 URL。

## 1. 创建 R2 存储桶

在 Cloudflare 后台进入 `R2 Object Storage`，新建一个 Bucket，例如：

```text
xiumi-images
```

## 2. 创建 Worker

在 Cloudflare 后台进入 `Workers & Pages`，新建一个 Worker，把本地文件里的代码复制进去：

```text
D:\WPS_Share\AI\秀米编辑器\cloudflare-r2-worker.js
```

## 3. 绑定 R2

在 Worker 的设置里找到 `Bindings`，新增 `R2 bucket` 绑定：

```text
Variable name: IMAGES_BUCKET
R2 bucket: xiumi-images
```

`IMAGES_BUCKET` 这个名字必须和脚本一致。

## 4. 配置环境变量

在 Worker 的 `Variables and Secrets` 里添加：

```text
UPLOAD_TOKEN=自己设置一个长一点的上传密钥
DEFAULT_PREFIX=xiumi
MAX_BYTES=20971520
```

可选变量：

```text
ALLOWED_ORIGIN=http://127.0.0.1:8765
PUBLIC_BASE_URL=https://你的图片域名
```

如果暂时没有自定义域名，可以不填 `PUBLIC_BASE_URL`。脚本会自动返回类似下面的地址：

```text
https://你的-worker.workers.dev/file/xiumi/2026/07/06/xxx.png
```

## 5. 在本地工具里填写

打开本地工具：

```text
http://127.0.0.1:8765/index.html
```

点击 `图床设置`，填写：

```text
Worker 地址：https://你的-worker.workers.dev
上传密钥：上面设置的 UPLOAD_TOKEN
文件名前缀：xiumi
```

点 `测试连接`，显示连接正常后即可使用。

## 6. 使用方式

单张图片：

```text
右侧图片卡片 -> 本地上传图床
```

已经替换成本地 base64 的图片：

```text
右侧图片卡片 -> 上传当前图片
```

批量处理：

```text
右侧底部 -> 批量上传图床
```

## 注意事项

- R2 的账号密钥不要写进 `index.html`。
- `UPLOAD_TOKEN` 会保存在当前浏览器本地，只适合你自己本机使用。
- 如果把这个网页发布到公网，必须改成登录鉴权或后端代理，不能直接暴露上传密钥。
- 公众号最终能不能稳定显示，取决于微信编辑器是否接受该图片域名。建议先用一篇测试草稿验证。
