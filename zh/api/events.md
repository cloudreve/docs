# 文件变更事件 {#file-change-events}

Cloudreve 提供基于 [Server-Sent Events (SSE)](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events) 的实时文件变更通知服务。客户端可以订阅文件变更事件，在文件或文件夹被创建、修改、重命名或删除时收到通知。

## 端点 {#endpoint}

```
GET /api/v4/file/events
```

完整的 API 定义请参考 [Events stream](https://cloudrevev4.apifox.cn/events-stream-413501323e0) 接口文档。

**Auth: JWT Required**

| 参数              | 类型   | 位置   | 必需 | 说明                                                             |
| ----------------- | ------ | ------ | ---- | ---------------------------------------------------------------- |
| `uri`             | string | query  | 否   | 要监听的文件夹 URI，例如 `cloudreve://my`                        |
| `X-Cr-Client-Id`  | string | header | 否   | 唯一客户端标识（必须为 UUID），用于订阅管理                      |

## Server-Sent Events {#sse}

此端点返回 `text/event-stream` 响应。连接保持打开状态，服务器在事件发生时推送给客户端。每个事件遵循 SSE 格式：

```
event: <event-type>
data: <json-data>

```

客户端应使用兼容 SSE 的库或原生 `EventSource` API 来使用此端点。

## 事件类型 {#event-types}

| 事件类型             | 说明                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `subscribed`         | 初始订阅成功建立                                                    |
| `resumed`            | 重连后恢复订阅（使用相同的 `X-Cr-Client-Id`）                       |
| `event`              | 文件变更通知，包含一个或多个变更事件                                |
| `keep-alive`         | 心跳，用于保持连接                                                  |
| `reconnect-required` | 服务器请求客户端断开并重新建立连接                                  |

## 客户端标识 {#client-identification}

`X-Cr-Client-Id` 请求头有多种用途：

### 过滤自身产生的事件

当客户端对文件进行变更（上传、重命名、删除等）时，这些变更会触发事件。通过提供一致的 `X-Cr-Client-Id`，服务器会过滤掉由同一客户端产生的事件，避免重复处理。

### 订阅恢复

如果客户端断开连接（由于网络问题、应用进入后台等），服务器会临时为该客户端 ID 存储事件。当客户端使用相同的 `X-Cr-Client-Id` 重新连接时：

- 服务器发送 `resumed` 事件而不是 `subscribed`
- 存储的事件会被推送给客户端
- 客户端可以无缝继续，不会错过任何变更

::: tip
为每个客户端实例生成一个持久化的 UUID，并在重连时复用，以充分利用订阅恢复功能。
:::

## 重连策略 {#reconnection-strategy}

客户端应实现带指数退避的自动重连：

1. 连接失败或意外关闭时，等待后再重连
2. 从较短的延迟开始（例如 1 秒）
3. 每次失败后将延迟翻倍，直到达到上限（例如 32 秒）
4. 成功连接后重置延迟

收到 `reconnect-required` 事件时，客户端应：

1. 优雅地关闭当前连接
2. 立即重连，无需退避延迟
3. 继续使用相同的 `X-Cr-Client-Id` 以恢复订阅

## 事件防抖与合并 {#event-debouncing}

服务器实现了智能的事件防抖和合并机制，以减少冗余和带宽消耗：

- **防抖**：对同一文件的快速连续变更会被批量处理
- **延迟**：事件会短暂保持，以便将相关操作分组
- **合并**：冗余或被取代的事件会被整合（例如多次修改合并为单个事件，创建后立即删除则相互抵消）

这意味着客户端收到的事件数量可能少于实际操作次数，但每个事件都反映了受影响文件的最终有效状态。

## 示例 {#example}

```javascript
const clientId = localStorage.getItem('clientId') || crypto.randomUUID();
localStorage.setItem('clientId', clientId);

function connect() {
  const url = new URL('/api/v4/file/events', 'https://your-site.com');
  url.searchParams.set('uri', 'cloudreve://my');

  const eventSource = new EventSource(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Cr-Client-Id': clientId
    }
  });

  eventSource.addEventListener('subscribed', (e) => {
    console.log('订阅已建立');
  });

  eventSource.addEventListener('resumed', (e) => {
    console.log('订阅已恢复');
  });

  eventSource.addEventListener('event', (e) => {
    const events = JSON.parse(e.data);
    for (const event of events) {
      console.log(`${event.type}: ${event.from} -> ${event.to}`);
    }
  });

  eventSource.addEventListener('reconnect-required', (e) => {
    eventSource.close();
    connect(); // 立即重连
  });

  eventSource.onerror = (e) => {
    eventSource.close();
    setTimeout(connect, 5000); // 延迟后重连
  };
}

connect();
```
