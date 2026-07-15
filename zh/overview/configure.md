# 配置 {#configure}

Cloudreve 的配置分为两部份存储：配置文件中存放的程序运行关键配置，数据库中存放其他应用层面配置。本页主要介绍配置文件的结构。

Cloudreve 的默认配置文件为 `data/conf.ini`，你可以在启动 Cloudreve 时通过命令行参数传入配置文件路径：

```bash
./cloudreve -c /path/to/conf.ini
```

## 配置文件结构 {#config-file-structure}

Cloudreve 的配置文件结构如下：

```ini
[System]
; 运行模式，可选值为 master/slave
Mode = master
; HTTP 监听端口，默认为 5212
Listen = :5212
; 是否开启 Debug 模式，默认为 false
Debug = false
; 呈递客户端 IP 时使用的 Header，默认为空。如果该 Header 由多个使用 `,` 分隔的 IP 构成，Cloudreve 会取用首个作为客户端 IP
; 对于配置反向代理的部署，可以取值为 X-Forwarded-For。但是，请注意，由于潜在的 XFF 注入问题，仅在确认可信的情况下使用
ProxyHeader =
; 进程安全退出的最长缓冲时间，默认为 0，不限制
GracePeriod = 0
; 日志级别，可选值为 debug/info/warning/error，默认为 info
LogLevel = info
; 监听 pprof 的地址，如 "localhost:6060"。留空禁用。更多信息请参考 https://pkg.go.dev/net/http/pprof
Pprof =

; SSL 相关
[SSL]
; SSL 监听端口，默认为 443
Listen = :443
; 证书路径，默认为空
CertPath =
; 私钥路径，默认为空
KeyPath =

; 启用 Unix Socket 监听
[UnixSocket]
; Unix Socket 监听路径，默认为空
Listen = /run/cloudreve/cloudreve.sock
; 设置产生的 socket 文件的权限，默认为空
Perm = 0666

; 数据库相关，如果你只想使用内置的 SQLite 数据库，这一部分直接删去即可
[Database]
; 数据库类型，目前支持 sqlite/mysql/postgres/mariadb，默认为 sqlite
Type = sqlite
; 数据库端口，默认为 3306
Port = 3306
; 用户名，默认为空
User =
; 密码，默认为空
Password =
; 数据库地址，默认为空
Host = 127.0.0.1
; 数据库名称，默认为空
Name = cloudreve
; 连接字符集，默认为 utf8mb4
Charset = utf8mb4
; SQLite 数据库文件路径，默认为 data/cloudreve.db
DBFile = cloudreve.db
; 使用 Unix Socket 连接到数据库，默认为 false，如需开启，请在 Host 中指定 Unix Socket 路径
UnixSocket = false
; 数据库连接字符串，如果设置，其他数据库配置将忽略，但 Type 仍需设置。
; 例如：root:123456@tcp(127.0.0.1:3306)/cloudreve?charset=utf8mb4&parseTime=True&loc=Local 用于 MySQL。
DatabaseURL =

; 从机模式下的配置
[Slave]
; 通信密钥，默认为空
Secret =
; 回调请求超时时间 (s)，默认为 20
CallbackTimeout = 20
; 签名有效期 (s)，默认为 600
SignatureTTL = 600

; 跨域配置
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
AllowCredentials = false

; Redis 相关
[Redis]
; 连接类型，默认为 tcp
Network = tcp
; 服务器地址，默认为空，不启用
Server = 127.0.0.1:6379
; 密码，默认为空
Password =
; 数据库，默认为 0
DB = 0
; 用户名，默认为空
User =
; 是否使用 TLS 连接到 Redis，默认为 false
UseTLS = false
; 是否跳过 TLS 验证，默认为 false
TLSSkipVerify = false

; 从机配置应用配置覆盖
[OptionOverwrite]
; 可直接使用 `设置名称 = 值` 的格式覆盖
queue_slave_worker_num = 50
```

::: tip
如果你的配置值中包含 `#` 或者 `;`，其之后的字符会被视为注释，不会生效。你可以使用 `` ` ``包裹设置值，比如：

```ini
Password = `#123456`
```

:::

## 使用环境变量覆盖配置 {#override-config-env}

配置文件中的任意值都可以通过以 `CR_CONF_` 为前缀的环境变量覆盖。在容器化部署等不便于挂载配置文件的场景下尤其实用。

默认格式为 `CR_CONF_<Section>.<Key>=<Value>`，其中 `<Section>` 和 `<Key>` 分别对应配置文件中的分区名和配置键名。例如：

```bash
CR_CONF_System.Listen=:8080
CR_CONF_Database.Type=mysql
CR_CONF_Database.Host=127.0.0.1
CR_CONF_Redis.Server=127.0.0.1:6379
```

覆盖值会在启动时与配置文件合并，并优先于 `conf.ini` 中的值生效。

### 兼容 TOML 的分隔符 {#toml-safe-separator}

部分部署平台会把环境变量名中的 `.` 解析为嵌套键路径（例如 Fly.io 的 `fly.toml` `[env]` 段落，或部分较旧的 Docker Compose YAML 写法），导致点号形式的变量要么被拒收，要么在到达 Cloudreve 进程前就被静默丢弃。

为此，Cloudreve 也接受 `__`（双下划线）作为等价的分隔符：

```toml
# fly.toml
[env]
  CR_CONF_System__Listen = ":8080"
  CR_CONF_Database__Type = "mysql"
```

`CR_CONF_System.Listen` 与 `CR_CONF_System__Listen` 会解析为同一项设置。格式不合法的条目（缺少分区/键分隔符，或分区名/键名为空）会以警告日志跳过，不会导致启动失败。



在使用容器部署时，配置文件位于容器内的 `/cloudreve/data/conf.ini`，你可以在宿主机对应挂载目录下找到此文件。如果你不确定具体路径，请在宿主机执行：

```bash
## 列出容器，找到 Cloudreve 的容器 ID
docker container ls | grep cloudreve

# 输出示例：
# aaronliu@AarondeMacBook-Pro ~ % docker container ls | grep cloudreve
# 43acd4c97d4b   cloudreve/cloudreve:latest   "sh ./entrypoint.sh"     About a minute ago   Up About a minute   443/tcp, 0.0.0.0:5212->5212/tcp, :::5212->5212/tcp     cloudreve

# 查看容器挂载信息
docker inspect --format="{{.Mounts}}" <容器ID>

# 比如：
docker inspect --format="{{.Mounts}}" 43acd4c97d4b

# 输出示例：
# aaronliu@AarondeMacBook-Pro ~ % docker inspect --format="{{.Mounts}}" 43acd4c97d4b
# [{volume cloudreve_backend_data /var/lib/docker/volumes/cloudreve_backend_data/_data /cloudreve/data local rw true }]
```

在以上示例中，你可以在宿主机的 `/var/lib/docker/volumes/cloudreve_backend_data/_data` 目录下找到配置文件。修改配置文件后，重启容器即可生效。

## Debug 模式 {#debug-mode}

你可以通过设置 `Debug` 为 `true` 来开启 Debug 模式，开启后，Cloudreve 会记录更多的日志信息，方便你进行问题排查。

```ini{4}
[System]
Mode = master
Listen = :5212
Debug = true
```

在 Debug 模式下：

- 日志级别强制为 `debug`，无论你在配置文件中如何设置；
- 启动时打印所有可用路由；
- 所有数据库查询都会打印详细的日志信息，注意，这可能包含部分敏感信息。
- 针对用户展示的报错提示会包含原始错误信息。

## 从机节点配置覆盖 {#slave-node-configuration-override}

从机节点可以覆盖主机的配置，你可以在从机节点的配置文件中使用 `[OptionOverwrite]` 段落来覆盖主机的配置，比如，修改从机任务队列的配置：

```ini
[OptionOverwrite]
; 最大 Worker 数量
queue_slave_worker_num = 15
; 最大执行时间 (s)
queue_slave_max_execution = 2800
; 重试因子
queue_slave_backoff_factor = 4
; 最大重试等待时间 (s)
queue_slave_backoff_max_duration = 3600
; 最大重试次数
queue_slave_max_retry = 5
; 重试延迟 (s)
queue_slave_retry_delay = 5
```
