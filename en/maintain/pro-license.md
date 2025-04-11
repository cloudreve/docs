# Pro License Management {#pro-license}

::: tip <Badge type="tip" text="Pro" />
This section only applies to the Pro edition.
:::

## License Forms {#license-form}

Cloudreve Pro license is assigned to a root domain. You can obtain the following license keys from the [License Management Dashboard](https://cloudreve.org/login):

##### License Key

Most commonly used, valid long-term. When starting Cloudreve Pro edition, you need to provide this parameter through the `--license-key` argument or the `CR_LICENSE_KEY` environment variable. This key is bound to your license account and can be used to redeem an `Offline License Key`. When connected to the internet, Cloudreve will use this key to redeem an `Offline License Key` at the first startup.

##### Offline License Key

Valid for a shorter period. The offline license contains information about all authorized domains, subdomains, iOS VOL licenses, etc. under your account. When connected to the internet, Cloudreve will periodically exchange the `License Key` for a new `Offline License Key` to prevent the `Offline License Key` from expiring.

Cloudreve requires a valid (though it can be expired) `Offline License Key` to start properly. Once expired, the site will become read-only, preventing major modification operations (such as file modifications). You can click the `Refresh Offline License` button at the bottom of the admin dashboard to update the `Offline License Key` using the `License Key`. If this operation fails, you can manually enter the `Offline License Key` obtained from the [License Management Dashboard](https://cloudreve.org/login) in the popup window.

When you update subdomains, root domains, or purchase iOS VOL licenses in the [License Management Dashboard](https://cloudreve.org/login), please update your `Offline License Key` promptly.

## Using Offline {#offline}

In a completely offline situation, before starting Cloudreve for the first time, obtain the `Offline License Key` and `License Key` from the [License Management Dashboard](https://cloudreve.org/login), then pass them through environment variables or command line parameters.

:::tabs

=== Environment Variables

```bash
export CR_LICENSE_KEY="your license key"
export CR_OFFLINE_LICENSE="your offline license key"
./cloudreve
```

=== Command Line Parameters

```bash
./cloudreve --license-key="your license key" --offline-license="your offline license key"
```

:::

After successful startup, you will need to manually update the `Offline License Key` before it expires. You can click the `Refresh Offline License` button at the bottom of the admin dashboard and wait for it to fail to display the manual update window.

## FAQ {#faq}

::: details How to license a local network IP?

It is not recommended to directly license a fixed IP address, as local network IPs may change, while licensed domains cannot be changed. You can first license a root domain, and when deploying on a local network, resolve the licensed domain to the local network IP, then access Cloudreve using the licensed domain.

:::
