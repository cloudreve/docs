# Neon Object Storage (S3 兼容) {#neon}

使用 [Neon Object Storage](https://neon.com/docs/storage/overview) 配合 S3 兼容存储策略存储文件。

## 配置 {#configure}

在要使用的分支上创建一个存储桶，可以在 Neon 控制台的 `Storage` 页面创建，也可以使用 [Neon CLI](https://neon.com/docs/reference/neon-cli)：

```bash
neon buckets create cloudreve --project-id <project-id> --branch <branch>
```

创建一个具有存储读写权限的凭证，可以在 Neon 控制台 `Connect` -> `Storage` -> `Reveal credential` 中获取，也可以使用 Neon CLI：

```bash
neon credentials create --scope storage:read --scope storage:write --name cloudreve --project-id <project-id> --branch <branch>
```

在 Cloudreve 创建一个 `S3 兼容` 存储策略，按照下面规则填写信息：

- 存储策略中的 `Bucket 名称` 填写刚刚创建的存储桶名称；
- 存储策略中的 `Endpoint` 填写分支的 S3 端点，即 Neon 控制台中显示的 `AWS_ENDPOINT_URL_S3`，比如 `https://br-cool-darkness-a1b2c3d4.storage.c-1.us-east-2.aws.neon.tech`；
- 勾选 `强制路径格式 Endpoint`，Neon Object Storage 仅支持路径格式地址；
- 存储策略中的 `地区代码` 填写 Neon 项目所在的 AWS 地区，即 Neon 控制台中显示的 `AWS_REGION`，比如 `us-east-2`；
- 存储策略中的 `访问凭证` 中，`Access Key ID` 填写 `token_id`，`Secret Access Key` 填写 `s3_secret_access_key`；
- 将 `文件大小限制` 设置为不超过 `5 GB`，Neon Object Storage 单个对象最大为 5 GiB。

::: tip 分支

每个 Neon 分支都有独立的 S3 端点，存储桶会随数据库一起分支。请将存储策略指向保存 Cloudreve 所用数据的分支端点。凭证在创建它的分支以及从该分支创建的所有分支上有效。

:::

### 跨域策略

存储桶需要配置跨域策略后才能使用 Cloudreve 网页端上传或浏览文件。Neon Object Storage 支持 `PutBucketCors`，你可以在添加存储策略时让 Cloudreve 自动配置跨域策略。

## 使用公开访问的存储桶 {#public-access}

::: warning 警告

使用公开访问的存储桶时，任何人都可以不经授权访问你的文件。

:::

存储桶的访问权限在 Neon 侧设置，无法通过 S3 API 修改。如需创建公开访问的存储桶，请在创建时传入 `--access-level public_read`：

```bash
neon buckets create cloudreve --access-level public_read --project-id <project-id> --branch <branch>
```

然后在存储策略设置中将 `Bucket 读写权限` 设置为 `公共读`，并保持勾选 `强制路径格式 Endpoint`。文件的访问地址为 `<endpoint>/<bucket>/<key>`。

## 常见问题 {#faq}

::: details 上传报错 `请求失败: AxiosError: Network Error`

1. 检查存储策略 `Endpoint` 设置是否正确，以及是否勾选了 `强制路径格式 Endpoint`；
2. 检查是否设置了跨域策略，以及跨域策略是否配置正确；
3. 检查 `设置` -> `文件系统` -> `上传会话有效期 (秒)`，其值应小于 `604800`。

:::

::: details 上传报错 `无法创建上传会话: 未知错误 (failed to create multipart upload: AccessDenied: Access Denied`

1. 检查存储策略的 `访问凭证` 是否正确，以及凭证是否同时具有 `storage:read` 和 `storage:write` 权限；
2. 检查凭证是否创建在 `Endpoint` 所属的分支或其上级分支上。

:::

::: details 下载的文件名与 Cloudreve 中显示的文件名不一致

此问题仅出现在公有存储桶中。对于公有存储桶，Cloudreve 使用未签名的 URL，而 Neon Object Storage 会忽略匿名请求中的 `response-content-disposition` 参数，因此下载的文件会以 Blob 名称命名。请在存储策略设置中开启 `下载中转`，由 Cloudreve 代理下载并设置文件名。开启后，下载流量将经过你的 Cloudreve 服务器。

:::

::: details 上传超过 5 GB 的文件失败

Neon Object Storage 单个对象最大为 5 GiB。请将存储策略中的 `文件大小限制` 设置为不超过 `5 GB`。

:::
