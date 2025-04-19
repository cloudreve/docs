# 使用 进程守护 部署 Cloudreve {#deploy-supervisor}

在这一部署模式中，Cloudreve 会直接运行在你的服务器上，并由进程守护工具（如 Supervisor）管理。

## 配置进程守护 {#configure-supervisor}

以下两种方式（Supervisor 和 Systemd）任选其一即可。

### 使用 Supervisor 部署 {#deploy-supervisor-supervisor}

安装 Supervisor：

```bash
sudo apt-get install supervisor
```

初始化 Supervisor 配置：

```bash
# 初始化全局配置文件
sudo echo_supervisord_conf > /etc/supervisor/supervisord.conf

# 打开全局配置文件
sudo nano /etc/supervisor/supervisord.conf
```

将文件底部的 `[include]` 分区注释符号 `;` 删除，加入新的配置文件包含路径：

```ini
[include]
files = /etc/supervisor/conf.d/*.conf
```

创建 Cloudreve 应用配置所在文件目录，并创建打开配置文件：

```bash
sudo mkdir -p /etc/supervisor/conf
sudo vim /etc/supervisor/conf/cloudreve.conf
```

根据需要填写以下内容并保存：

```ini
[program:cloudreve]
directory=/home/cloudreve ; Cloudreve 主程序所在目录
command=/home/cloudreve/cloudreve ; Cloudreve 主程序路径
autostart=true ; 是否自动启动
autorestart=true ; 是否自动重启
stderr_logfile=/var/log/cloudreve.err ; 错误日志文件路径
stdout_logfile=/var/log/cloudreve.log ; 日志文件路径
environment=
    CODENATION_ENV=prod,
    CR_LICENSE_KEY=你的授权密钥 ; Pro 版本授权密钥, 社区版可忽略
```

启动 Supervisor 服务和 Cloudreve 应用：

```bash
# 通过全局配置文件启动 supervisor：
supervisord -c /etc/supervisord.conf

# 启动 Cloudreve
sudo supervisorctl start cloudreve

# 停止 Cloudreve
sudo supervisorctl stop cloudreve

# 查看 Cloudreve
sudo supervisorctl status cloudreve
```

### 使用 Systemd 部署 {#deploy-supervisor-systemd}

为 Cloudreve 创建 Systemd 服务文件：

```bash
sudo vim /etc/systemd/system/cloudreve.service
```

根据需要填写以下内容并保存，其中 `PATH_TO_CLOUDREVE` 为 Cloudreve 主程序所在目录，`ExecStart` 为 Cloudreve 主程序路径。

```ini{9,10}
[Unit]
Description=Cloudreve
Documentation=https://docs.cloudreve.org
After=network.target
After=mysqld.service
Wants=network.target

[Service]
WorkingDirectory=/PATH_TO_CLOUDREVE
ExecStart=/PATH_TO_CLOUDREVE/cloudreve
Restart=on-abnormal
RestartSec=5s
KillMode=mixed

# Pro 版本授权密钥
Environment="CR_LICENSE_KEY=你的授权密钥"

# 日志输出
StandardOutput=/var/log/cloudreve.log
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

通过 Systemd 启动 Cloudreve：

```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudreve
sudo systemctl start cloudreve
```

日后管理 Cloudreve：

```bash
# 停止 Cloudreve
sudo systemctl stop cloudreve

# 启动 Cloudreve
sudo systemctl start cloudreve

# 重启 Cloudreve
sudo systemctl restart cloudreve

# 查看 Cloudreve 状态
sudo systemctl status cloudreve
```

## 配置数据库 {#configure-database}

在首次成功启动 Cloudreve 后，会在 `Cloudreve 主程序所在目录/data/conf.ini` 生成一份默认的配置文件，在此文件中中增加数据库配置：

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

修改配置文件后，需要重启 Cloudreve。

## 配置 Redis {#configure-redis}

在首次成功启动 Cloudreve 后，会在 `Cloudreve 主程序所在目录/data/conf.ini` 生成一份默认的配置文件，在此文件中中增加 Redis 配置：

```ini{5-8}
[System]
Mode = master
Listen = :5212

[Redis]
Server = 127.0.0.1:6379
Password = your_redis_password
DB = 0
```

其中可用的配置变量为：

| 设置名     | 说明                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Server`   | Redis 地址                                                                                                                                                                                             |
| `Password` | 连接密码                                                                                                                                                                                               |
| `DB`       | 数据库编号, 默认为 `0`                                                                                                                                                                                 |
| `Network`  | 网络类型，默认为`tcp`，可选 `tcp`, `tcp4` (IPv4-only), `tcp6` (IPv6-only), `udp`, `udp4` (IPv4-only), `udp6` (IPv6-only), `ip`, `ip4` (IPv4-only), `ip6` (IPv6-only), `unix`, `unixgram`, `unixpacket` |
| `User`     | Redis ACL 用户名                                                                                                                                                                                       |

修改配置文件后，需要重启 Cloudreve。

## 下一步 {#next-steps}

至此，Cloudreve 已经启动成功并监听 5212 端口，请继续前往 [后续步骤](./configure) 页面，完善你的部署。
