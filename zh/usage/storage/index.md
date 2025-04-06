# 对比存储策略 {#compare-storage-policies}

Cloudreve 支持多种存储提供商，但是由于 API 限制等各方面因素，Cloudreve 对每种策略的支持程度并不一致，本章节将会详细列出不同存储策略之间的具体支持性区别。

你可以在 `管理面板` -> `存储策略` -> `新增存储策略` 新建并配置存储策略。

<div style="overflow-x: auto;word-break: keep-all; white-space: nowrap;">

| 功能                                               | 本机               | 从机               | OSS                                                 | COS                                                 | 七牛               | 又拍云             | OBS                            | OneDrive                                    | S3                                                  |
| -------------------------------------------------- | ------------------ | ------------------ | --------------------------------------------------- | --------------------------------------------------- | ------------------ | ------------------ | ------------------------------ | ------------------------------------------- | --------------------------------------------------- |
| 分片上传                                           | :white_check_mark: | :white_check_mark: | :white_check_mark:                                  | :white_check_mark:                                  | :white_check_mark: | :x:                | :white_check_mark:             | :white_check_mark:                          | :white_check_mark:                                  |
| 原生缩略图                                         | :white_check_mark: | :white_check_mark: | :white_check_mark:                                  | :white_check_mark:                                  | :white_check_mark: | :white_check_mark: | :white_check_mark:             | :white_check_mark:                          | :x:                                                 |
| 自定义限速 [注 1](#custom-speed-limit)             | :white_check_mark: | :white_check_mark: | :white_check_mark:                                  | :white_check_mark:                                  | :white_check_mark: | :x:                | :white_check_mark:             | :x:                                         | :x:                                                 |
| 理论最大文件大小                                   | 无限               | 无限               | 无限                                                | 无限                                                | 无限               | 150 GB             | 48.8 TB                        | 250 GB                                      | 无限                                                |
| 未中转私有直链 [注 2](#private-direct-link)        | :white_check_mark: | :white_check_mark: | :white_check_mark:                                  | :white_check_mark:                                  | :white_check_mark: | :white_check_mark: | :white_check_mark:             | :x:                                         | :x:                                                 |
| 未中转公有直链 [注 3](#public-direct-link)         | :white_check_mark: | :white_check_mark: | :white_check_mark:                                  | :white_check_mark:                                  | :white_check_mark: | :white_check_mark: | :white_check_mark:             | :x:                                         | :white_check_mark:                                  |
| 回调要求 [注 4](#callback-required)                | -                  | 需要               | 需要                                                | -                                                   | 需要               | 需要               | 需要                           | -                                           | -                                                   |
| 跨域配置 [注 5](#cors-required)                    | -                  | 需要               | 需要                                                | 需要                                                | -                  | -                  | 需要                           | -                                           | 需要                                                |
| 内网 Endpoint [注 6](#internal-endpoint)           | -                  | :x:                | :white_check_mark:                                  | [注 7](#internal-endpoint-cos)                      | :x:                | :x:                | [注 8](#internal-endpoint-obs) | :x:                                         | :x:                                                 |
| 友好文件名下载 [注 9](#friendly-filename-download) | :white_check_mark: | :white_check_mark: | [注 10](#friendly-filename-download-private-bucket) | [注 10](#friendly-filename-download-private-bucket) | :white_check_mark: | :white_check_mark: | :white_check_mark:             | [注 11](#friendly-filename-download-enable) | [注 10](#friendly-filename-download-private-bucket) |

</div>

**备注**

1. `自定义限速` 指在用户组中配置的下载限速能否生效。对于第三方存储策略，限速设置依赖签名保障不被随意修改，因此请使用私有读的存储桶。{#custom-speed-limit}
2. `未中转私有直链` 指当存储桶类型为 `私有` 时，如果未开启中转直链，获取到的原始直链能否长期有效。{#private-direct-link}
3. `未中转公有直链` 指当存储桶类型为 `公有` 时，如果未开启中转直链，获取到的原始直链能否长期有效。{#public-direct-link}
4. `回调要求` 指 Cloudreve 实例是否需要接收来此存储端的回调请求。对于需要接收回调的存储策略，你的 `主要站点 URL` 设置需要有效，且能够被存储端访问。{#callback-required}
5. `跨域配置` 指是否需要为存储桶设置跨域配置。在创建存储策略时，Cloudreve 可以帮你设置。{#cors-required}
6. `内网 Endpoint` 指是否支持配置内网 Endpoint。当 Cloudreve 和存储桶位于同一云服务提供商时，可以配置 Cloudreve 的服务端请求使用内网 Endpoint，从而降低延迟和成本。{#internal-endpoint}
7. 使用 COS 官方域名时，在可用地域内会自动解析要内网 Endpoint：[内网和外网访问](https://cloud.tencent.com/document/product/436/6224#.E5.86.85.E7.BD.91.E5.92.8C.E5.A4.96.E7.BD.91.E8.AE.BF.E9.97.AE){#internal-endpoint-cos}
8. 需要手动配置 `hosts` 将公共 Endpoint 解析到内网：[在 ECS 上通过内网访问 OBS 方案概述](https://support.huaweicloud.com/bestpractice-obs/obs_05_0410.html){#internal-endpoint-obs}
9. `友好文件名下载` 指是否支持下载时得到的文件名就是用户在文件管理器中看到的，对于不支持的存储策略，文件名和 Blob 名称一致。{#friendly-filename-download}
10. 仅限私有 Bucket 下支持。{#friendly-filename-download-private-bucket}
11. 需要在存储策略中开启 `由浏览器处理下载` 选项。{#friendly-filename-download-enable}
