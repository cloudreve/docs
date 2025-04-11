# Official Payment Platforms {#official}

::: tip <Badge type="tip" text="Pro edition" />
This section introduces a Pro edition feature.
:::

This section describes how to use the payment platforms natively supported by Cloudreve: Alipay, WeChat Pay, and Stripe.

## Currency Settings {#currency}

Set the pricing currency in `Settings` -> `VAS` -> `Payment settings`. This setting is not effective for WeChat and Alipay, which must be set to Chinese Yuan.

##### Currency Code

The currency letter code as defined in the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) standard.

##### Currency Symbol

The currency symbol, such as `¥` or `$`, used for display on the store page.

##### Currency Unit

Defines how many minimum currency units equal one integer unit in this currency. For example:

- 1 US dollar = 100 cents, enter `100` here;
- 1 Japanese yen is already the smallest unit, enter `1` here.

## Frequently Asked Questions {#faq}

::: details The actual payment amount differs from the amount set in the store.

Please check if the currency settings are correct, ensuring that the `Currency unit` set in `Settings` -> `VAS` -> `Payment settings` matches the actual situation. After updating this setting, recheck the price settings for the products.

:::
