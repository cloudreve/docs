# 全文搜索 {#full-text-search}

全文搜索功能允许用户根据文件内容进行检索。启用后，Cloudreve 在文件上传或更新时通过 [Apache Tika](https://tika.apache.org/) 提取文件内容，并将其发送至 [Meilisearch](https://www.meilisearch.com/) 进行索引。用户可在搜索时直接匹配文档中的文字内容，快速定位目标文件。

## 前置条件 {#prerequisites}

全文搜索依赖以下两个外部服务，请在启用前完成部署：

| 服务            | 用途                       | 默认端口 |
| --------------- | -------------------------- | -------- |
| Apache Tika     | 从文件中提取文本内容       | 9998     |
| Meilisearch     | 对提取的文本内容进行索引   | 7700     |

## 使用 Docker Compose 部署 {#deploy-with-docker-compose}

如果你通过 [Docker Compose](../../overview/deploy/docker-compose) 部署了 Cloudreve，可以通过应用 `docker-compose.fts.yml` 覆盖文件来部署 Tika 和 Meilisearch。

生成 Meilisearch Master Key 并保存到 `.env` 文件：

```bash
# 生成 Master Key
openssl rand -hex 32

# 编辑 .env 文件，设置 MEILI_MASTER_KEY=<生成的密钥>
```

然后使用 FTS 覆盖文件重新启动：

:::tabs
== 社区版

```bash
docker compose -f docker-compose.yml -f docker-compose.fts.yml up -d
```

== Pro 版

```bash
docker compose -f docker-compose.yml -f docker-compose.pro.yml -f docker-compose.fts.yml up -d
```

:::

服务启动后，前往[启用全文搜索](#enable-full-text-search)在管理面板中配置端点。Docker Compose 网络内请使用以下值：

| 参数              | 值                         |
| ----------------- | -------------------------- |
| Meilisearch 端点  | `http://meilisearch:7700`  |
| API 密钥          | `.env` 中设置的 `MEILI_MASTER_KEY` |
| Apache Tika 端点  | `http://tika:9998`         |

如果你没有使用 Docker Compose，请按照以下手动部署步骤操作。

## 部署 Apache Tika Server {#deploy-tika}

[Apache Tika](https://tika.apache.org/) 是一个开源的文件内容提取工具，支持从常见文档格式中提取文字内容用于索引。

通过 Docker 启动 Apache Tika Server：

```bash
docker run -d --name tika -p 9998:9998 apache/tika:latest
```

::: tip 完整版镜像

如果需要完整的 Tika 处理能力（包括 GDAL 和 Tesseract OCR），可使用完整版镜像：

```bash
docker run -d --name tika -p 9998:9998 apache/tika:latest-full
```

完整版镜像内置了英语、意大利语、法语、西班牙语和德语的 OCR 支持。如需添加其他语言，请参考 [Dockerfile](https://github.com/apache/tika-docker/blob/master/full/Dockerfile) 进行自定义构建。

:::

启动后，访问 `http://localhost:9998` 验证服务是否正常运行。

## 部署 Meilisearch {#deploy-meilisearch}

[Meilisearch](https://www.meilisearch.com/) 是一个开源的搜索引擎，用于对文件内容建立索引并提供高效的搜索能力。

### 生成 API 密钥 {#generate-api-key}

首先生成一段随机字符串作为 Meilisearch 的 Master Key：

```bash
openssl rand -hex 32
```

请妥善保存此密钥，后续配置 Cloudreve 时需要使用。

### 启动 Meilisearch {#start-meilisearch}

通过 Docker 启动 Meilisearch：

```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='<你的 API 密钥>' \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:latest
```

启动后，访问 `http://localhost:7700` 验证服务是否正常运行。

## 启用全文搜索 {#enable-full-text-search}

在 Cloudreve 管理面板中，前往 `文件系统` -> `全文搜索` 开启全文搜索，并填写以下配置：

### 索引器（Meilisearch） {#indexer-config}

| 参数              | 说明                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Meilisearch 端点  | Meilisearch 服务地址，默认为 `http://localhost:7700`。如果 Cloudreve 运行在 Docker 容器中，请使用容器网络内的地址。 |
| API 密钥          | 上一步生成的 Master Key。                                                                                           |
| AI 语义搜索       | 可选功能，启用方法参考 [AI 语义搜索](./ai-semantic-search)。                                                        |

### 内容提取器（Apache Tika） {#extractor-config}

| 参数              | 说明                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apache Tika 端点  | Tika Server 地址，默认为 `http://localhost:9998`。如果 Cloudreve 运行在 Docker 容器中，请使用容器网络内的地址。                                                      |
| 支持的扩展名      | 指定需要索引的文件扩展名列表，不在列表中的文件将被跳过。支持的文件类型请参考 [Apache Tika 支持的格式](https://tika.apache.org/3.2.3/formats.html)。                    |
| 最大文件大小      | 超过此大小的文件不会被索引。                                                                                                                                         |

### 分块 {#chunking-config}

| 参数     | 说明                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------ |
| 分块大小 | 文件内容将按此大小分块后索引，以提升搜索精度。Meilisearch 推荐的分块大小约为 1KB。               |

### 验证配置 {#verify-config}

保存设置后，刷新页面并上传一个新的文档文件，然后尝试搜索该文件中的内容以验证索引是否正常工作。

## 为已有文件建立索引 {#reindex-existing-files}

启用全文搜索后，Cloudreve 不会自动为已存在的文件建立索引。如需对历史文件进行索引，请前往管理面板 `文件系统` -> `全文搜索` -> `索引器 (Meilisearch)` -> `索引操作`，点击 `重建索引`。

::: warning
重建索引会对所有符合条件的文件重新提取内容并建立索引，文件数量较多时可能需要较长时间，请在业务低峰期执行。
:::

## 后续步骤 {#next-steps}

如需启用 AI 语义搜索以获得更智能的搜索体验，请参考 [AI 语义搜索](./ai-semantic-search)。
