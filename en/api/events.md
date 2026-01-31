# File Change Events {#file-change-events}

Cloudreve provides a real-time file change notification service based on [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events). Clients can subscribe to file change events to receive notifications when files or folders are created, modified, renamed, or deleted.

## Endpoint {#endpoint}

```
GET /api/v4/file/events
```

Refer to the [Events stream](https://cloudrevev4.apifox.cn/events-stream-413501323e0) API documentation for the complete API schema.

**Auth: JWT Required**

| Parameter         | Type   | Location | Required | Description                                                      |
| ----------------- | ------ | -------- | -------- | ---------------------------------------------------------------- |
| `uri`             | string | query    | No       | URI of the folder to watch, e.g., `cloudreve://my`               |
| `X-Cr-Client-Id`  | string | header   | No       | Unique client identifier (must be UUID), used for subscription management |

## Server-Sent Events {#sse}

This endpoint returns a `text/event-stream` response. The connection remains open, and the server pushes events to the client as they occur. Each event follows the SSE format:

```
event: <event-type>
data: <json-data>

```

Clients should use an SSE-compatible library or the native `EventSource` API to consume this endpoint.

## Event Types {#event-types}

| Event Type           | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `subscribed`         | Initial subscription established successfully                               |
| `resumed`            | Subscription resumed after reconnection (with the same `X-Cr-Client-Id`)    |
| `event`              | File change notification containing one or more change events               |
| `keep-alive`         | Heartbeat to maintain connection                                            |
| `reconnect-required` | Server requests the client to disconnect and re-establish the connection    |

## Client Identification {#client-identification}

The `X-Cr-Client-Id` header serves multiple purposes:

### Filtering Self-Generated Events

When a client makes changes to files (upload, rename, delete, etc.), those changes trigger events. By providing a consistent `X-Cr-Client-Id`, the server filters out events that originated from the same client, preventing redundant processing.

### Subscription Recovery

If a client disconnects (due to network issues, app backgrounding, etc.), the server temporarily stores events for that client ID. When the client reconnects with the same `X-Cr-Client-Id`:

- The server sends a `resumed` event instead of `subscribed`
- Stored events are delivered to the client
- The client can seamlessly continue without missing changes

::: tip
Generate a persistent UUID for each client instance and reuse it across reconnections to take full advantage of subscription recovery.
:::

## Reconnection Strategy {#reconnection-strategy}

Clients should implement automatic reconnection with exponential backoff:

1. On connection failure or unexpected close, wait before reconnecting
2. Start with a short delay (e.g., 1 second)
3. Double the delay after each failed attempt, up to a maximum (e.g., 32 seconds)
4. Reset the delay after a successful connection

When receiving a `reconnect-required` event, the client should:

1. Close the current connection gracefully
2. Reconnect immediately without backoff delay
3. Continue using the same `X-Cr-Client-Id` to resume the subscription

## Event Debouncing and Merging {#event-debouncing}

The server implements intelligent event debouncing and merging to reduce noise and bandwidth:

- **Debouncing**: Rapid successive changes to the same file are batched together
- **Delay**: Events are held briefly to allow related operations to be grouped
- **Merging**: Redundant or superseded events are consolidated (e.g., multiple modifications become a single event, create followed by delete cancels out)

This means clients may receive fewer events than the actual number of operations, but each event reflects the meaningful final state of the affected files.

## Example {#example}

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
    console.log('Subscription established');
  });

  eventSource.addEventListener('resumed', (e) => {
    console.log('Subscription resumed');
  });

  eventSource.addEventListener('event', (e) => {
    const events = JSON.parse(e.data);
    for (const event of events) {
      console.log(`${event.type}: ${event.from} -> ${event.to}`);
    }
  });

  eventSource.addEventListener('reconnect-required', (e) => {
    eventSource.close();
    connect(); // Reconnect immediately
  });

  eventSource.onerror = (e) => {
    eventSource.close();
    setTimeout(connect, 5000); // Reconnect with delay
  };
}

connect();
```
