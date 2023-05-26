# 自定义支付渠道

除了 Cloudreve 已经支持的支付平台以外，你也可以通过实现 Cloudreve 的付款接口来对接你自己的支付平台，或是桥接其他第三方平台。

自定义支付接口你实现需要一个独立的 HTTP 服务，并提供：

* 暴露一个 API 端点，用于处理 Cloudreve 的创建订单请求，并返回支付页面 URL；
* 客户完成支付后，发送 HTTP 请求到指定的 URL 以通知 Cloudreve 支付完成。

## 支付接口定义

按照本章规范实现你的支付接口，部署接口并确保其能与 Cloudreve 相互进行网络通信。

### 创建订单

{% swagger method="post" path="" baseUrl="<你的支付接口>" summary="当有新订单创建时，Cloudreve 向支付你的接口发送的请求。" expanded="true" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="header" required="false" name="Authorization" type="String" %}
使用您在后台设定的

`通信密钥`

计算的签名，详情请参阅“验证请求签名”小节
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Cloudreve-Version" type="String" %}
Cloudreve 主程序的版本
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Site-Id" type="String" %}
Cloudreve 的站点 ID，可用于区分不同站点
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Site-Url" type="String" %}
Cloudreve 的站点 URL
{% endswagger-parameter %}

{% swagger-parameter in="body" name="name" type="String" required="true" %}
订单标题
{% endswagger-parameter %}

{% swagger-parameter in="body" name="order_no" type="String" required="true" %}
订单编号
{% endswagger-parameter %}

{% swagger-parameter in="body" name="notify_url" type="String" required="true" %}
支付成功的回调通知 URL，详情请参考后续“支付成功回调”章节。请存储此项以便后续使用。
{% endswagger-parameter %}

{% swagger-parameter in="body" name="amount" type="String" required="true" %}
订单总金额，单位：分
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="订单创建成功时" %}
```javascript
{
    // 成功的响应固定为 0
    "code": 0,
    // 付款收银台页面的 URL，默认会被生成为二维码展示给用户，用户也可选择直接
    // 打开此 URL
    "data": "https://examplepayment.com/checkout/26544743"
}
```
{% endswagger-response %}

{% swagger-response status="200: OK" description="订单创建失败时" %}
```javascript
{
    // 任意非0代码表示订单创建失败
    "code": 500,
    // 错误的详细描述
    "error": "Failed to create a payment."
}
```
{% endswagger-response %}
{% endswagger %}

请求实例：

```http
POST /order/create
Host: examplepayment.com
Authorization: Bearer Vep6hl1x8fiQLasEauMEUqxFKyEqSXb9D_BBQpOiTd8=:1676027218
X-Cr-Site-Url: https://demo.cloudreve.org
X-Cr-Site-Id: b7de8bba-8f86-40fe-8171-c2625b6c4a61
X-Cr-Cloudreve-Version: 3.6.2

{
   "name":"Cloudreve - 10 GB 容量包",
   "order_no":"20230209190648343421",
   "notify_url":"http://demo.cloudreve.org/api/v3/callback/custom/20230209190648343421/363f8866-6d0a-4dbf-a560-0c17de2eb7f9?sign=F-AdeTf7cR1uwmV1dqJ1kN_POGivKk_awMRPZUCZyhA%3D%3A1676027208",
   "amount":100
}
```

#### 验证请求签名

你可以在 Cloudreve 后台设定`通信密钥`，Cloudreve 创建订单的请求会使用此密钥进行加密并放在`Authorization` header 中，你可以通过以下算法验证这一签名：

1. 将 `Authorization` 值中 `Bearer` 之后的部分取出，使用`:`分割字符串，其第二部分是签名过期的时间戳，验证确保其大于当前时间戳。将`:`前一部分记为`SIGNATURE`；
2. 参考 [getSignContent](https://github.com/cloudreve/Cloudreve/blob/b441d884f61d59da86d861b14d1302ec25bbea40/pkg/auth/auth.go#L71) 对请求正文及 header进行编码，并使用 HMAC 算法对编码内容及过期时间戳计算签名：[Sign](https://github.com/cloudreve/Cloudreve/blob/b441d884f61d59da86d861b14d1302ec25bbea40/pkg/auth/auth.go#L71)；
3. 对比签名后的内容和`SIGNATURE`是否一致。

### 支付成功回调

当用户完成支付后，你需要向此订单被创建时制定的 `notify_url` 发送一个 GET 请求以通知 Cloudreve 用户完成支付。如果回调请求失败，请以指数后退间隔进行重试，除非响应中明确返回了错误信息及代码。

{% swagger method="get" path="" baseUrl="<notify_url>" summary="用户完成支付后，向订单关联的 `notify_url` 发送请求通知 Cloudreve 支付成功。" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-response status="200: OK" description="请求成功" %}
```javascript
{
    "code": 0
}
```
{% endswagger-response %}

{% swagger-response status="200: OK" description="订单处理失败" %}
```javascript
{
    // 任意非0代码表示订单创建失败
    "code": 500,
    // 错误的详细描述
    "error": "Failed to fulfill a payment."
}
```
{% endswagger-response %}
{% endswagger %}

## 添加支付接口

实现并部署支付接口后，请在 Cloudreve 后台 - 增值服务 - 自定义支付渠道 中开启并填写接口地址。

## 第三方实现

| 支付平台 | 许可    | 文档                                                                                             |
| ---- | ----- | ---------------------------------------------------------------------------------------------- |
| 易支付  | 开放源代码 | [https://github.com/topjohncian/cloudreve-epay](https://github.com/topjohncian/cloudreve-epay) |
| 爱发电 | MIT许可 | [https://github.com/essesoul/Cloudreve-AfdianPay](https://github.com/essesoul/Cloudreve-AfdianPay) |
