# 快速开始

## 获取 Cloudreve

你可以在 [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) 页面获取已经构建打包完成的主程序。其中每个版本都提供了常见系统架构下可用的主程序，命名规则为`cloudreve_版本号_操作系统_CPU架构.tar.gz` 。比如，普通64位Linux系统上部署3.0.0版本，则应该下载`cloudreve_3.0.0_linux_amd64.tar.gz`。

如果你想体验最新的功能特性，可以在 [GitHub Actions](https://github.com/cloudreve/Cloudreve/actions) 中下载每次 commit 后构建的开发版。注意，开发版并不稳定，无法用于生产用途，且不保证完全可用。

如果想要自行从源代码构建，请参阅以下章节：

{% page-ref page="build.md" %}

## 启动 Cloudreve

{% tabs %}
{% tab title="Linux" %}
Linux下，直接解压并执行主程序即可：

```bash
#解压获取到的主程序
tar -zxvf cloudreve_VERSION_OS_ARCH.tar.gz

# 赋予执行权限
chmod +x ./cloudreve

# 启动 Cloudreve
./cloudreve
```
{% endtab %}

{% tab title="Windows" %}
Windows下，直接解压获取到的 zip 压缩包，启动 `cloudreve.exe` 即可。
{% endtab %}
{% endtabs %}

Cloudreve 在首次启动时，会创建初始管理员账号，请注意保管管理员密码，此密码只会在首次启动时出现。如果您忘记初始管理员密码，需要删除同级目录下的`cloudreve.db`，重新启动主程序以初始化新的管理员账户。

Cloudreve 默认会监听`5212`端口。你可以在浏览器中访问`http://服务器IP:5212`进入 Cloudreve。

以上步骤操作完后，最简单的部署就完成了。你可能需要一些更为具体的配置，才能让Cloudreve更好的工作，具体流程请参考下面的配置流程。

## 可选部署流程

### 反向代理

在自用或者小规模使用的场景下，你完全可以使用 Cloudreve 内置的 Web 服务器。但是如果你需要使用HTTPS，亦或是需要与服务器上其他 Web 服务共存时，你可能需要使用主流 Web 服务器反向代理 Cloudreve ，以获得更丰富的扩展功能。

你需要在Web服务器中新建一个虚拟主机，完成所需的各项配置（如启用HTTPS），然后在网站配置文件中加入反代规则：

{% tabs %}
{% tab title="NGINX" %}
在网站的`server`字段中加入：

```text
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://127.0.0.1:5212;

    # 如果您要使用本地存储策略，请将下一行注释符删除，并更改大小为理论最大文件尺寸
    # client_max_body_size 20000m;
}
```
{% endtab %}

{% tab title="Apache" %}
在`VirtualHost`字段下加入反代配置项`ProxyPass`，比如：

```markup
<VirtualHost *:80>
    ServerName myapp.example.com
    ServerAdmin webmaster@example.com
    DocumentRoot /www/myapp/public

    # 以下为关键部分
    AllowEncodedSlashes NoDecode
    ProxyPass "/" "http://127.0.0.1:5212/" nocanon

</VirtualHost>
```
{% endtab %}
{% endtabs %}

### 进程守护

以下两种方式可任选其一。

#### Systemd

```bash
# 编辑配置文件
vim /usr/lib/systemd/system/cloudreve.service
```

将下文 `PATH_TO_CLOUDREVE` 更换为程序所在目录：

```bash
[Unit]
Description=Cloudreve
Documentation=https://docs.cloudreve.org
After=network.target
Wants=network.target

[Service]
WorkingDirectory=/PATH_TO_CLOUDREVE
ExecStart=/PATH_TO_CLOUDREVE/cloudreve
Restart=on-abnormal
RestartSec=5s
KillMode=mixed

StandardOutput=null
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

```bash
# 更新配置
systemctl daemon-reload

# 启动服务
systemctl start cloudreve

# 设置开机启动
systemctl enable cloudreve
```

管理命令：

```bash
# 启动服务
systemctl start cloudreve

# 停止服务
systemctl stop cloudreve

# 重启服务
systemctl restart cloudreve

# 查看状态
systemctl status cloudreve
```

#### Supervisor

首先安装`supervisor`，已安装的可以跳过。

```bash
# 安装 supervisor
sudo yum install python-setuptools
sudo easy_install supervisor

# 初始化全局配置文件
sudo touch /etc/supervisord.conf
sudo echo_supervisord_conf > /etc/supervisord.conf
```

编辑全局配置文件：

```bash
sudo vim /etc/supervisord.conf
```

将文件底部的`[include]` 分区注释符号`;`删除，加入新的配置文件包含路径：

```bash
[include]
files = /etc/supervisor/conf/*.conf
```

创建 Cloudreve 应用配置所在文件目录，并创建打开配置文件：

```bash
sudo mkdir -p /etc/supervisor/conf
sudo vim /etc/supervisor/conf/cloudreve.conf
```

根据实际情况填写以下内容并保存：

```bash
[program:cloudreve]
directory=/home/cloudreve
command=/home/cloudreve/cloudreve
autostart=true
autorestart=true
stderr_logfile=/var/log/cloudreve.err
stdout_logfile=/var/log/cloudreve.log
environment=CODENATION_ENV=prod
```

其中以下配置项需要根据实际情况更改：

* `directory`: Clopudreve 主程序所在目录
* `command`: Cloudreve 主程序绝对路径
* `stderr_logfile`: 错误日志路径
* `stdout_logfile`: 通常日志路径

通过全局配置文件启动supervisor：

```bash
supervisord -c /etc/supervisord.conf
```

日后你可以通过以下指令管理 Cloudreve 进程：

```bash
# 启动
sudo supervisorctl start cloudreve

# 停止
sudo supervisorctl stop cloudreve

# 查看状态
sudo supervisorctl status cloudreve
```

## Docker

你可以选择使用以下镜像部署：

* [xavierniu/cloudreve](https://hub.docker.com/r/xavierniu/cloudreve)
* [littleplus/Cloudreve-Docker](https://github.com/littleplus/Cloudreve-Docker)
* [awesome-builder/Cloudreve](https://github.com/EscapeLife/awesome-builder/blob/master/dockerfiles/cloudreve/README.md)

