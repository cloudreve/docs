# AI Semantic Search {#ai-semantic-search}

AI semantic search is an intelligent search method provided by Cloudreve based on Meilisearch. Unlike traditional [full-text search](./fts), semantic search returns results based on the meaning and context of the query, rather than relying solely on keyword matching.

## How It Works

Semantic search generates vector embeddings through LLM providers (such as OpenAI, Hugging Face, etc.), converting document content and search terms into semantic vectors. It then finds semantically relevant search results by comparing vector similarity.

When semantic search is enabled, Cloudreve returns both full-text search and semantic search results by default (i.e., hybrid search), complementing each other to provide a more accurate search experience.

## Full-text Search vs AI Semantic Search

|                | Full-text Search                                 | AI Semantic Search                                                      |
| -------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| Matching       | Exact keyword matching                           | Semantic similarity matching                                            |
| Use Case       | User knows the exact keywords, needs precise matching | Query is vague or lengthy, needs semantic understanding              |
| Resource Usage | Low                                              | May incur third-party model costs                                       |
| Search Example | Searching "travel plan" only matches documents containing that keyword | Searching "travel plan" also matches documents containing "trip arrangement", "vacation itinerary", and other semantically related terms |

## Prerequisites

1. [Full-text search](./fts) is already enabled in Cloudreve.
2. Choose a suitable embedding model and provider, such as OpenAI, Hugging Face, etc. For guidance on choosing a model, refer to the [Meilisearch documentation](https://www.meilisearch.com/docs/learn/ai_powered_search/choose_an_embedder).

## Enable AI Hybrid Search

Navigate to Cloudreve admin panel -> `Filesystem` -> `Full-text Search` -> `AI Semantic Search` to enable AI semantic search, and fill in the embedding configuration based on your model provider:

:::tabs
== OpenAI

Currently, OpenAI offers the following three mainstream embedding models:

- `text-embedding-3-large`: 3,072 dimensions
- `text-embedding-3-small`: 1,536 dimensions
- `text-embedding-ada-002`: 1,536 dimensions

Fill in the following embedding configuration in Cloudreve:

```json
{
  "source": "openAi",
  "apiKey": "<OpenAI API Key>",
  "dimensions": 1536,
  "model": "text-embedding-3-small"
}
```

Where:

- `apiKey` is your OpenAI API key.
- `dimensions` is the dimension of the embedding model, e.g., `1536`.
- `model` is the name of the embedding model, e.g., `text-embedding-3-small`.

Reference: [Meilisearch OpenAI Embedding Configuration](https://www.meilisearch.com/docs/guides/embedders/openai)

== Hugging Face

Fill in the following embedding configuration in Cloudreve:

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

Where:

- `url` is the Hugging Face API endpoint URL.
- `apiKey` is your Hugging Face API key.
- `dimensions` is the dimension of the embedding model, e.g., `384`.
- `request.model` is the name of the embedding model, e.g., `baai/bge-small-en-v1.5`.

Reference: [Meilisearch Hugging Face Embedding Configuration](https://www.meilisearch.com/docs/guides/embedders/huggingface)

== AWS Bedrock

Currently, AWS Bedrock offers the following mainstream embedding models:

- `amazon.titan-embed-text-v2`: 256, 512, or 1024 dimensions (Amazon Titan Text Embeddings V2)
- `amazon.nova-2-multimodal-embeddings-v1`: 256, 384, 1024, or 3072 dimensions (Amazon Nova Multimodal Embeddings - also supports images, video, and audio)
- `cohere.embed-multilingual-v3`: 1024 dimensions (Cohere Embed Multilingual v3)
- `cohere.embed-v4`: 256, 512, 1024, or 1536 dimensions (Cohere Embed v4 - also supports images)

Fill in the following embedding configuration in Cloudreve:

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

Where:

- `url` is the AWS Bedrock API endpoint URL. Replace `<region>` with your AWS region (e.g., us-east-1, us-west-2, eu-west-3). Note: Nova is currently only available in us-east-1.
- `apiKey` is your AWS Bedrock API key.
- `dimensions` is the dimension of the embedding model, e.g., `384`.

Reference: [Meilisearch AWS Bedrock Embedding Configuration](https://www.meilisearch.com/docs/guides/embedders/bedrock)

== Cloudflare Worker AI

Currently, Cloudflare Worker AI offers the following mainstream embedding models:

- `baai/bge-base-en-v1.5`: 768 dimensions
- `baai/bge-large-en-v1.5`: 1024 dimensions
- `baai/bge-small-en-v1.5`: 384 dimensions

Fill in the following embedding configuration in Cloudreve:

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

Where:

- `apiKey` is your Cloudflare API key.
- `dimensions` is the dimension of the embedding model, e.g., `384`.
- `url` is the Cloudflare Worker AI API endpoint URL. Replace `<ACCOUNT_ID>` with your Cloudflare account ID, and replace `<Model>` with your embedding model name.

== Other Providers

Please refer to the Meilisearch documentation [Embedders](https://www.meilisearch.com/docs/reference/api/settings#embedders) to fill in the configuration JSON. The embedding configuration in Cloudreve is the same.

:::

After saving the settings, there is no need to rebuild the index. Meilisearch will automatically generate embedding vectors for existing indexes using the embedding model.
