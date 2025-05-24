# MinIO (S3 兼容) {#minio}

使用 [MinIO](https://min.io/) 配合 S3 兼容存储策略存储文件。

## 配置 {#configure}

参考 [MinIO 官方文档](https://min.io/docs/minio/kubernetes/upstream/) 部署你的 MinIO 集群。

1. 使用 Web 面板或命令行工具 [`mc mb`](https://min.io/docs/minio/linux/reference/minio-mc/mc-mb.html) 创建一个存储桶；
2. 使用 Web 面板或命令行工具 [`mc admin accesskey create`](https://min.io/docs/minio/linux/reference/minio-mc-admin/mc-admin-accesskey-create.html) 创建一组访问密钥。

在 Cloudreve 创建一个 `S3 兼容` 存储策略，按照下面规则填写信息：

- 存储策略中的 `Bucket 名称` 填写刚刚创建的存储桶名称；
- 存储策略中的 `Endpoint` 填写你的 MinIO 集群的 API 端点，勾选 `强制路径格式 Endpoint`;
- 存储策略中的 `地区代码` 填写为 `us-east-1`；
- 存储策略中的 `访问凭证` 填写为刚刚创建的访问密钥的 `Access Key` 和 `Secret Key`；

MinIO 不需要配置跨域策略，点击 `我已自行设置` 跳过跨域策略创建。

## 常见问题 {#faq}

::: details 上传报错 `分片上传失败: X-Amz-Expires must be less than a week (in seconds)`

检查 `设置` -> `文件系统` -> `上传会话有效期 (秒)`，其值应小于 `604800`。

:::

::: details 上传报错 `请求失败: AxiosError: Network Error`

1. 请检查用户是否能够连接到你的 MinIO 集群 API 端点；
2. 如果你的 Cloudreve 站点开启了 HTTPS，请为 MinIO 端点配置 HTTPS，或者经由 Web 服务器反向代理 MinIO 端点；

:::

::: details 中转上传失败，提示 `无法解析响应`

1. 展开详细错误，检查错误信息中是否含有 `413 Request Entity Too Large` 字样。

   如果有，请修改 Nginx 反代配置，设定或增大 `client_max_body_size` 的值，比如 `client_max_body_size 20000m;`。此设定值应大于上传文件的大小。

2. 检查是否有外部 WAF 防火墙拦截了上传请求。

:::

::: details 使用 Nginx 反代后的 MinIO 端点，无法上传或进行任何文件操作。

1. 如果你的反代后的端点包含了端口号，在配置 Nginx 时，请将 `proxy_set_header` 设定为 `$http_host`:

   ```nginx
   proxy_set_header Host $host; # [!code --]
   proxy_set_header Host $http_host; # [!code ++]
   ```

2. 如果文件新建、删除操作正常，但是无法从 Web 端上传文件，请尝试在 Nginx 反代配置中加入 `proxy_cache_convert_head off;`。

:::
