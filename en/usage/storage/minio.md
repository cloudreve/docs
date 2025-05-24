# MinIO (S3 Compatible) {#minio}

Store files using [MinIO](https://min.io/) with S3 compatible storage policy.

## Configuration {#configure}

Refer to the [MinIO official documentation](https://min.io/docs/minio/kubernetes/upstream/) to deploy your MinIO cluster.

1. Use the Web panel or command line tool [`mc mb`](https://min.io/docs/minio/linux/reference/minio-mc/mc-mb.html) to create a bucket;
2. Use the Web panel or command line tool [`mc admin accesskey create`](https://min.io/docs/minio/linux/reference/minio-mc-admin/mc-admin-accesskey-create.html) to create a set of access keys.

In Cloudreve, create an `S3 Compatible` storage policy and fill in the information according to the following rules:

- For `Bucket Name` in the storage policy, enter the name of the bucket you just created;
- For `Endpoint` in the storage policy, enter the API endpoint of your MinIO cluster, and check `Force Path Style Endpoint`;
- For `Region` in the storage policy, enter `us-east-1`;
- For `Access credential` in the storage policy, enter the `Access Key` and `Secret Key` of the access key you just created;

MinIO does not need to configure a CORS policy, click `I have set it manually` to skip CORS policy creation.

## FAQ {#faq}

::: details Upload error: `Chunk upload failed: X-Amz-Expires must be less than a week (in seconds)`

Check `Settings` -> `Filesystem` -> `Upload session TTL (seconds)`, its value should be less than `604800`.

:::

::: details Upload error: `Request failed: AxiosError: Network Error`

1. Check if the user can connect to your MinIO cluster API endpoint;
2. If your Cloudreve site has HTTPS enabled, please configure HTTPS for the MinIO endpoint, or proxy the MinIO endpoint through a web server;

:::

::: details Transfer upload failed, error: `Unable to parse response`

1. Expand the detailed error and check if the error message contains `413 Request Entity Too Large`.

   If so, modify your Nginx reverse proxy configuration, set or increase the value of `client_max_body_size`, such as `client_max_body_size 20000m;`. This setting value should be larger than the size of the files being uploaded.

2. Check if there is an external WAF firewall blocking the upload request.

:::

::: details Using a MinIO endpoint after reverse proxy, I cannot upload or perform any file operations.

1. If the reverse proxy endpoint contains a port, when configuring Nginx, set `proxy_set_header` to `$http_host`:

   ```nginx
   proxy_set_header Host $host; # [!code --]
   proxy_set_header Host $http_host; # [!code ++]
   ```

2. If the file creation and deletion operations are OK, but you cannot upload files from the Web client, try adding `proxy_cache_convert_head off;` to the Nginx reverse proxy configuration.

:::
