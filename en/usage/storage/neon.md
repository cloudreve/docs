# Neon Object Storage (S3 Compatible) {#neon}

Store files using [Neon Object Storage](https://neon.com/docs/storage/overview) with S3 compatible storage policy.

## Configuration {#configure}

Create a bucket on the branch you want to use, either from the `Storage` page of the Neon Console or with the [Neon CLI](https://neon.com/docs/reference/neon-cli):

```bash
neon buckets create cloudreve --project-id <project-id> --branch <branch>
```

Create a credential with read and write access to storage, either from `Connect` -> `Storage` -> `Reveal credential` in the Neon Console or with the Neon CLI:

```bash
neon credentials create --scope storage:read --scope storage:write --name cloudreve --project-id <project-id> --branch <branch>
```

In Cloudreve, create an `S3 Compatible` storage policy and fill in the information according to the following rules:

- For `Bucket Name` in the storage policy, enter the name of the bucket you just created;
- For `Endpoint` in the storage policy, enter the S3 endpoint of your branch, shown as `AWS_ENDPOINT_URL_S3` in the Neon Console, for example `https://br-cool-darkness-a1b2c3d4.storage.c-1.us-east-2.aws.neon.tech`;
- Check the `Force path style` option. Neon Object Storage only supports path-style addressing;
- For `Region` in the storage policy, enter the AWS region of your Neon project, shown as `AWS_REGION` in the Neon Console, for example `us-east-2`;
- For `Access credential` in the storage policy, enter the `token_id` as the `Access Key ID` and the `s3_secret_access_key` as the `Secret Access Key`;
- Set `Max single file size` to `5 GB` or less. Neon Object Storage limits a single object to 5 GiB.

::: tip Branches

Each Neon branch has its own S3 endpoint, and buckets branch together with your database. Point the storage policy at the endpoint of the branch that holds the data you want Cloudreve to use. A credential works on the branch it was created on and on every branch created from it.

:::

### CORS Policy

The bucket needs a CORS policy before you can use Cloudreve's web client to upload or browse files. Neon Object Storage supports `PutBucketCors`, so you can let Cloudreve configure the CORS policy automatically when adding the storage policy.

## Using Publicly Accessible Buckets {#public-access}

::: warning Warning

When using publicly accessible buckets, anyone can access your files without authorization.

:::

Bucket access is set on the Neon side and cannot be changed through the S3 API. To create a public bucket, pass `--access-level public_read` when creating it:

```bash
neon buckets create cloudreve --access-level public_read --project-id <project-id> --branch <branch>
```

Then set `Bucket ACL` to `Public read` in the storage policy settings and keep `Force path style` checked. Files are served from `<endpoint>/<bucket>/<key>`.

## FAQ {#faq}

::: details Upload error: `Request failed: AxiosError: Network Error`

1. Check if the storage policy `Endpoint` setting is correct, and that `Force path style` is checked;
2. Check if the CORS policy is set and configured correctly;
3. Check `Settings` -> `Filesystem` -> `Upload session TTL (seconds)`, its value should be less than `604800`.

:::

::: details Upload error: `Unable to create upload session: Unknown error (failed to create multipart upload: AccessDenied: Access Denied`

1. Check if the storage policy `Access credential` is correct, and that the credential has both the `storage:read` and `storage:write` scopes;
2. Check that the credential was created on the branch of the `Endpoint`, or on one of its parent branches.

:::

::: details Downloaded files are not named after the file name shown in Cloudreve

This only happens with publicly accessible buckets. For public buckets, Cloudreve serves unsigned URLs, and Neon Object Storage ignores the `response-content-disposition` parameter on anonymous requests, so downloaded files are named after the blob name. Enable `Download relay` in the storage policy settings to let Cloudreve proxy downloads and set the file name itself. Download traffic will then pass through your Cloudreve server.

:::

::: details Uploading a file larger than 5 GB fails

Neon Object Storage limits a single object to 5 GiB. Set `Max single file size` in the storage policy to `5 GB` or less.

:::
