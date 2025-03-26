# Deploy with Docker Compose {#deploy-with-docker-compose}

Using Docker Compose you can deploy multiple containers to support Cloudreve's operation, including database and Redis.

## Prerequisites {#prerequisites}

Please refer to the [Docker Compose installation documentation](https://docs.docker.com/compose/install/) to install Docker and Docker Compose.

## Prepare `docker-compose.yml` File {#prepare-docker-compose-yml}

Create a directory to store the Docker Compose file, for example:

```bash
mkdir -p ~/cloudreve
cd ~/cloudreve
```

Save the obtained `docker-compose.yml` file to this directory.

:::tabs
== Community Edition

Save the `docker-compose.yml` file from the [GitHub repository](https://github.com/cloudreve/Cloudreve/blob/master/docker-compose.yml) to your server.

== Pro Edition

Below is an example `docker-compose.yml` file for the Pro edition that includes all necessary services. Save it to your server.

```yaml
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

  postgresql:
    image: postgres:latest
    container_name: postgresql
    environment:
      - POSTGRES_USER=cloudreve
      - POSTGRES_DB=cloudreve
      - POSTGRES_HOST_AUTH_METHOD=trust
    volumes:
      - database_postgres:/var/lib/postgresql/data

  redis:
    image: redis:latest
    container_name: redis
    volumes:
      - backend_data:/data

volumes:
  backend_data:
  database_postgres:
```

:::

## Start {#start}

:::tabs
== Community Edition

Run the following command in the directory where the `docker-compose.yml` file is located:

```bash
docker-compose up -d
```

== Pro Edition

In the [Pro license management panel](https://cloudreve.org/login), click the `Get Docker Image` button and generate an account for logging into the Pro edition private image registry. Click the `Get Authorization Key` button, save the obtained authorization key to the `CR_LICENSE_KEY` environment variable, and then start.

```bash
# Log in to the Pro edition private image registry
docker login -u obtained_username -p obtained_password cloudreve.azurecr.io

# Set authorization key
export CR_LICENSE_KEY=your_authorization_key

# Start
docker-compose up -d
```

> [!NOTE]
> The container registry credentials you obtained are not permanently valid. If you encounter credential expiration issues when pulling images for future updates, please re-obtain and log in again.

:::

## Next Steps {#next-steps}

At this point, Cloudreve has started successfully and is listening on port 5212. Please continue to the [Next Steps](./configure) page to complete your deployment.

## Common Issues {#common-issues}

::: details Container keeps restarting?

First, find the restarting container, then check the logs:

```bash
docker logs -f container_ID
```

:::

::: details Cloudreve reports `Please specify license key by ...`

Please check whether you have correctly set the `CR_LICENSE_KEY` environment variable before starting. Its value should be the authorization key obtained from the [Pro license management panel](https://cloudreve.org/login).

:::

::: details How to update Cloudreve?

```bash
# Shut down the currently running containers
docker-compose down

# Update the Cloudreve image
docker-compose pull

# Start new containers
docker-compose up -d
```

You also need to refer to the [Update Cloudreve](./maintain/update) page to complete the subsequent process.

:::
