# AI 语义搜索 {#ai-semantic-search}

AI 语义搜索是 Cloudreve 基于 Meilisearch 提供的智能搜索方式。与传统的[全文搜索](./fts)不同，语义搜索基于查询的含义和上下文返回结果，而非仅依赖关键词匹配。

## 工作原理

语义搜索通过 LLM 提供商（如 OpenAI、Hugging Face 等）生成向量嵌入（vector embeddings），将文档内容和搜索词转化为语义向量，然后通过比较向量相似度找到语义相关的搜索结果。

开启语义搜索后，Cloudreve 默认同时返回全文搜索和语义搜索的结果（即混合搜索），两者互补以提供更精准的搜索体验。

## 全文搜索 vs AI 语义搜索

|          | 全文搜索                                 | AI 语义搜索                                                          |
| -------- | ---------------------------------------- | -------------------------------------------------------------------- |
| 匹配方式 | 关键词精确匹配                           | 语义相似度匹配                                                       |
| 适用场景 | 用户熟悉目标关键词，需要精确匹配         | 查询模糊或冗长，需要理解语义                                         |
| 资源消耗 | 较低                                     | 可能产生第三方模型费用                                               |
| 搜索示例 | 搜索 "旅行计划" 只匹配包含该关键词的文档 | 搜索 "旅行计划" 也能匹配含有 "出行安排"、"度假行程" 等语义相关的文档 |

## 前置条件

1. Cloudreve 中已启用 [全文搜索](./fts)。
2. 选择适合的嵌入模型和提供商，如 OpenAI、Hugging Face 等。有关如何选择模型，可参考 [Meilisearch 文档](https://www.meilisearch.com/docs/learn/ai_powered_search/choose_an_embedder)。

## 开启 AI 混合搜索

前往 Cloudreve 管理面板 -> `文件系统` -> `全文搜索` -> `AI 语义搜索` 开启 AI 语义搜索，并根据模型提供商填写嵌入配置：

:::tabs
== OpenAI

目前， OpenAI 提供下面三种主流嵌入模型：

- `text-embedding-3-large`: 3,072 dimensions
- `text-embedding-3-small`: 1,536 dimensions
- `text-embedding-ada-002`: 1,536 dimensions

在 Cloudreve 中填写下面嵌入配置:

```json
{
  "source": "openAi",
  "apiKey": "<OpenAI API Key>",
  "dimensions": 1536,
  "model": "text-embedding-3-small"
}
```

其中：

- `apiKey` 填入 OpenAI 的 API 密钥。
- `dimensions` 填入嵌入模型的维度，比如 `1536`。
- `model` 填入嵌入模型的名称，比如 `text-embedding-3-small`。

参考：[Meilisearch OpenAI 嵌入配置](https://www.meilisearch.com/docs/guides/embedders/openai)

== Hugging Face

在 Cloudreve 中填写下面嵌入配置:

```json
{
  "source": "rest",
  "url": "ENDPOINT_URL",
  "apiKey": "API_KEY",
  "dimensions": 384,
  "request": {
    "inputs": ["{{text}}", "{{..}}"],
    "model": "baai/bge-small-en-v1.5"
  },
  "response": ["{{embedding}}", "{{..}}"]
}
```

其中：

- `url` 填入 Hugging Face 的 API 端点 URL。
- `apiKey` 填入 Hugging Face 的 API 密钥。
- `dimensions` 填入嵌入模型的维度，比如 `384`。
- `request.model` 填入嵌入模型的名称，比如 `baai/bge-small-en-v1.5`。

参考：[Meilisearch Hugging Face 嵌入配置](https://www.meilisearch.com/docs/guides/embedders/huggingface)

== AWS Bedrock

目前， AWS Bedrock 提供下面两种主流嵌入模型：

- `amazon.titan-embed-text-v2`: 256, 512, or 1024 dimensions (Amazon Titan Text Embeddings V2)
- `amazon.nova-2-multimodal-embeddings-v1`: 256, 384, 1024, or 3072 dimensions (Amazon Nova Multimodal Embeddings - also supports images, video, and audio)
- `cohere.embed-multilingual-v3`: 1024 dimensions (Cohere Embed Multilingual v3)
- `cohere.embed-v4`: 256, 512, 1024, or 1536 dimensions (Cohere Embed v4 - also supports images)

在 Cloudreve 中填写下面嵌入配置:

### Amazon Titan Text Embeddings V2

```json
{
  "source": "rest",
  "url": "https://bedrock-runtime.<region>.amazonaws.com/model/amazon.titan-embed-text-v2:0/invoke",
  "apiKey": "<Your Bedrock API Key>",
  "dimensions": 1024,
  "request": {
    "inputText": "{{text}}",
    "dimensions": 1024,
    "normalize": true
  },
  "response": {
    "embedding": "{{embedding}}"
  }
}
```

### Amazon Nova Multimodal Embeddings (text mode)

```json
{
  "source": "rest",
  "url": "https://bedrock-runtime.<region>.amazonaws.com/model/amazon.nova-2-multimodal-embeddings-v1:0/invoke",
  "apiKey": "<Your Bedrock API Key>",
  "dimensions": 1024,
  "request": {
    "taskType": "SINGLE_EMBEDDING",
    "singleEmbeddingParams": {
      "embeddingPurpose": "GENERIC_INDEX",
      "embeddingDimension": 1024,
      "text": {
        "truncationMode": "END",
        "value": "{{text}}"
      }
    }
  },
  "response": {
    "embeddings": [{ "embedding": "{{embedding}}" }]
  }
}
```

### Cohere Embed Multilingual v3

```json
{
  "source": "rest",
  "url": "https://bedrock-runtime.<region>.amazonaws.com/model/cohere.embed-multilingual-v3/invoke",
  "apiKey": "<Your Bedrock API Key>",
  "dimensions": 1024,
  "request": {
    "texts": ["{{text}}"],
    "input_type": "search_document"
  },
  "response": {
    "embeddings": ["{{embedding}}"]
  }
}
```

### Cohere Embed v4 (text mode)

```json
{
  "source": "rest",
  "url": "https://bedrock-runtime.<region>.amazonaws.com/model/cohere.embed-v4:0/invoke",
  "apiKey": "<Your Bedrock API Key>",
  "dimensions": 1536,
  "request": {
    "texts": ["{{text}}"],
    "input_type": "search_document"
  },
  "response": {
    "embeddings": { "float": ["{{embedding}}"] }
  }
}
```

其中：

- `url` 填入 AWS Bedrock 的 API 端点 URL，替换 `<region>` 为你的 AWS 区域 (e.g., us-east-1, us-west-2, eu-west-3)。注意：Nova 目前仅在 us-east-1 可用。
- `apiKey` 填入 AWS Bedrock 的 API 密钥。
- `dimensions` 填入嵌入模型的维度，比如 `384`。

参考：[Meilisearch AWS Bedrock 嵌入配置](https://www.meilisearch.com/docs/guides/embedders/bedrock)

== Cloudflare Worker AI

目前， Cloudflare Worker AI 提供下面两种主流嵌入模型：

- `baai/bge-base-en-v1.5`: 768 dimensions
- `baai/bge-large-en-v1.5`: 1024 dimensions
- `baai/bge-small-en-v1.5`: 384 dimensions

在 Cloudreve 中填写下面嵌入配置:

```json
{
  "source": "rest",
  "apiKey": "<API Key>",
  "dimensions": 384,
  "url": "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/run/@cf/<Model>",
  "request": {
    "text": ["{{text}}", "{{..}}"]
  },
  "response": {
    "result": {
      "data": ["{{embedding}}", "{{..}}"]
    }
  }
}
```

其中：

- `apiKey` 填入 Cloudflare 的 API 密钥。
- `dimensions` 填入嵌入模型的维度，比如 `384`。
- `url` 填入 Cloudflare Worker AI 的 API 端点 URL，替换 `<ACCOUNT_ID>` 为你的 Cloudflare 账户 ID，替换 `<Model>` 为你的嵌入模型名称。

== 其他提供商

请参考 Meilisearch 文档 [嵌入模型](https://www.meilisearch.com/docs/reference/api/settings#embedders) 填写配置 JSON，Cloudreve 的嵌入配置与此相同。

:::

保存设置后，无需重建索引，Meilisearch 会自动使用嵌入模型为已有索引生成嵌入向量。
