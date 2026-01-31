# 文件上传 {#file-upload}

本文档描述 Cloudreve 中的文件上传流程。上传流程因存储策略类型而异，但通常遵循三步流程。

## 概述 {#overview}

完整的文件上传包含三个步骤：

1. **创建上传会话** - 从 Cloudreve 服务器请求上传会话
2. **上传分片** - 将文件数据分片上传到存储端
3. **完成上传** - 完成上传（部分存储策略需要）

对于小文件，可以考虑使用 [Update file content](https://cloudrevev4.apifox.cn/update-file-content-306591838e0) API 进行更简单的单次请求上传。

## 步骤 1：创建上传会话 {#create-session}

使用 [Create upload session](https://cloudrevev4.apifox.cn/create-upload-session-306671611e0) API 发起上传。响应包含：

- `session_id` - 此上传会话的唯一标识符
- `chunk_size` - 每个分片的字节大小
- `upload_urls` - 用于上传分片的预签名 URL（因存储策略而异）
- `credential` - 分片上传的认证凭证
- `expires` - 会话过期时间戳
- `storage_policy` - 存储策略配置，包括：
  - `policy_type` - 存储端类型
  - `chunk_concurrency` - 允许的最大并发分片上传数
  - `streaming_encryption` - 是否支持流式加密
- `encrypt_metadata` - 加密参数（如果启用了客户端加密）

## 步骤 2：上传分片 {#upload-chunks}

分片上传方法取决于存储策略类型：

### 本机 / 从机存储策略 {#local-remote}

对于本机存储，或任何 `storage_policy.relay` 设置为 `true` 的存储策略，使用 [Upload file chunk](https://cloudrevev4.apifox.cn/upload-file-chunk-306698012e0) API。

对于从机存储，将分片发送到 `upload_urls` 中的 URL（单个元素）。请求格式与本机分片上传类似，但有以下区别：

- 分片索引通过查询参数 `chunk` 传递，例如 `http://slave.example.com/api/v4/slave/upload/{session_id}?chunk=2`
- `Authorization` 请求头使用上传会话中的 `credential` 值，例如 `Bearer Cr sBnnQ3rZ-UBr7d8ohKpUFtsQc8OMLuWwn1VhuJtdc5k=:1749623351`

### S3 兼容存储策略 {#s3-compatible}

对于 S3、OSS、COS、OBS 和 KS3 存储策略，使用 `upload_urls` 中的预签名 URL（每个分片一个 URL）。请参考相应云服务商的分片上传文档：

- **S3**: [UploadPart](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html)
- **OSS**: [UploadPart](https://www.alibabacloud.com/help/zh/oss/developer-reference/uploadpart)
- **COS**: [UploadPart](https://cloud.tencent.com/document/product/436/7750)
- **OBS**: [上传段](https://support.huaweicloud.com/api-obs/obs_04_0099.html)
- **KS3**: 使用与 S3 相同的 API

### OneDrive {#onedrive}

对于 OneDrive 存储策略，使用 `upload_urls` 中的上传 URL 并带上字节范围请求头。请参考微软的 [Upload bytes to the upload session](https://learn.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_createuploadsession?view=odsp-graph-online#upload-bytes-to-the-upload-session) 文档。

### 七牛 {#qiniu}

对于七牛存储策略，请参考[分块上传数据](https://developer.qiniu.com/kodo/6366/upload-part)文档。

### 又拍云 {#upyun}

对于又拍云存储策略，请参考[大文件上传](https://help.upyun.com/knowledge-base/form_api/#e5a4a7e69687e4bbb6e4b88ae4bca0)文档。

## 步骤 3：完成上传 {#complete-upload}

完成步骤因存储策略而异：

| 存储策略 | 完成方式 |
| -------- | -------- |
| 本机 / 从机 / 又拍云 | 自动完成 - 最后一个分片上传后无需额外操作 |
| OneDrive | [Complete OneDrive upload](https://cloudrevev4.apifox.cn/complete-onedrive-upload-295173813e0) |
| S3 / KS3 | [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html)，然后调用 [Complete S3 upload](https://cloudrevev4.apifox.cn/complete-s3-upload-295177181e0) 回调 |
| OSS | [CompleteMultipartUpload](https://www.alibabacloud.com/help/zh/oss/developer-reference/completemultipartupload)（回调自动处理） |
| COS | [Complete Multipart Upload](https://cloud.tencent.com/document/product/436/7742)，然后调用 [Complete COS upload](https://cloudrevev4.apifox.cn/complete-cos-upload-295177009e0) 回调 |
| OBS | [合并段](https://support.huaweicloud.com/api-obs/obs_04_0102.html)，然后调用 [Complete OBS upload](https://cloudrevev4.apifox.cn/complete-obs-upload-295177687e0) 回调 |
| 七牛 | [完成文件上传](https://developer.qiniu.com/kodo/6368/complete-multipart-upload) |

## 分片上传 {#chunked-upload}

文件根据上传会话返回的 `chunk_size` 分割成多个分片。存储策略中的 `chunk_concurrency` 字段指定可同时上传的分片数量。

## 客户端加密 {#client-encryption}

当服务器启用文件加密时，上传会话响应包含 `encrypt_metadata`，其中包括：

- `cipher` - 加密算法（如 `aes-256-ctr`）
- `key_plain_text` - Base64 编码的加密密钥
- `iv` - Base64 编码的初始化向量

客户端应在上传前使用 AES-256-CTR 模式加密文件数据。使用流式加密时，分片边界无需与 AES 块边界对齐，根据分片在文件中的字节位置计算正确的计数器偏移量即可。

## 参考实现 {#reference}

完整的实现参考，请查看：

- **Web 前端**: [frontend/src/component/Uploader/core/uploader](https://github.com/cloudreve/frontend/tree/master/src/component/Uploader/core/uploader)
- **桌面客户端**: [desktop/crates/cloudreve-sync/src/uploader](https://github.com/cloudreve/desktop/tree/master/crates/cloudreve-sync/src/uploader)
