# 对比

Cloudreve 支持多种底层存储策略，但是由于 API 限制等各方面因素，Cloudreve 对每种策略的支持程度并不一致，本章节将会详细列出不同存储策略之间的具体支持性区别。

## 基本对比

|           |          本机          |          从机          |          七牛          |          OSS         |          COS          |          又拍云         |       OneDrive       | S3                   |
| --------- | :------------------: | :------------------: | :------------------: | :------------------: | :-------------------: | :------------------: | :------------------: | -------------------- |
| 上传        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 分片上传      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |          :x:          |          :x:         | :white\_check\_mark: | :white\_check\_mark: |
| 下载        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 复制        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 移动        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 普通预览      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Office 预览 | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 删除        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 缩略图       | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :x:                  |
| 打包下载      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 真实文件名下载   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: |
| 理论最大文件    |          无限          |          无限          |          无限          |          无限          |          5GB          |         150GB        |          未知          | 无限                   |
| 公网接入要求    |           无          |           无          |          需要          |          需要          |           需要          |          需要          |          需要          | 需要                   |
| 可用于对公使用   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: |       以 ToS 为准       | :x:                  |

## 高级功能

|      |          本机          |          从机          |          七牛          |          OSS         |          COS         |          又拍云         |       OneDrive       | S3                   |
| ---- | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | -------------------- |
| 离线下载 | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 下载限速 | :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: | :white\_check\_mark: |          :x:         |          :x:         | :x:                  |
| 直链获取 | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :x:                  |
| 解压缩  | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 压缩   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
|      |                      |                      |                      |                      |                      |                      |                      |                      |

## 流量路径

|             | 本机                   | 从机                   | 七牛                   | OSS                  | COS                  | 又拍云                  | OneDrive             | S3                   |
| ----------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Web 上传客户端直传 | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 下载直传        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| 打包下载/压缩/解压缩 | 直传                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   |
| 离线下载        | 直传                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   |
| 文本编辑        | 直传                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   | 中转                   |
| WebDAV 上传直传 | :white\_check\_mark: | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  |
| WebDAV 下载直传 | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
