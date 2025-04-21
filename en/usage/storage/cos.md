# Tencent Cloud COS {#cos}

Store files using [Tencent Cloud COS](https://cloud.tencent.com/product/cos) buckets.

## Configuration {#configure}

### CORS Policy {#cors}

The bucket needs to configure a CORS policy before you can use Cloudreve's web client to upload or browse files. Normally, you can let Cloudreve automatically configure the CORS policy when adding a storage policy. If you need to configure it manually, please add it in `Security Management` -> `Cross-Origin Access CORS`.

## Using Custom Domain Endpoint {#custom-endpoint}

If you only need to use a custom domain (such as a CDN) in file download URLs, you can configure a `Download CDN` in the storage policy. After configured, the hostname and path in the file download URL will be replaced with the CDN URL you provided, but file upload and management requests will still use the official endpoint provided by COS. This section will explain how to configure a custom endpoint for all requests.

### Preparing Custom Domain

Please CNAME resolve or reverse proxy your custom domain to the `Endpoint` with the Bucket name prefix, and add and verify this domain in the COS bucket configuration's `Domain Management`.

If you don't want to add your custom domain in the COS bucket configuration, you can still proceed, but this domain must reverse proxy the `Endpoint`; direct CNAME resolution won't work. When configuring the reverse proxy, please rewrite the request `Host` header to the official `Endpoint` with the Bucket name, otherwise OSS cannot recognize your Bucket. Reference configuration methods are as follows:

::: tabs

=== Nginx

```nginx
location / {
    proxy_pass https://<bucket-name>.cos.<region>.myqcloud.com;
    proxy_set_header Host <bucket-name>.cos.<region>.myqcloud.com;
}
```

=== Caddy

```
reverse_proxy https://<bucket-name>.cos.<region>.myqcloud.com {
	header_up Host {upstream_hostport}
}
```

=== Cloudflare

You need `Origin Rules` included in the `Enterprise` plan to rewrite the `Host` header, please refer to [Change URI Path and Host Header](https://developers.cloudflare.com/rules/origin-rules/examples/change-uri-path-and-host-header/).

:::

### Enable Custom Endpoint

Fill in your custom domain in the storage policy configuration under `Basic Information` -> `Endpoint`.

## FAQ {#faq}

::: details Upload error: `Request failed: AxiosError: Network Error xxx`

1. Check if the storage policy `Endpoint` setting is correct:

   - Make sure this Endpoint is accessible from the user side;
   - If the site has enabled HTTPS, make sure the Endpoint you filled in also starts with HTTPS and has a valid SSL certificate;

2. Check if the CORS policy is set and configured correctly;

:::

::: details Transfer upload failed, message: `Unable to parse response`

1. Expand the detailed error, check if the error message contains `413 Request Entity Too Large`.

   If so, please modify the Nginx reverse proxy configuration to set or increase the value of `client_max_body_size`, for example, `client_max_body_size 20000m;`. This setting value should be larger than the size of the uploaded file.

2. Check if an external WAF firewall is blocking the upload request.

:::

::: details Upload error: `Unable to complete file upload: One or more of the specified parts could not be found xxx`

The root cause of this error is that the Cloudreve client cannot read the `Etag` header returned in the multipart upload request.

1. If your `Endpoint` uses your own reverse proxy server, check if the `Etag` header is filtered out during reverse proxying.
2. Some user-side firewalls (such as TPLink) filter out the `Etag` header, please check the firewall configuration.

:::

::: details After enabling the custom download CDN domain, the file download failed with error `InvalidAccessKeyId`?

When adding a custom CDN acceleration domain to the COS bucket settings, check if you have enabled `Origin-pull authentication`:

- If enabled, the file download request does not need to be signed when using CDN, please enable `Download` -> `Download CD` -> `Skip URL signature for CDN` in the Cloudreve storage policy settings;
- If not enabled, please check if your CDN CNAME is configured correctly and the storage policy credentials are filled in correctly;

:::

<!--@include: ./parts/refer-photopea.md-->
