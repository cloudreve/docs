# Deploy with Docker Compose {#deploy-with-docker-compose}

Using Docker Compose you can deploy multiple containers to support Cloudreve's operation, including database and Redis.

## Prerequisites {#prerequisites}

Please refer to the [Docker Compose installation documentation](https://docs.docker.com/compose/install/) to install Docker and Docker Compose.

## Prepare Compose Files {#prepare-docker-compose-yml}

Clone the [Docker Compose repository](https://github.com/cloudreve/docker-compose) to your server:

```bash
git clone https://github.com/cloudreve/docker-compose.git ~/cloudreve
cd ~/cloudreve
```

Copy the example environment file:

```bash
cp .env.example .env
```

The repository contains the following compose files:

| File | Description |
| --- | --- |
| `docker-compose.yml` | Base stack: Cloudreve + PostgreSQL + Redis |
| `docker-compose.pro.yml` | Pro edition override: switches to Pro image and adds license key |
| `docker-compose.fts.yml` | Full-text search addon: adds Apache Tika and Meilisearch, see [Full-text Search](../../usage/search/fts) |

## Start {#start}

:::tabs
== Community Edition

Run the following command in the directory where the `docker-compose.yml` file is located:

```bash
docker compose up -d
```

== Pro Edition

In the [Pro license management panel](https://cloudreve.org/login), click the `Get Docker Image` button and generate an account for logging into the Pro edition private image registry. Click the `Get Authorization Key` button, and save the obtained authorization key as `CR_LICENSE_KEY` in the `.env` file.

```bash
# Log in to the Pro edition private image registry
docker login -u obtained_username -p obtained_password cloudreve.azurecr.io

# Edit .env and set CR_LICENSE_KEY=your_authorization_key

# Start with Pro override
docker compose -f docker-compose.yml -f docker-compose.pro.yml up -d
```

> [!NOTE]
> The container registry credentials you obtained are not permanently valid. If you encounter credential expiration issues when pulling images for future updates, please re-obtain and log in again.

:::

## Next Steps {#next-steps}

Cloudreve will listen on port 5212 by default. You can access Cloudreve by visiting `http://localhost:5212` in your browser. Please register an account; the first registered account will be set as the administrator.

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

::: details How to upgrade Cloudreve?

<!--@include: ../../parts/docker-compose-upgrade.md-->

You also need to refer to the [Upgrade Cloudreve](../../maintain/upgrade) page to complete the subsequent process.

:::
