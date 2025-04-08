# 自定义支付渠道 {#custom-payment-channel}

::: tip <Badge type="tip" text="Pro" />
本节介绍的是一个 Pro 版本特性。
:::

除了 Cloudreve 已经支持的支付平台以外，你也可以通过实现 Cloudreve 的付款接口来对接你自己的支付平台，或是桥接其他第三方平台。

自定义支付接口你实现需要一个独立的 HTTP 服务，并提供：

- 暴露一个 API 端点，用于：
  - 处理 Cloudreve 的创建订单请求，并返回支付页面 URL；
  - 处理 Cloudreve 的查询订单支付状态请求；
- 客户完成支付后，发送 HTTP 请求到指定的 URL 以通知 Cloudreve 支付完成。

## 实现支付接口 {#implement-payment-interface}

按照本章规范实现你的支付接口，部署接口并确保其能与 Cloudreve 相互进行网络通信。

::: warning 警告
V3 版本的自定义支付 API 与 V4 版本不兼容。
:::

### 创建订单 `POST <你的支付接口>` {#create-order}

当有新订单创建时，Cloudreve 向支付你的接口发送的请求。

#### 请求头 {#request-headers-create-order}

| 名称            | 类型     | 描述                                                                                 |
| --------------- | -------- | ------------------------------------------------------------------------------------ |
| `Authorization` | `String` | 使用您在后台设定的 `通信密钥` 计算的签名，详情请参阅 [验证签名](#verify-signature)。 |
| `X-Cr-Version`  | `String` | Cloudreve 版本号                                                                     |
| `X-Cr-Site-Id`  | `String` | Cloudreve 的站点 ID，可用于区分不同站点                                              |
| `X-Cr-Site-Url` | `String` | Cloudreve 的主要站点 URL。                                                           |

#### 请求正文 {#request-body-create-order}

使用 JSON 格式发送请求正文，包含以下字段：

| 名称         | 类型     | 描述                         |
| ------------ | -------- | ---------------------------- |
| `name`       | `String` | 订单名称                     |
| `order_no`   | `String` | 订单编号                     |
| `notify_url` | `String` | 回调通知地址                 |
| `amount`     | `Number` | 订单金额，使用货币的最小单位 |
| `currency`   | `String` | 货币的 ISO 4217 代码         |

### 请求示例 {#request-example-create-order}

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

### 预期响应 {#expected-response-create-order}

无论订单创建成功与否，HTTP 响应码应均为 `200`，具体成功与否通过响应正文中的 `code` 字段判断。

:::tabs

=== 成功

```http
HTTP/1.1 200 OK

{
    // 成功的响应固定为 0
    "code": 0,
    // 付款收银台页面的 URL，默认会被生成为二维码展示给用户，用户也可选择直接
    // 打开此 URL
    "data": "https://examplepayment.com/checkout/26544743"
}
```

=== 失败

```http
HTTP/1.1 200 OK

{
    // 任意非0代码表示订单创建失败
    "code": 500,
    // 错误的详细描述
    "error": "Failed to create a payment."
}
```

:::

### 查询订单状态 `GET <你的支付接口>` {#query-order-status}

当 Cloudreve 需要查询订单状态时，会向你的接口发送请求。

#### 请求头 {#request-headers-query-order-status}

| 名称            | 类型     | 描述                                                                                 |
| --------------- | -------- | ------------------------------------------------------------------------------------ |
| `Authorization` | `String` | 使用您在后台设定的 `通信密钥` 计算的签名，详情请参阅 [验证签名](#verify-signature)。 |
| `X-Cr-Version`  | `String` | Cloudreve 版本号                                                                     |
| `X-Cr-Site-Id`  | `String` | Cloudreve 的站点 ID，可用于区分不同站点                                              |
| `X-Cr-Site-Url` | `String` | Cloudreve 的主要站点 URL。                                                           |

#### 请求参数 {#request-parameters-query-order-status}

请求参数以 URL 参数的形式发送，包含以下字段：

| 名称       | 类型     | 描述     |
| ---------- | -------- | -------- |
| `order_no` | `String` | 订单编号 |

### 请求示例 {#request-example-query-order-status}

```http
GET /order?order_no=20230209190648343421
Host: examplepayment.com
Authorization: Bearer Vep6hl1x8fiQLasEauMEUqxFKyEqSXb9D_BBQpOiTd8=:1676027218
X-Cr-Site-Url: https://demo.cloudreve.org
X-Cr-Site-Id: b7de8bba-8f86-40fe-8171-c2625b6c4a61
X-Cr-Version: 4.0.0
```

### 预期响应 {#expected-response-query-order-status}

:::tabs

=== 成功查询到订单状态

```http
HTTP/1.1 200 OK

{
    "code": 0,
    // PAID - 已支付
    // 其他值 - 未支付
    "data": "PAID"
}
```

=== 其他错误

```http
HTTP/1.1 200 OK

{
    "code": 500,
    "error": "Failed to query order status."
}
```

:::

## 验证签名 {#verify-signature}

你可以在 Cloudreve 后台设定 `通信密钥`，Cloudreve 创建订单的请求会使用此密钥进行加密并放在 Authorization header 中，你可以通过以下算法验证这一签名：

1. 将 Authorization 值中 Bearer 之后的部分取出，使用:分割字符串，其第二部分是签名过期的时间戳，记为 `timestamp`，验证确保其大于当前时间戳。将:前一部分记为 `signature`；

2. 遍历所有请求头，筛选出以 `X-Cr-` 为前缀的请求头，并将其转换为 `key=value` 的形式，然后进行排序，将结果用 `&` 拼接为字符串 `signedHeaderStr`。

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

3. 将请求 URL 的 `Path` 部分，请求正文，`signedHeaderStr` 以 JSON 格式编码为字符串 `signContent`。

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

4. 将 `signContent` 和 `timestamp` 用 `:` 拼接为字符串 `signContentFinal`, 使用 HMAC 算法和 `通信密钥` 对 `signContentFinal` 计算签名，记为 `signActual`。

```go
signContentFinal := fmt.Sprintf("%s:%s", signContent, timestamp)
signActual := hmac.New(sha256.New, []byte(通信密钥)).Sum([]byte(signContentFinal))
```

5. 对比 `signActual` 和 `signature` 是否一致。

## 发送回调

当用户完成支付后，你需要向此订单被创建时指定的 `notify_url` 发送一个 GET 请求以通知 Cloudreve 用户完成支付。如果回调请求失败，请以指数后退间隔进行重试，除非响应中明确返回了错误信息及代码。Cloudreve 的响应案例如下：

:::tabs

=== 成功

```http
HTTP/1.1 200 OK

{
    // 成功的响应固定为 0
    "code": 0
}
```

=== 失败

```http
HTTP/1.1 200 OK

{
    // 任意非0代码表示回调失败
    "code": 500,
    // 错误的详细描述
    "error": "Failed to process callback."
}
```

:::
