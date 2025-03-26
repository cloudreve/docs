# 使用 Docker Compose 部署 {#deploy-with-docker-compose}

使用 Docker Compose 可以部署多个用于支持 Cloudreve 运行的容器，包括数据库和 Redis。

## 前置准备 {#prerequisites}

请参考 [Docker Compose 安装文档](https://docs.docker.com/compose/install/) 安装 Docker 和 Docker Compose。

## 准备 `docker-compose.yml` 文件 {#prepare-docker-compose-yml}

创建一个目录作为 Docker Compose 文件的存储目录，比如：

```bash
mkdir -p ~/cloudreve
cd ~/cloudreve
```

将获取到的 `docker-compose.yml` 文件保存到此目录。

:::tabs
== 社区版

将 [GitHub 仓库](https://github.com/cloudreve/Cloudreve/blob/master/docker-compose.yml) 中的 `docker-compose.yml` 文件保存到服务端。

== Pro 版

如下是一个包含所有必要服务的 Pro 版 `docker-compose.yml` 文件示例。将其保存到服务端。

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

## 启动 {#start}

:::tabs
== 社区版

在 `docker-compose.yml` 文件所在目录下运行：

```bash
docker-compose up -d
```

== Pro 版

在 [Pro 授权管理面板](https://cloudreve.org/login) 点击 `获取 Docker 镜像` 按钮，并生成一份用于登录 Pro 版本私有镜像仓库的账号，点击`获取授权密钥`按钮，将获取到的授权密钥保存到 `CR_LICENSE_KEY` 环境变量中，然后启动。

```bash
# 登录 Pro 版本私有镜像仓库
docker login -u 获取到的用户名 -p 获取到的密码 cloudreve.azurecr.io

# 设置授权密钥
export CR_LICENSE_KEY=你的授权密钥

# 启动
docker-compose up -d
```

> [!NOTE]
> 你获取到的容器仓库凭证并非永久有效，如果后续更新拉取镜像时出现凭证过期的情况，请重新获取并登录。

:::

## 下一步 {#next-steps}

至此，Cloudreve 已经启动成功并监听 5212 端口，请继续前往 [后续步骤](./configure) 页面，完善你的部署。

## 常见问题 {#common-issues}

::: details 容器一直重启？

先找到重启的容器，然后查看日志：

```bash
docker logs -f 容器ID
```

:::

::: details Cloudreve 报错 `Please specify license key by ...`

请检查你在启动前是否正确设置了 `CR_LICENSE_KEY` 环境变量，其值为你在 [Pro 授权管理面板](https://cloudreve.org/login) 获取到的授权密钥。

:::

::: details 如何更新 Cloudreve？

```bash
# 关闭当前运行的容器
docker-compose down

# 更新 Cloudreve 镜像
docker-compose pull

# 启动新的容器
docker-compose up -d
```

你还需要参考 [更新 Cloudreve](./maintain/update) 页面，完成后续流程。

:::
