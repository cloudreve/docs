# File Upload {#file-upload}

This document describes the file upload process in Cloudreve. The upload flow varies depending on the storage policy type, but generally follows a three-step process.

## Overview {#overview}

A complete file upload consists of three steps:

1. **Create upload session** - Request an upload session from Cloudreve server
2. **Upload chunks** - Upload file data in chunks to the storage provider
3. **Complete upload** - Finalize the upload (for some storage policies)

For small files, consider using the [Update file content](https://cloudrevev4.apifox.cn/update-file-content-306591838e0) API for a simpler single-request upload.

## Step 1: Create Upload Session {#create-session}

Use the [Create upload session](https://cloudrevev4.apifox.cn/create-upload-session-306671611e0) API to initiate an upload. The response includes:

- `session_id` - Unique identifier for this upload session
- `chunk_size` - Size of each chunk in bytes
- `upload_urls` - Pre-signed URLs for uploading chunks (varies by storage policy)
- `credential` - Authentication credential for chunk uploads
- `expires` - Session expiration timestamp
- `storage_policy` - Storage policy configuration including:
  - `policy_type` - Type of storage provider
  - `chunk_concurrency` - Maximum concurrent chunk uploads allowed
  - `streaming_encryption` - Whether streaming encryption is supported
- `encrypt_metadata` - Encryption parameters (if client-side encryption is enabled)

## Step 2: Upload Chunks {#upload-chunks}

The chunk upload method depends on the storage policy type:

### Local / Remote Storage Policy {#local-remote}

For local storage, or any storage policy with `storage_policy.relay` set to `true`, use the [Upload file chunk](https://cloudrevev4.apifox.cn/upload-file-chunk-306698012e0) API.

For remote (slave node) storage, send chunks to the URL in `upload_urls` (single element). The request format is similar to the local chunk upload, with these differences:

- Chunk index is passed via query parameter `chunk`, e.g., `http://slave.example.com/api/v4/slave/upload/{session_id}?chunk=2`
- `Authorization` header uses the `credential` value from the upload session, e.g., `Bearer Cr sBnnQ3rZ-UBr7d8ohKpUFtsQc8OMLuWwn1VhuJtdc5k=:1749623351`

### S3-Compatible Storage Policies {#s3-compatible}

For S3, OSS, COS, OBS, and KS3 storage policies, use the pre-signed URLs in `upload_urls` (one URL per chunk). Refer to the respective cloud provider's multipart upload documentation:

- **S3**: [UploadPart](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html)
- **OSS**: [UploadPart](https://www.alibabacloud.com/help/en/oss/developer-reference/uploadpart)
- **COS**: [UploadPart](https://www.tencentcloud.com/document/product/436/7750)
- **OBS**: [Uploading Parts](https://support.huaweicloud.com/intl/en-us/api-obs/obs_04_0099.html)
- **KS3**: Uses the same API as S3

### OneDrive {#onedrive}

For OneDrive storage policy, use the upload URL from `upload_urls` with byte range headers. Refer to Microsoft's [Upload bytes to the upload session](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createuploadsession?view=odsp-graph-online#upload-bytes-to-the-upload-session) documentation.

### Qiniu {#qiniu}

For Qiniu storage policy, refer to [Upload Part](https://developer.qiniu.com/kodo/6366/upload-part) documentation.

### Upyun {#upyun}

For Upyun storage policy, refer to [Large File Upload](https://help.upyun.com/knowledge-base/form_api/#e5a4a7e69687e4bbb6e4b88ae4bca0) documentation.

## Step 3: Complete Upload {#complete-upload}

The completion step varies by storage policy:

| Storage Policy | Completion Method |
| -------------- | ----------------- |
| Local / Remote / Upyun | Automatic - no action required after last chunk |
| OneDrive | [Complete OneDrive upload](https://cloudrevev4.apifox.cn/complete-onedrive-upload-295173813e0) |
| S3 / KS3 | [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html), then [Complete S3 upload](https://cloudrevev4.apifox.cn/complete-s3-upload-295177181e0) callback |
| OSS | [CompleteMultipartUpload](https://www.alibabacloud.com/help/en/oss/developer-reference/completemultipartupload) (callback handled automatically) |
| COS | [Complete Multipart Upload](https://www.tencentcloud.com/document/product/436/7742), then [Complete COS upload](https://cloudrevev4.apifox.cn/complete-cos-upload-295177009e0) callback |
| OBS | [Completing a Multipart Upload](https://support.huaweicloud.com/intl/en-us/api-obs/obs_04_0102.html), then [Complete OBS upload](https://cloudrevev4.apifox.cn/complete-obs-upload-295177687e0) callback |
| Qiniu | [Complete Multipart Upload](https://developer.qiniu.com/kodo/6368/complete-multipart-upload) |

## Chunked Upload {#chunked-upload}

Files are split into chunks based on the `chunk_size` returned by the upload session. The `chunk_concurrency` field in the storage policy specifies how many chunks can be uploaded simultaneously.

## Client-Side Encryption {#client-encryption}

When file encryption is enabled on the server, the upload session response includes `encrypt_metadata` containing:

- `cipher` - Encryption algorithm (e.g., `aes-256-ctr`)
- `key_plain_text` - Base64-encoded encryption key
- `iv` - Base64-encoded initialization vector

The client should encrypt file data using AES-256-CTR mode before uploading. With streaming encryption, chunk boundaries don't need to align with AES block boundaries - calculate the correct counter offset for each chunk based on its byte position in the file.

## Reference Implementation {#reference}

For a complete implementation reference, see:

- **Web**: [frontend/src/component/Uploader/core/uploader](https://github.com/cloudreve/frontend/tree/master/src/component/Uploader/core/uploader)
- **Desktop**: [desktop/crates/cloudreve-sync/src/uploader](https://github.com/cloudreve/desktop/tree/master/crates/cloudreve-sync/src/uploader)
