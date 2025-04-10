# Local Storage {#local-storage}

Using the local storage policy, files are stored on the same server as Cloudreve.

## Configuration {#configure}

### File Storage Path {#file-storage-path}

You can modify the `Blob Storage Directory` in the storage policy configuration to specify the file storage path. By default, newly created local storage strategies use the `data/uploads` directory under the same directory as the Cloudreve executable. You can modify this as needed. If you enter a relative path, it will be relative to the directory where the Cloudreve executable is located.

> [!TIP]
> If you specified the [`--use-working-dir`](../../overview/cli#global-parameters) parameter in the Cloudreve command line arguments, the relative path of the `Blob Storage Directory` will be relative to the working directory at startup.

### Pre-allocate Disk Space {#pre-allocate-disk-space}

On Linux or macOS, when the `Pre-allocate disk space` option is enabled, Cloudreve will pre-allocate disk space when the upload begins, reducing fragmentation caused by chunk uploads.

## Frequently Asked Questions {#faq}

::: details Uploaded files cannot be downloaded, and thumbnails are not visible.

1. Check the site URL settings.

   Verify that the hostname portion of the URL generated for downloading files is correct. Go to `Admin Panel` -> `Settings` -> `Site Information` to check if the current site URL is in the list.

   - If it's not in the list, add it, then go to `Admin Panel` -> `File System`, click `Clear Blob URL Cache` at the bottom, and try downloading again.
   - If it's in the list, but the hostname in the download link is still incorrect, make sure that your web server reverse proxy configuration correctly forwards the `Host` header. For example, in Nginx, you need to add the `proxy_set_header Host $host;` directive in the `location /` configuration block.

2. Check if you're using an HTTP site URL in an HTTPS environment.
3. Check if the server time differs significantly from the client time. If there's a large difference, synchronize the time, then go to `Admin Panel` -> `File System`, click `Clear Blob URL Cache` at the bottom, and try downloading again.
4. If you're using Cloudflare, please check that the `Cache Level` is set to `Standard`.

:::

::: details The domain/hostname in the file download link is not the one I'm currently using to access the site.
Go to `Admin Dashboard` -> `Settings` -> `Basic` to check if the current site URL is in the list.

- If it's not in the list, add it, then go to `Admin Dashboard` -> `Settings` -> `Filesystem`, click `Clear Blob URL Cache` at the bottom, and try downloading again.
- If it's in the list, but the hostname in the download link is still incorrect, make sure that your web server reverse proxy configuration correctly forwards the `Host` header. For example, in Nginx, you need to add the `proxy_set_header Host $host;` directive in the `location /` configuration block.

:::

::: details The file shows as successfully uploaded, but in the file list it still displays as "Uploading".
Please check if an external WAF firewall is blocking the upload request.
:::

::: details File upload failed with the message "Cannot parse response".

1. Expand the detailed error and check if it contains the phrase `413 Request Entity Too Large`.

   If it does, modify your Nginx reverse proxy configuration to set or increase the value of `client_max_body_size`, for example: `client_max_body_size 20000m;`. If chunk upload is enabled, this value should be larger than the chunk size; if chunk upload is not enabled, this value should be larger than the size of the uploaded file.

2. Check if an external WAF firewall is blocking the upload request.

:::
