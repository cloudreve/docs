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

Refer to [Get Image](../overview/deploy/docker#get-image) to log in to the container registry, edit the `docker-compose.yml` file, replace the original Community edition image with the Pro edition image, and pass in the license key through environment variables. For example:

```yaml{3,18}
services:
  pro:
    image: cloudreve.azurecr.io/cloudreve/pro:latest
    container_name: cloudreve-pro-backend
    depends_on:
      - postgresql
      - redis
    restart: always
    ports:
      - 5212:5212
    environment:
      - CR_CONF_Database.Type=postgres
      - CR_CONF_Database.Host=postgresql
      - CR_CONF_Database.User=cloudreve
      - CR_CONF_Database.Name=cloudreve
      - CR_CONF_Database.Port=5432
      - CR_CONF_Redis.Server=redis:6379
      - CR_LICENSE_KEY=${CR_LICENSE_KEY}
    volumes:
      - backend_data:/cloudreve/data

...
```

Before starting, write the license key to the `CR_LICENSE_KEY` environment variable.

```bash
export CR_LICENSE_KEY=your-license-key
docker-compose up -d
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
