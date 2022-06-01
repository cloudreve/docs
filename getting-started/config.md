# 配置文件

## 配置文件

首次启动时，Cloudreve 会在同级目录下创建名为`conf.ini`的配置文件，你可以修改此文件进行一些参数的配置，保存后需要重新启动 Cloudreve 生效。

你也可以在启动时加入`-c`参数指定配置文件路径：

```
./cloudreve -c /path/to/conf.ini
```

一个完整的配置文件示例如下：

{% code title="conf.ini" %}
```ini
[System]
; 运行模式
Mode = master
; 监听端口
Listen = :5212
; 是否开启 Debug
Debug = false
; Session 密钥, 一般在首次启动时自动生成
SessionSecret = 23333
; Hash 加盐, 一般在首次启动时自动生成
HashIDSalt = something really hard to guss

; SSL 相关
[SSL]
; SSL 监听端口
Listen = :443
; 证书路径
CertPath = C:\Users\i\Documents\fullchain.pem
; 私钥路径
KeyPath = C:\Users\i\Documents\privkey.pem

; 启用 Unix Socket 监听
[UnixSocket]
Listen = /run/cloudreve/cloudreve.sock

; 数据库相关，如果你只想使用内置的 SQLite 数据库，这一部分直接删去即可
[Database]
; 数据库类型，目前支持 sqlite/mysql/mssql/postgres
Type = mysql
; MySQL 端口
Port = 3306
; 用户名
User = root
; 密码
Password = root
; 数据库地址
Host = 127.0.0.1
; 数据库名称
Name = v3
; 数据表前缀
TablePrefix = cd_
; 字符集
Charset = utf8mb4
; SQLite 数据库文件路径
DBFile = cloudreve.db

; 从机模式下的配置
[Slave]
; 通信密钥
Secret = 1234567891234567123456789123456712345678912345671234567891234567
; 回调请求超时时间 (s)
CallbackTimeout = 20
; 签名有效期
SignatureTTL = 60

; 跨域配置
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
AllowCredentials = false

; Redis 相关
[Redis]
Server = 127.0.0.1:6379
Password =
DB = 0

; 从机配置覆盖
[OptionOverwrite]
; 可直接使用 `设置名称 = 值` 的格式覆盖
max_worker_num = 50
```
{% endcode %}

## 配置案例

### 使用 MySQL

默认情况下，Cloudreve 会使用内置的 SQLite 数据库，并在同级目录创建数据库文件`cloudreve.db`，如果您想要使用 MySQL，请在配置文件中加入以下内容，并重启 Cloudreve。注意，Cloudreve 只支持大于或等于 5.7 版本的 MySQL 。

```ini
[Database]
; 数据库类型，目前支持 sqlite/mysql/mssql/postgres
Type = mysql
; MySQL 端口
Port = 3306
; 用户名
User = root
; 密码
Password = root
; 数据库地址
Host = 127.0.0.1
; 数据库名称
Name = v3
; 数据表前缀
TablePrefix = cd
; 字符集
Charset = utf8
```

{% hint style="info" %}
更换数据库配置后，Cloudreve 会重新初始化数据库，原有的数据将会丢失。
{% endhint %}

### 使用 Redis

你可以在配置文件中加入 Redis 相关设置：

```ini
[Redis]
Server = 127.0.0.1:6379
Password = your password
DB = 0
```

{% hint style="info" %}
请为 Cloudreve 指定未被其他业务使用的 DB，以避免冲突。
{% endhint %}

重启 Cloudreve 后，可注意控制台输出，确定 Cloudreve 是否成功连接 Redis 服务器。使用 Redis 后，以下内容将被 Redis 接管：

* 用户会话（重启 Cloudreve 后不会再丢失登录会话）
* 数据表高频记录查询缓存（如存储策略、设置项）
* 回调会话
* OneDrive 凭证

### 启用 HTTPS

{% hint style="info" %}
如果您正在使用 Web 服务器反向代理 Cloudreve，推荐您在 Web 服务器中配置 SSL，本小节所阐述的启用方式只针对使用 Cloudreve 内置 Web 服务器的情境下有效。
{% endhint %}

在配置文件中加入：

```ini
[SSL]
Listen = :443
CertPath = C:\Users\i\Documents\fullchain.pem
KeyPath = C:\Users\i\Documents\privkey.pem
```

其中 `CertPath` 和`KeyPath` 分别为 SSL 证书和私钥路径。保存后重启 Cloudreve 生效。

### 覆盖从机节点的配置项

Cloudreve 的某些配置项是存储在数据库中的，但是从机节点并不会连接数据库，你可以在配置文件中覆盖相应的配置项。

比如，从机节点作为存储端运行时，你可以通过下面的配置设定从机生成的缩略图规格：

```ini
[OptionOverwrite]
thumb_width = 400
thumb_height = 300
thumb_file_suffix = ._thumb
thumb_max_task_count = -1
thumb_encode_method = jpg
thumb_gc_after_gen = 0
thumb_encode_quality = 85
```

如果从机节点作为离线下载节点使用，你可以通过下面的配置覆盖默认的重试、超时参数，以避免默认的数值过于保守导致文件转存失败：

```ini
[OptionOverwrite]
; 任务队列最多并行执行的任务数
max_worker_num = 50
; 任务队列中转任务传输时，最大并行协程数
max_parallel_transfer = 10
; 中转分片上传失败后重试的最大次数
chunk_retries = 10
```
