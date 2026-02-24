# Full-text Search {#full-text-search}

Full-text search allows users to search based on file content. Once enabled, Cloudreve extracts file content via [Apache Tika](https://tika.apache.org/) when files are uploaded or updated, and sends it to [Meilisearch](https://www.meilisearch.com/) for indexing. Users can then match text content within documents during searches to quickly locate target files.

## Prerequisites {#prerequisites}

Full-text search depends on the following two external services. Please deploy them before enabling:

| Service         | Purpose                              | Default Port |
| --------------- | ------------------------------------ | ------------ |
| Apache Tika     | Extract text content from files      | 9998         |
| Meilisearch     | Index the extracted text content     | 7700         |

## Deploy with Docker Compose {#deploy-with-docker-compose}

If you deployed Cloudreve using [Docker Compose](../../overview/deploy/docker-compose), you can add full-text search by applying the `docker-compose.fts.yml` override file, which deploys Tika and Meilisearch alongside Cloudreve.

Generate a Meilisearch Master Key and save it to the `.env` file:

```bash
# Generate a Master Key
openssl rand -hex 32

# Edit .env and set MEILI_MASTER_KEY=<generated key>
```

Then restart with the FTS override:

:::tabs
== Community Edition

```bash
docker compose -f docker-compose.yml -f docker-compose.fts.yml up -d
```

== Pro Edition

```bash
docker compose -f docker-compose.yml -f docker-compose.pro.yml -f docker-compose.fts.yml up -d
```

:::

After the services are running, proceed to [Enable Full-text Search](#enable-full-text-search) to configure the endpoints in the admin panel. Use the following values for the Docker Compose network:

| Parameter            | Value                      |
| -------------------- | -------------------------- |
| Meilisearch Endpoint | `http://meilisearch:7700`  |
| API Key              | The `MEILI_MASTER_KEY` you set in `.env` |
| Apache Tika Endpoint | `http://tika:9998`         |

If you are not using Docker Compose, follow the manual deployment steps below.

## Deploy Apache Tika Server {#deploy-tika}

[Apache Tika](https://tika.apache.org/) is an open-source content extraction tool that supports extracting text from common document formats for indexing.

Start Apache Tika Server via Docker:

```bash
docker run -d --name tika -p 9998:9998 apache/tika:latest
```

::: tip Full Image

If you need the full Tika processing capabilities (including GDAL and Tesseract OCR), use the full image:

```bash
docker run -d --name tika -p 9998:9998 apache/tika:latest-full
```

The full image includes built-in OCR support for English, Italian, French, Spanish, and German. To add other languages, refer to the [Dockerfile](https://github.com/apache/tika-docker/blob/master/full/Dockerfile) for custom builds.

:::

After starting, visit `http://localhost:9998` to verify the service is running properly.

## Deploy Meilisearch {#deploy-meilisearch}

[Meilisearch](https://www.meilisearch.com/) is an open-source search engine used to index file content and provide efficient search capabilities.

### Generate API Key {#generate-api-key}

First, generate a random string as the Meilisearch Master Key:

```bash
openssl rand -hex 32
```

Save this key securely, as it will be needed when configuring Cloudreve.

### Start Meilisearch {#start-meilisearch}

Start Meilisearch via Docker:

```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='<Your API Key>' \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:latest
```

After starting, visit `http://localhost:7700` to verify the service is running properly.

## Enable Full-text Search {#enable-full-text-search}

In the Cloudreve admin panel, navigate to `Filesystem` -> `Full-text Search` to enable full-text search, and fill in the following configuration:

### Indexer (Meilisearch) {#indexer-config}

| Parameter            | Description                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Meilisearch Endpoint | Meilisearch service address, defaults to `http://localhost:7700`. If Cloudreve runs in a Docker container, use the address within the container network. |
| API Key              | The Master Key generated in the previous step.                                                                       |
| AI Semantic Search   | Optional feature, see [AI Semantic Search](./ai-semantic-search) for setup instructions.                             |

### Content Extractor (Apache Tika) {#extractor-config}

| Parameter            | Description                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apache Tika Endpoint | Tika Server address, defaults to `http://localhost:9998`. If Cloudreve runs in a Docker container, use the address within the container network.       |
| Supported Extensions | Specify the list of file extensions to index; files not in the list will be skipped. For supported file types, see [Apache Tika Supported Formats](https://tika.apache.org/3.2.3/formats.html). |
| Max File Size        | Files exceeding this size will not be indexed.                                                                                                        |

### Chunking {#chunking-config}

| Parameter  | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| Chunk Size | File content will be chunked at this size before indexing to improve search accuracy. Meilisearch recommends a chunk size of approximately 1KB. |

### Verify Configuration {#verify-config}

After saving the settings, refresh the page and upload a new document file, then try searching for content within the file to verify that indexing is working properly.

## Reindex Existing Files {#reindex-existing-files}

After enabling full-text search, Cloudreve does not automatically index existing files. To index historical files, go to the admin panel `Filesystem` -> `Full-text Search` -> `Indexer (Meilisearch)` -> `Index Operations`, and click `Rebuild Index`.

::: warning
Rebuilding the index will re-extract content and rebuild the index for all eligible files. This may take a long time if there are many files, so it is recommended to perform this during off-peak hours.
:::

## Next Steps {#next-steps}

To enable AI semantic search for a smarter search experience, see [AI Semantic Search](./ai-semantic-search).
