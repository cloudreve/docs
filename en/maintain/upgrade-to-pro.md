# Upgrade to Pro edition {#upgrade-to-pro}

If you've been using the Community edition of Cloudreve, after obtaining the Pro edition, you can upgrade while preserving your data.

## Replace Executable File {#replace-main-program}

:::tabs

=== Direct Deployment

Back up all data and replace the Pro edition executable file in the original Community edition directory. You need to update the startup parameters - the Pro edition requires the `--license-key` parameter when starting, passing in the key obtained from your license management panel.

=== Docker

Refer to [Get Image](../overview/deploy/docker#get-image) to log in to the container registry, replace the original Community edition image with the Pro edition image, and pass in the license key through environment variables. For example:

```bash{3-4}
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    -e CR_LICENSE_KEY=your-license-key \
    cloudreve.azurecr.io/cloudreve/pro:latest
```

=== Docker Compose

Refer to [Get Image](../overview/deploy/docker#get-image) to log in to the container registry. Save the license key as `CR_LICENSE_KEY` in the `.env` file, then start with the Pro override:

```bash
# Edit .env and set CR_LICENSE_KEY=your-license-key

docker compose -f docker-compose.yml -f docker-compose.pro.yml up -d
```

:::

## Execute Upgrade Script {#execute-upgrade-script}

:::tabs

=== Direct Deployment

Execute the following command to upgrade the database to Pro edition:

```bash
./cloudreve proupgrade
```

=== Docker or Docker Compose

Use `docker exec` to enter the container and execute the following command to upgrade the database to Pro edition:

```bash
docker exec -it <container-name> ./cloudreve proupgrade
```

:::

::: tip

You can specify the configuration file location with `-c`:

```bash
./cloudreve proupgrade -c data/conf.ini
```

:::

If you are using SQLite database, the storage policy settings for user groups will be lost. Please reconfigure them in the admin dashboard after the Pro edition starts.
