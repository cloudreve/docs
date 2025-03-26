# 使用 Docker 部署 {#deploy-with-docker}

## 前置准备 {#prerequisites}

请参考 [Docker 安装文档](https://docs.docker.com/install/) 安装 Docker。

## 获取镜像 {#get-image}

:::tabs
== 社区版

你可以在 [cloudreve/cloudreve](https://hub.docker.com/r/cloudreve/cloudreve) 仓库页面找到所有可用的标签。

== Pro 版

在 [Pro 授权管理面板](https://cloudreve.org/login) 点击 `获取 Docker 镜像` 按钮， 列出当前可用的镜像，并生成一份用于登录 Pro 版本私有镜像仓库的账号，然后使用 `docker login` 命令登录。

```bash
docker login -u 获取到的用户名 -p 获取到的密码 cloudreve.azurecr.io
```

> [!NOTE]
> 你获取到的容器仓库凭证并非永久有效，如果后续更新拉取镜像时出现凭证过期的情况，请重新获取并登录。

:::

## 启动 {#start}

:::tabs
== 社区版

```bash
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    cloudreve/cloudreve:latest
```

== Pro 版

在 [Pro 授权管理面板](https://cloudreve.org/login) 点击`获取授权密钥`按钮，在启动镜像时通过环境变量传入。

```bash
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    -e CR_LICENSE_KEY=你的授权密钥 \
    cloudreve.azurecr.io/cloudreve/pro:latest
```

:::

### 容器 Volume {#container-volume}

在上面的例子中，我们使用 `-v ~/cloudreve/data:/cloudreve/data` 挂载了宿主机的 `~/cloudreve/data` 目录到容器内的 `/cloudreve/data` 目录，以便于在宿主机修改 Cloudreve 配置文件。所有 Cloudreve 额外产生的文件（头像、配置文件、临时目录）等，默认都会存储到此目录。

## 配置数据库 {#configure-database}

在以上启动命令中，我们没有配置数据库，Cloudreve 会使用 SQLite 存储数据。如果需要让 Cloudreve 连接其他数据库，你可以选择下面任一方式：

:::tabs
== 在容器启动时配置

在启动容器时，你可以通过环境变量传入数据库配置：

```bash{3-8}
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    -e CR_CONF_Database.Type=postgres \
    -e CR_CONF_Database.Host=127.0.0.1 \
    -e CR_CONF_Database.Port=5432 \
    -e CR_CONF_Database.User=cloudreve \
    -e CR_CONF_Database.Password=cloudreve \
    -e CR_CONF_Database.Name=cloudreve \
    .....
```

其中可用的配置变量为：

| 变量名                        | 说明                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `CR_CONF_Database.Type`       | 数据库类型，支持 `postgres`、`mysql`、`sqlite`           |
| `CR_CONF_Database.Host`       | 数据库地址                                               |
| `CR_CONF_Database.Port`       | 数据库端口                                               |
| `CR_CONF_Database.User`       | 数据库用户名                                             |
| `CR_CONF_Database.Password`   | 数据库密码                                               |
| `CR_CONF_Database.Name`       | 数据库名称                                               |
| `CR_CONF_Database.DBFile`     | 可选，SQLite 数据库文件路径                              |
| `CR_CONF_Database.UnixSocket` | 可选，`true` 或 `false`，是否使用 Unix Socket 连接数据库 |

== 在容器启动后配置

在容器启动后，你可以通过修改宿主机上挂载的 `~/cloudreve/data/config.ini` 文件来增加数据库配置：

```ini{5-11}
[System]
Mode = master
Listen = :5212

[Database]
Type = mysql
Port = 3306
User = cloudreve
Password = cloudreve
Host = 127.0.0.1
Name = cloudreve
```

其中可用的配置项为：

| 设置名       | 说明                                                     |
| ------------ | -------------------------------------------------------- |
| `Type`       | 数据库类型，支持 `postgres`、`mysql`、`sqlite`           |
| `Host`       | 数据库地址                                               |
| `Port`       | 数据库端口                                               |
| `User`       | 数据库用户名                                             |
| `Password`   | 数据库密码                                               |
| `Name`       | 数据库名称                                               |
| `DBFile`     | 可选，SQLite 数据库文件路径                              |
| `UnixSocket` | 可选，`true` 或 `false`，是否使用 Unix Socket 连接数据库 |

修改配置文件后，需要重启容器生效。

:::

## 配置 Redis {#configure-redis}

在以上启动命令中，我们没有配置 Redis，Cloudreve 会使用内置内存存储。如果需要让 Cloudreve 连接 Redis，你可以选择下面任一方式：

:::tabs

=== 在容器启动时配置

在启动容器时，你可以通过环境变量传入 Redis 配置：

```bash{3-5}
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    -e CR_CONF_Redis.Server=127.0.0.1:6379 \
    -e CR_CONF_Redis.Password=your_redis_password \
    -e CR_CONF_Redis.DB=0 \
    cloudreve/cloudreve:latest
```

其中可用的配置变量为：

| 变量名                   | 说明                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CR_CONF_Redis.Server`   | Redis 地址                                                                                                                                                                                             |
| `CR_CONF_Redis.Password` | 连接密码                                                                                                                                                                                               |
| `CR_CONF_Redis.DB`       | 数据库编号，默认为 `0`                                                                                                                                                                                 |
| `CR_CONF_Redis.Network`  | 网络类型，默认为`tcp`，可选 `tcp`, `tcp4` (IPv4-only), `tcp6` (IPv6-only), `udp`, `udp4` (IPv4-only), `udp6` (IPv6-only), `ip`, `ip4` (IPv4-only), `ip6` (IPv6-only), `unix`, `unixgram`, `unixpacket` |
| `CR_CONF_Redis.User`     | Redis ACL 用户名                                                                                                                                                                                       |

=== 在容器启动后配置

在容器启动后，你可以通过修改宿主机上挂载的 `~/cloudreve/data/config.ini` 文件来增加 Redis 配置：

```ini{5-8}
[System]
Mode = master
Listen = :5212

[Redis]
Server = 127.0.0.1:6379
Password = your_redis_password
DB = 0
```

其中可用的配置项为：

| 设置名     | 说明                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Server`   | Redis 地址                                                                                                                                                                                             |
| `Password` | 连接密码                                                                                                                                                                                               |
| `DB`       | 数据库编号, 默认为 `0`                                                                                                                                                                                 |
| `Network`  | 网络类型，默认为`tcp`，可选 `tcp`, `tcp4` (IPv4-only), `tcp6` (IPv6-only), `udp`, `udp4` (IPv4-only), `udp6` (IPv6-only), `ip`, `ip4` (IPv4-only), `ip6` (IPv6-only), `unix`, `unixgram`, `unixpacket` |
| `User`     | Redis ACL 用户名                                                                                                                                                                                       |

修改配置文件后，需要重启容器生效。

:::

## 下一步 {#next-steps}

至此，Cloudreve 已经启动成功并监听 5212 端口，请继续前往 [后续步骤](./configure) 页面，完善你的部署。

## 常见问题 {#common-issues}

::: details 容器无法启动？

先找到重启的容器，然后查看日志：

```bash
docker logs -f cloudreve
```

在启动阶段 Cloudreve 异常退出的原因主要是传入配置有问题，你可以通过容器日志找到相关线索，常见的错误有：

- 数据库配置错误；
- Redis 配置错误；
- 授权密钥错误；

:::

::: details Cloudreve 报错 `Please specify license key by ...`

请检查你在启动前是否正确设置了 `CR_LICENSE_KEY` 环境变量，其值为你在 [Pro 授权管理面板](https://cloudreve.org/login) 获取到的授权密钥。

:::

::: details 我在启动容器时配置了数据库或 Redis，后续如何修改配置？

在容器启动时通过环境变量传入的配置项，后续无法再通过修改 `conf.ini` 文件来修改。你可以使用新的配置启动一个新的容器，只需要确保 `/cloudreve/data` 挂载到了与旧容器相同的目录即可。即保持 `-v ~/cloudreve/data:/cloudreve/data` 不变。

:::

::: details 如何更新 Cloudreve？

因为 Cloudreve 将所有配置和数据存放到了 `/cloudreve/data` Volume 中，我们只需要用新的镜像创建一个新的容器，并挂载相同的 Volume 即可。

```bash{9}
# 关闭当前运行的容器
docker stop cloudreve

# 删除当前运行的容器
docker rm cloudreve

# 使用新的镜像创建一个新的容器，并挂载相同的 Volume
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \ # 确保与上次启动时相同
    # 其他配置参数，与上次启动相同
    cloudreve/cloudreve:latest
```

你还需要参考 [更新 Cloudreve](./index) 页面，完成后续流程。

:::
