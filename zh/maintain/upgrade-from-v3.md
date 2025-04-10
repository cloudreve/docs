# 从 V3.x.x 升级 {#upgrade-from-v3}

::: warning 警告

当前升级工具仍处于测试阶段，请在操作前做好备份，并做好因升级失败而回退到原始版本的准备。

:::

当你从 V3.x.x 升级到 V4.0.x 时，下列数据会丢失：

- 离线下载和其他后台任务记录；
- 订单记录；
- 举报记录；
- 用户自定义侧边栏；
- 用户绑定的外部验证器；
- 主题色配置；
- 非本机存储策略代理生成的缩略图；
- 其他在 V4 中不再支持的配置项。

升级后，V3 的分享链接和直链仍然有效。

## 1. 准备 {#prepare}

### 检查当前版本 {#check-current-version}

V3 到 V4 的升级工具基于 Cloudreve V3.8.x 版本开发，其他更老版本未进行过测试，推荐先将 Cloudreve 升级到 V3.8.x 再进行到 V4 的升级。

### 关闭站点 {#close-site}

请先关闭当前站点和 Cloudreve V3 进程，避免数据库中写入新的数据。

### 备份数据库 {#backup-database}

请先备份现有版本的数据库。你可以使用诸如 [`mysqldump`](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) 一类的第三方工具来创建数据库备份。对于 SQLite 数据库，你可以直接备份 `cloudreve.db` 文件。

升级工具只会读取 V3 数据库并转换为 V4 格式，不会修改 V3 数据库中的数据，但仍有可能因为操作失误或程序缺陷导致 V3 数据库损坏，请做好备份后再进行后续操作。

### 备份配置文件 {#backup-config-file}

请备份现有 V3 版本的配置文件 `conf.ini`。

## 2. 转换数据库 {#convert-database}

### 2.1 获取 V4 主程序 {#get-v4-executable}

参考 [快速开始](../overview/quickstart) 获取 V4.0.x 版本的主程序。将其命名为 `cloudreve_v4` 并放置到与当前 `cloudreve` 相同的目录下。

::: warning 警告

在 V4 后续版本中，此升级工具会被移除。请先升级到 V4.0.x 版本，再进行后续升级。

:::

```bash
# 将当前 Cloudreve V3 可执行文件重命名为 cloudreve_v3
mv cloudreve cloudreve_v3

# 将 V4 主程序重命名为 cloudreve
mv cloudreve_v4 cloudreve

# 创建 data 目录，用于存放 V4 的配置文件和数据
mkdir data
```

### 2.2 准备 V4 配置文件和数据库 {#prepare-v4-config-and-database}

参考 [配置文件](../overview/configure) 准备一份 V4 使用的配置文件 `conf.ini`, 将其放置到上一步创建的 `data` 目录下。在 V4 配置文件中，请在 `Database` 配置项中为 V4 指定数据库连接信息，请创建一个新的数据库，与 V3 区分开来。

你也可以直接复制 V3 的配置文件 `conf.ini` 到 `data` 目录下，并修改其中的数据库连接信息，将 `Database` 配置项中的 `Name` 修改为 V4 数据库的名称，或者通过 `DBFile` 配置项指定一个新的 SQLite 数据库文件的位置。

::: tip
在 V4 中，不再支持指定数据表前缀 `TablePrefix` 配置项，所以在这里推荐为 V4 指定一个新的数据库，与 V3 区分开来。
:::

```bash
# 将 V3 的配置文件 `conf.ini` 复制到上一步创建的 data 目录下
cp conf.ini data/conf.ini

# 修改 V4 配置文件中的数据库连接信息
# 请创建一个新的数据库，与 V3 区分开来
nano data/conf.ini
```

### 2.3 运行升级工具 {#run-upgrade-tool}

```bash
# 运行升级工具
./cloudreve migrate --v3-conf conf.ini -c data/conf.ini
```

通过 `-c` 参数指定 V4 的配置文件路径，通过 `--v3-conf` 参数指定 V3 的配置文件路径。升级工具会读取 V3 数据库中的数据，并转换为 V4 格式，写入到 V4 数据库中。

根据数据量的不同，升级工具需要运行数分钟到数小时不等。

## 3. 启动 V4 {#start-v4-site}

升级工具运行完成后，你就可以启动 V4 站点了。

```bash
# 启动 V4
./cloudreve
```

## 4. 后续步骤

1. 如果你在升级完成后，访问站点仍然是 V3 的页面，请删除浏览器缓存，并确保没有使用自定义前端。
2. 在检查 V4 站点正常运行后，V3 所使用的数据库数据可以删除。

## 常见问题 {#common-issues}

::: details 升级过程中异常中断，如何重试？

直接重新执行升级工具即可。Cloudreve 会把升级进度保存到 `migration_state.json` 文件中，再次启动时会从上次中断的位置继续执行。如果你需要从头开始重新升级：

1. 删除 V4 数据库中已经生成的所有数据表和数据；
2. 删除 `migration_state.json` 文件，或者使用 `--force-reset` 参数重新开始升级。

:::

::: details 升级报错 `hash ID salt is not set, please set it from v3 conf file`

请检查 V3 的配置文件 `conf.ini` 中是否配置了 `HashIDSalt` 配置项，这一配置影响所有分享链接和中转直链。默认情况下，V3 启动时会在配置文件自动生成并填写此值，但你可能手动删去了此值。解决办法是：

1. 在 V3 的配置文件 `conf.ini` 的 `[System]` 配置项中添加 `HashIDSalt` 配置项，并填写一个随机值；
2. 重试升级程序.
3. 升级完成后，V3 的分享链接和直链会全部失效，如果你想避免这种情况，请手动前往数据库下 `settings` 表，将 `hash_id_salt` 字段设置为空字符串。

:::
