# Planning Deployment {#planning-deployment}

## Deployment Methods {#deployment-methods}

Cloudreve supports the following deployment methods:

| Deployment Method                      | Description                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Docker Compose](./docker-compose.md)  | Use Docker Compose to start multiple containers, which by default includes and enables: <ul><li>Cloudreve main program;</li><li>Redis;</li><li>PostgreSQL database;</li><li>Offline downloader (Aria2);</li><li>Thumbnail components (VIPS, FFMpeg, LibreOffice);</li><li>Video information extraction (FFProbe)</li></ul>                                                     |
| [Docker Single Container](./docker.md) | Directly use our provided image to start a container, which by default includes and enables: <ul><li>Cloudreve main program;</li><li>Offline downloader (Aria2);</li><li>Thumbnail components (VIPS, FFMpeg, LibreOffice);</li><li>Video information extraction (FFProbe)</li></ul> You still need to configure the database and Redis according to your needs. |
| [Process Supervisor](./supervisor.md)  | Use a process supervision tool (such as Supervisor) to start the Cloudreve main program. You still need to configure the database and Redis according to your needs.                                                                                                                                                                                                           |

Please choose a suitable deployment method according to your needs or preferences. We recommend using Docker Compose or Docker single container deployment because it's easier to manage and provides more features.

## Database

Cloudreve supports the following databases:

- MySQL
- PostgreSQL
- SQLite

Without database configuration, Cloudreve will use SQLite to store data. However, SQLite does not support high concurrency, so we strongly recommend using other databases in production environments. If you deploy with Docker Compose, it already has PostgreSQL database configured by default; other deployment methods require additional configuration.

## Redis

Cloudreve supports using Redis as a key-value cache, but Redis is not mandatory. Without Redis configuration, Cloudreve will use memory cache and persist the cached data to the `cache_persist.bin` file before normal exit.

## Next Steps

Choose the corresponding deployment method and follow the documentation for deployment.
