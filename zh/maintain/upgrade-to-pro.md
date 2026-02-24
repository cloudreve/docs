# 升级到 Pro 版 {#upgrade-to-pro}

如果您之前使用社区版的 Cloudreve，在获取到捐助版后，您可以在保留数据的前提下升级到捐助版。

## 替换可执行文件 {#replace-main-program}

:::tabs

=== 直接部署

备份所有数据，将 Pro 版可执行文件替换到原先的社区版目录下。你好需要更新启动参数，Pro 版本启动时需要携带 `--license-key` 参数，传入你在授权管理面板获取的密钥。

=== Docker

参考 [获取镜像](../overview/deploy/docker#get-image) 登录容器仓库，将原有社区版镜像替换为 Pro 版镜，并通过环境变量传入许可密钥。比如：

```bash{3-4}
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \
    -e CR_LICENSE_KEY=你的授权密钥 \
    cloudreve.azurecr.io/cloudreve/pro:latest
```

=== Docker Compose

参考 [获取镜像](../overview/deploy/docker#get-image) 登录容器仓库。将授权密钥保存到 `.env` 文件中的 `CR_LICENSE_KEY`，然后使用 Pro 覆盖文件启动：

```bash
# 编辑 .env 文件，设置 CR_LICENSE_KEY=你的授权密钥

docker compose -f docker-compose.yml -f docker-compose.pro.yml up -d
```

:::

## 执行升级脚本 {#execute-upgrade-script}

:::tabs

=== 直接部署

执行下面的命令将数据库升级到 Pro 版：

```bash
./cloudreve proupgrade
```

=== Docker 或 Docker Compose

通过 `docker exec` 进入容器，执行下面的命令将数据库升级到 Pro 版：

```bash
docker exec -it <容器名> ./cloudreve proupgrade
```

:::

::: tip

你可以通过 `-c` 指定配置文件位置：

```bash
./cloudreve proupgrade -c data/conf.ini
```

:::

如果你使用的是 SQLite 数据库，用户组的存储策略设置会丢失，请在 Pro 版启动后前往后台重新设置。
