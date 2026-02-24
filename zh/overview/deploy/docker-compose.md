# 使用 Docker Compose 部署 {#deploy-with-docker-compose}

使用 Docker Compose 可以部署多个用于支持 Cloudreve 运行的容器，包括数据库和 Redis。

## 前置准备 {#prerequisites}

请参考 [Docker Compose 安装文档](https://docs.docker.com/compose/install/) 安装 Docker 和 Docker Compose。

## 准备 Compose 文件 {#prepare-docker-compose-yml}

将 [Docker Compose 仓库](https://github.com/cloudreve/docker-compose) 克隆到服务端：

```bash
git clone https://github.com/cloudreve/docker-compose.git ~/cloudreve
cd ~/cloudreve
```

复制示例环境变量文件：

```bash
cp .env.example .env
```

仓库中包含以下 Compose 文件：

| 文件 | 说明 |
| --- | --- |
| `docker-compose.yml` | 基础服务栈：Cloudreve + PostgreSQL + Redis |
| `docker-compose.pro.yml` | Pro 版覆盖：切换为 Pro 镜像并添加授权密钥 |
| `docker-compose.fts.yml` | 全文搜索附加组件：添加 Apache Tika 和 Meilisearch，详见[全文搜索](../../usage/search/fts) |

## 启动 {#start}

:::tabs
== 社区版

在 `docker-compose.yml` 文件所在目录下运行：

```bash
docker compose up -d
```

== Pro 版

在 [Pro 授权管理面板](https://cloudreve.org/login) 点击 `获取 Docker 镜像` 按钮，并生成一份用于登录 Pro 版本私有镜像仓库的账号，点击`获取授权密钥`按钮，将获取到的授权密钥保存到 `.env` 文件中的 `CR_LICENSE_KEY`。

```bash
# 登录 Pro 版本私有镜像仓库
docker login -u 获取到的用户名 -p 获取到的密码 cloudreve.azurecr.io

# 编辑 .env 文件，设置 CR_LICENSE_KEY=你的授权密钥

# 使用 Pro 覆盖文件启动
docker compose -f docker-compose.yml -f docker-compose.pro.yml up -d
```

> [!NOTE]
> 你获取到的容器仓库凭证并非永久有效，如果后续更新拉取镜像时出现凭证过期的情况，请重新获取并登录。

:::

## 下一步 {#next-steps}

Cloudreve 默认会监听 5212 端口。你可以在浏览器中访问 `http://localhost:5212` 进入 Cloudreve。请注册一个账户，首个注册的账户会被设置为管理员。

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

<!--@include: ../../parts/docker-compose-upgrade.md-->

你还需要参考 [更新 Cloudreve](../../maintain/upgrade) 页面，完成后续流程。

:::
