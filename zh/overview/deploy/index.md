# 规划部署 {#planning-deployment}

## 部署方式 {#deployment-methods}

Cloudreve 支持使用以下方式部署：

| 部署方式                              | 说明                                                                                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Docker Compose](./docker-compose.md) | 使用 Docker Compose 启动多个容器，其中默认包含并启用了： <ul><li>Cloudreve 主程序；</li><li>Redis；</li><li>PostgreSQL 数据库；</li><li>离线下载器 (Aria2)；</li><li>缩略图组件 (VIPS, FFMpeg, LibreOffice)；</li><li>视频信息提取 (FFProbe)</li></ul>              |
| [Docker 单容器](./docker.md)          | 直接使用我们提供的镜像启动容器，其中默认包含并启用了： <ul><li>Cloudreve 主程序；</li><li>离线下载器 (Aria2)；</li><li>缩略图组件 (VIPS, FFMpeg, LibreOffice)；</li><li>视频信息提取 (FFProbe)</li></ul> 你仍然需要根据需求自行配置数据库和 Redis。 |
| [进程守护](./supervisor.md)           | 使用进程守护工具（如 Supervisor）启动 Cloudreve 主程序。你仍然需要根据需求自行配置数据库和 Redis。                                                                                                                                                                  |

请根据需求或喜好选择合适的部署方式。我们推荐使用 Docker Compose 或 Docker 单容器部署，因为它更易于管理，并且提供了更丰富的功能。

## 数据库

Cloudreve 支持使用以下数据库：

- MySQL
- PostgreSQL
- SQLite

在没有配置数据库的情况下，Cloudreve 会使用 SQLite 存储数据，但 SQLite 不支持高并发，因此我们强烈建议在生产环境中使用其他数据库。如果你使用 Docker Compose 部署，其中已经默认配置了 PostgreSQL 数据库，其他部署方式需要额外配置。

## Redis

Cloudreve 支持使用 Redis 作为键值缓存，但 Redis 不是必须的，在没有配置 Redis 的情况下，Cloudreve 会使用内存缓存，并在正常退出前将内存缓存的数据持久化到 `cache_persist.bin` 文件中。

## 下一步

选择对应的部署方式，按照文档说明进行部署。
