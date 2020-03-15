# 配置文件

## 配置文件

首次启动时，Cloudreve 会在同级目录下创建名为`conf.ini`的配置文件，你可以修改此文件进行一些参数的配置，保存后需要重新启动 Cloudreve 生效。

你也可以在启动时加入`-c`参数指定配置文件路径：

```text
./cloudreve -c /path/to/conf.ini
```

一个完整的配置文件示例如下：

```text
[System]
; 运行模式
Mode = master
; 监听端口
Listen = :5000
; 是否开启 Debug
Debug = false
; Session 密钥, 一般在首次启动时自动生成
SessionSecret = 23333
; Hash 加盐, 一般在首次启动时自动生成
HashIDSalt = something really hard to guss

; 数据库相关，如果你只想使用内置的 SQLite数据库，这一部分直接删去即可
[Database]
; 数据库类型，目前支持 sqlite | mysql
Type = mysql
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

; 从机模式缩略图
[Thumbnail]
MaxWidth = 400
MaxHeight = 300
FileSuffix = ._thumb
```

## 使用 MySQL

默认情况下，Cloudreve 会使用内置的 SQLite 数据库，并在同级目录创建数据库文件`cloudreve.db`，如果您想要使用 MySQL，请在配置文件中加入以下内容，并重启 Cloudreve。

```text
[Database]
; 数据库类型，目前支持 sqlite | mysql
Type = mysql
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
```

{% hint style="info" %}
更换数据库配置后，Cloudreve 会重新初始化数据库，原有的数据将会丢失。
{% endhint %}

## 使用 Redis

你可以在配置文件中加入 Redis 相关设置：

```text
[Redis]
Server = 127.0.0.1:6379
Password = your password
DB = 0
```

{% hint style="info" %}
请为 Cloudreve 指定未被其他业务使用的 DB，以避免冲突。
{% endhint %}

重启 Cloudreve 后，可注意控制台输出，确定 Cloudreve 是否成功连接 Redis 服务器。使用 Redis 后，以下内容将被 Redis 接管：

* 用户会话（重启Cloudreve后不会再丢失登录会话）
* 数据表高频记录查询缓存（如存储策略、设置项）
* 回调会话
* OneDrive 凭证



