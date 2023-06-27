# Custom payment channel

In addition to the payment platforms already supported by Cloudreve, you can also connect to your own payment platform by implementing Cloudreve's payment interface, or bridge other third-party platforms.

The custom payment interface you implement requires an independent HTTP service and provides:

* Expose an API endpoint to handle Cloudreve's order creation request and return the payment page URL;
* After the customer completes the payment, send an HTTP request to the specified URL to notify Cloudreve that the payment is complete.

## Payment interface definition

Implement your payment interface according to the specifications in this chapter, deploy the interface and ensure that it can communicate with Cloudreve.

### Create Order

{% swagger method="post" path="" baseUrl="<your payment interface>" summary="When a new order is created, Cloudreve sends a request to your payment interface." expanded="true" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="header" required="false" name="Authorization" type="String" %}
Use the

`communication key`

The computed signature, see the subsection "Verifying Request Signatures" for details
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Cloudreve-Version" type="String" %}
Version of Cloudreve main program
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Site-Id" type="String" %}
Cloudreve's site ID, which can be used to distinguish between different sites
{% endswagger-parameter %}

{% swagger-parameter in="header" name="X-Cr-Site-Url" type="String" %}
Cloudreve's site URL
{% endswagger-parameter %}

{% swagger-parameter in="body" name="name" type="String" required="true" %}
order title
{% endswagger-parameter %}

{% swagger-parameter in="body" name="order_no" type="String" required="true" %}
order number
{% endswagger-parameter %}

{% swagger-parameter in="body" name="notify_url" type="String" required="true" %}
The callback notification URL of successful payment, please refer to the subsequent "Payment Successful Callback" section for details. Please save this for later use.
{% endswagger-parameter %}

{% swagger-parameter in="body" name="amount" type="String" required="true" %}
The total amount of the order, unit: cent
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="When the order was created successfully" %}
```javascript
{
     // Successful responses are fixed at 0
     "code": 0,
     // The URL of the payment cashier page will be generated as a QR code by default and displayed to the user, and the user can also choose to directly
     // open this URL
     "data": "https://examplepayment.com/checkout/26544743"
}
```
{% endswagger-response %}

{% swagger-response status="200: OK" description="When order creation failed" %}
```javascript
{
     // Any non-zero code indicates that the order creation failed
     "code": 500,
     // detailed description of the error
     "error": "Failed to create a payment."
}
```
{% endswagger-response %}
{% endswagger %}

Request example:

```http
POST /order/create
Host: examplepayment.com
Authorization: Bearer Vep6hl1x8fiQLasEauMEUqxFKyEqSXb9D_BBQpOiTd8=:1676027218
X-Cr-Site-Url: https://demo.cloudreve.org
X-Cr-Site-Id: b7de8bba-8f86-40fe-8171-c2625b6c4a61
X-Cr-Cloudreve-Version: 3.6.2

{
    "name":"Cloudreve - 10 GB Capacity Pack",
    "order_no": "20230209190648343421",
    "notify_url": "http://demo.cloudreve.org/api/v3/callback/custom/20230209190648343421/363f8866-6d0a-4dbf-a560-0c17de2eb7f9?sign=F-AdeTf7cR1uwmV1dqJ1kN_POGivKk_awMRP%ZUCD8%30hA737D8%"
    "amount": 100
}
```

#### Verify request signature

You can set the `communication key` in the Cloudreve backend, and Cloudreve’s request to create an order will be encrypted with this key and placed in the `Authorization` header. You can verify this signature through the following algorithm:

1. Take out the part after `Bearer` from the `Authorization` value, use `:` to split the string, the second part is the timestamp when the signature expires, and verify that it is greater than the current timestamp. Write the part before `:` as `SIGNATURE`;
2. Refer to [getSignContent](https://github.com/cloudreve/Cloudreve/blob/b441d884f61d59da86d861b14d1302ec25bbea40/pkg/auth/auth.go#L71) to encode the request body and header, and use the HMAC algorithm to encode the encoded content and expire Timestamp calculation signature: [Sign](https://github.com/cloudreve/Cloudreve/blob/b441d884f61d59da86d861b14d1302ec25bbea40/pkg/auth/auth.go#L71);
3. Check whether the signed content is consistent with `SIGNATURE`.

### Payment success callback

When the user completes the payment, you need to send a GET request to the `notify_url` specified when the order was created to notify Cloudreve that the user has completed the payment. If the callback request fails, retry with an exponential backoff interval, unless an error message and code are explicitly returned in the response.

{% swagger method="get" path="" baseUrl="<notify_url>" summary="After the user completes the payment, send a request to `notify_url` associated with the order to notify Cloudreve that the payment is successful." %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-response status="200: OK" description="The request was successful" %}
```javascript
{
     "code": 0
}
```
{% endswagger-response %}

{% swagger-response status="200: OK" description="Order processing failed" %}
```javascript
{
     // Any non-zero code indicates that the order creation failed
     "code": 500,
     // detailed description of the error
     "error": "Failed to fulfill a payment."
}
```
{% endswagger-response %}
{% endswagger %}

## Add payment interface

After implementing and deploying the payment interface, please open and fill in the interface address in Cloudreve Background - Value-added Services - Custom Payment Channel.

## Third-party implementation

| Payment Platform | License | Documentation |
| ---- | ----- | -------------------------------------- -------------------------------------------------- ------ |
| Easy Payment | Open Source | [https://github.com/topjohncian/cloudreve-epay](https://github.com/topjohncian/cloudreve-epay) |
