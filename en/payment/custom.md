# Custom Payment Provider {#custom-payment-channel}

::: tip <Badge type="tip" text="Pro edition" />
This section introduces a Pro edition feature.
:::

In addition to the payment providers already supported by Cloudreve, you can also integrate your own payment platform by implementing Cloudreve's payment interface, or bridge other third-party platforms.

To implement a custom payment interface, you need an independent HTTP service that provides:

- An API endpoint to:
  - Handle Cloudreve's payment creation requests and return a payment page URL;
  - Handle Cloudreve's requests to query the payment status of an order;
- After the customer completes the payment, send an HTTP request to a specified URL to notify Cloudreve of the payment completion.

## Implementing the Payment Interface {#implement-payment-interface}

Implement your payment interface according to the specifications in this chapter, deploy the interface, and ensure it can communicate with Cloudreve over the network.

::: warning Warning
The custom payment API for version 3 is not compatible with version 4.
:::

### Create Order `POST <your-payment-endpoint>` {#create-order}

When a new order is created, Cloudreve sends a request to your payment interface.

#### Request Headers {#request-headers-create-order}

| Name            | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | `String` | A signature calculated using the `Communication key` you set in the backend. See [Verify Signature](#verify-signature) for details. |
| `X-Cr-Version`  | `String` | Cloudreve version number                                                                                                            |
| `X-Cr-Site-Id`  | `String` | Cloudreve site ID, which can be used to distinguish different sites                                                                 |
| `X-Cr-Site-Url` | `String` | The main site URL of Cloudreve.                                                                                                     |

#### Request Body {#request-body-create-order}

The request body is sent in JSON format and includes the following fields:

| Name         | Type     | Description                                         |
| ------------ | -------- | --------------------------------------------------- |
| `name`       | `String` | Payment name                                        |
| `order_no`   | `String` | Order number                                        |
| `notify_url` | `String` | Callback notification URL                           |
| `amount`     | `Number` | Payment amount, using the smallest unit of currency |
| `currency`   | `String` | ISO 4217 code of the currency                       |

### Request Example {#request-example-create-order}

```http
POST /order
Host: examplepayment.com
Authorization: Bearer Vep6hl1x8fiQLasEauMEUqxFKyEqSXb9D_BBQpOiTd8=:1676027218
X-Cr-Site-Url: https://demo.cloudreve.org
X-Cr-Site-Id: b7de8bba-8f86-40fe-8171-c2625b6c4a61
X-Cr-Version: 4.0.0

{
   "name": "Unlimited Storage",
   "order_no": "20230209190648343421",
   "notify_url": "http://demo.cloudreve.org/api/v4/callback/custom/20230209190648343421",
   "amount": 8900,
   "currency": "CNY"
}
```

### Expected Response {#expected-response-create-order}

Regardless of whether the order creation is successful, the HTTP response code should be `200`, with success or failure determined by the `code` field in the response body.

:::tabs

=== Success

```http
HTTP/1.1 200 OK

{
    // A successful response is always 0
    "code": 0,
    // The URL of the payment checkout page, which will be generated as a QR code for the user to scan, or they can choose to open this URL directly
    "data": "https://examplepayment.com/checkout/26544743"
}
```

=== Failure

```http
HTTP/1.1 200 OK

{
    // Any non-zero code indicates order creation failure
    "code": 500,
    // Detailed description of the error
    "error": "Failed to create a payment."
}
```

:::

### Query Order Status `GET <your-payment-endpoint>` {#query-order-status}

When Cloudreve needs to query the order status, it sends a request to your endpoint.

#### Request Headers {#request-headers-query-order-status}

| Name            | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | `String` | A signature calculated using the `Communication key` you set in the backend. See [Verify Signature](#verify-signature) for details. |
| `X-Cr-Version`  | `String` | Cloudreve version number                                                                                                            |
| `X-Cr-Site-Id`  | `String` | Cloudreve site ID, which can be used to distinguish different sites                                                                 |
| `X-Cr-Site-Url` | `String` | The main site URL of Cloudreve.                                                                                                     |

#### Request Parameters {#request-parameters-query-order-status}

Request parameters are sent as URL parameters and include the following fields:

| Name       | Type     | Description  |
| ---------- | -------- | ------------ |
| `order_no` | `String` | Order number |

### Request Example {#request-example-query-order-status}

```http
GET /order?order_no=20230209190648343421
Host: examplepayment.com
Authorization: Bearer Vep6hl1x8fiQLasEauMEUqxFKyEqSXb9D_BBQpOiTd8=:1676027218
X-Cr-Site-Url: https://demo.cloudreve.org
X-Cr-Site-Id: b7de8bba-8f86-40fe-8171-c2625b6c4a61
X-Cr-Version: 4.0.0
```

### Expected Response {#expected-response-query-order-status}

:::tabs

=== Successfully Queried Order Status

```http
HTTP/1.1 200 OK

{
    "code": 0,
    // PAID - Paid
    // Other values - Not paid
    "data": "PAID"
}
```

=== Other Errors

```http
HTTP/1.1 200 OK

{
    "code": 500,
    "error": "Failed to query order status."
}
```

:::

## Verify Signature {#verify-signature}

You can set a `communication key` in the Cloudreve payment settings. Cloudreve's payment creation requests will use this key for signing and place it in the Request:

- For payment creation requests, the signature is placed in the `Authorization` header, prefixed with `Bearer Cr`, and the prefix should be removed;
- For query order status requests, the signature is placed in the URL parameter `sign`.

Verify the signature using the following algorithm:

1. Extract the signature from the request, split the string by `:`, and the second part is the expiration timestamp of the signature, noted as `timestamp`. Verify that it is greater than the current timestamp. The part before `:` is noted as `signature`;

2. Get the string to be signed:

   - **For payment creation requests:**

     1. Iterate through all request headers, filter out the headers that start with `X-Cr-`, convert them to `key=value` format, then sort them and join them with `&` to form the string `signedHeaderStr`.

     ```go
     var signedHeader []string
     for k, _ := range r.Header {
         if strings.HasPrefix(k, "X-Cr-") {
             signedHeader = append(signedHeader, fmt.Sprintf("%s=%s", k, r.Header.Get(k)))
         }
     }
     sort.Strings(signedHeader)
     signedHeaderStr := strings.Join(signedHeader, "&")
     ```

     2. Encode the `Path` part of the request URL, request body, and `signedHeaderStr` as a JSON string `signContent`.

     ```go
     type RequestRawSign struct {
         Path   string
         Header string
         Body   string
     }

     signContent, err := json.Marshal(RequestRawSign{
         Path:   r.URL.Path,
         Header: signedHeaderStr,
         Body:   string(r.Body),
     })
     ```

   - **For query order status requests:**
     Just use the `Path` part (excluding `Query`) of the request URL as `signContent`.

3. Concatenate `signContent` and `timestamp` with `:` to form the string `signContentFinal`, and use the HMAC algorithm and `Communication key` to calculate the signature for `signContentFinal`, noted as `signActual`.

```go
signContentFinal := fmt.Sprintf("%s:%s", signContent, timestamp)
signActual := hmac.New(sha256.New, []byte(Communication key)).Sum([]byte(signContentFinal))
```

4. Compare `signActual` with `signature` to check for consistency.

## Send Callback

After the user completes the payment, you need to send a GET request to the `notify_url` specified when the payment was created to notify Cloudreve that the user has completed the payment. If the callback request fails, retry with exponential backoff unless the response explicitly returns an error message and code. An example response from Cloudreve is as follows:

:::tabs

=== Success

```http
HTTP/1.1 200 OK

{
    // A successful response is always 0
    "code": 0
}
```

=== Failure

```http
HTTP/1.1 200 OK

{
    // Any non-zero code indicates callback failure
    "code": 500,
    // Detailed description of the error
    "error": "Failed to process callback."
}
```

:::
