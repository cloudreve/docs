# 配置 {#configure}

Cloudreve 的配置分为两部份存储：配置文件中存放的程序运行关键配置，数据库中存放其他应用层面配置。本页主要介绍配置文件的结构。

Cloudreve 的默认配置文件为 `data/config.ini`，你可以在启动 Cloudreve 时通过命令行参数传入配置文件路径：

```bash
./cloudreve -c /path/to/config.ini
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
; 呈递客户端 IP 时使用的 Header，默认为 X-Forwarded-For
ProxyHeader = X-Forwarded-For
; 进程安全退出的最长缓冲时间，默认为 0，不限制
GracePeriod = 0
; 日志级别，可选值为 debug/info/warning/error，默认为 info
LogLevel = info

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
; 数据库类型，目前支持 sqlite/mysql/postgres，默认为 sqlite
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
; 使用 Unix Socket 连接到数据库, 默认为 false，如需开启，请在 Host 中指定 Unix Socket 路径
UnixSocket = false

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
