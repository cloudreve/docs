# 快速开始

## 获取 Cloudreve

你可以在 [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) 页面获取已经构建打包完成的主程序。其中每个版本都提供了常见系统架构下可用的主程序，命名规则为`cloudreve_版本号_操作系统_CPU架构.tar.gz` 。比如，普通 64 位 Linux 系统上部署 3.0.0 版本，则应该下载`cloudreve_3.0.0_linux_amd64.tar.gz`。

如果你想体验最新的功能特性，可以在 [GitHub Actions](https://github.com/cloudreve/Cloudreve/actions) 中下载每次 commit 后构建的开发版。注意，开发版并不稳定，无法用于生产用途，且不保证完全可用。

如果想要自行从源代码构建，请参阅以下章节：

{% content-ref url="build.md" %}
[build.md](build.md)
{% endcontent-ref %}

## 启动 Cloudreve

{% tabs %}
{% tab title="Linux" %}
Linux 下，直接解压并执行主程序即可：

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
Windows 下，直接解压获取到的 zip 压缩包，启动 `cloudreve.exe` 即可。
{% endtab %}
{% endtabs %}

Cloudreve 在首次启动时，会创建初始管理员账号，请注意保管管理员密码，此密码只会在首次启动时出现。如果您忘记初始管理员密码，需要删除同级目录下的`cloudreve.db`，重新启动主程序以初始化新的管理员账户。

Cloudreve 默认会监听`5212`端口。你可以在浏览器中访问`http://服务器IP:5212`进入 Cloudreve。

以上步骤操作完后，最简单的部署就完成了。你可能需要一些更为具体的配置，才能让 Cloudreve 更好的工作，具体流程请参考下面的配置流程。

## 可选部署流程

### 反向代理

在自用或者小规模使用的场景下，你完全可以使用 Cloudreve 内置的 Web 服务器。但是如果你需要使用 HTTPS，亦或是需要与服务器上其他 Web 服务共存时，你可能需要使用主流 Web 服务器反向代理 Cloudreve ，以获得更丰富的扩展功能。

你需要在 Web 服务器中新建一个虚拟主机，完成所需的各项配置（如启用 HTTPS），然后在网站配置文件中加入反代规则：

{% tabs %}
{% tab title="NGINX" %}
在网站的`server`字段中加入：

```
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

{% tab title="IIS" %}

#### 1. 安装 IIS URL Rewrite 和 ARR 模块

- URL Rewrite: [点击下载](https://www.iis.net/downloads/microsoft/url-rewrite#additionalDownloads)
- ARR: [点击下载](https://www.iis.net/downloads/microsoft/application-request-routing#additionalDownloads)

如已安装，请跳过本步。

#### 2. 启用并配置 ARR

打开 IIS，进入主页的 **Application Request Routing Cache**，再进入右边的 **Server Proxy Settings...**，勾选最上面的 **Enable proxy**，同时取消勾选下面的 **Reverse rewrite host in response headers**。点击右边的 应用 保存更改。

进入主页最下面的 **配置编辑器 (Configuration Editor)**，转到 `system.webServer/proxy` 节点，调整 **preserveHostHeader** 为 **True** 后点击右边的 应用 保存更改。

如果不取消勾选反向重写主机头，会导致 Cloudreve API 无法返回正确的地址，导致无法预览图片视频等。

#### 3. 配置反代规则

这是 `web.config` 文件的内容，将它放在目标网站根目录即可。此样例包括两个规则与一个限制：

- HTTP to HTTPS redirect (强制 HTTPS，需要自行配置 SSL 后才可使用，不使用请删除该 rule)
- Rerwite (反代)
- `requestLimits` 中的 `60000000` 为传输文件大小限制，单位 byte，如果您要使用本地存储策略请更改大小为理论最大文件尺寸

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="HTTP to HTTPS redirect" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
                        <add input="{HTTPS}" pattern="off" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:0}" redirectType="Permanent" />
                </rule>
                <rule name="Rerwite" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAny" trackAllCaptures="false">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="http://localhost:5212/{R:0}" />
                </rule>
            </rules>
        </rewrite>
        <security>
            <requestFiltering allowDoubleEscaping="true">
                <requestLimits maxAllowedContentLength="60000000" />
            </requestFiltering>
        </security>
    </system.webServer>
</configuration>
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
After=mysqld.service
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

- `directory`: Cloudreve 主程序所在目录
- `command`: Cloudreve 主程序绝对路径
- `stderr_logfile`: 错误日志路径
- `stdout_logfile`: 通常日志路径

通过全局配置文件启动 supervisor：

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

我们提供官方的 docker image，支持三种架构 `armv7`, `arm64` 以及 `amd64`, 你可以使用以下命令部署

### 创建目录结构

请**确保**运行之前：

> 1. 手动创建 `conf.ini` 空文件或者符合 Cloudreve 配置文件规范的 `conf.ini`, 并将 `<path_to_your_config> ` 替换为该路径
> 2. 手动创建 `cloudreve.db` 空文件, 并将 `<path_to_your_db> ` 替换为该路径
> 3. 手动创建 `uploads` 文件夹, 并将 `<path_to_your_uploads>` 替换为该路径
> 4. 手动创建 `avatar` 文件夹，并将 `<path_to_your_avatar>` 替换为该路径

或者，直接使用以下命令创建：

```bash
mkdir -vp cloudreve/{uploads,avatar} \
&& touch cloudreve/conf.ini \
&& touch cloudreve/cloudreve.db
```

### 运行

然后，运行 docker container:

```bash
docker run -d \
-p 5212:5212 \
--mount type=bind,source=<path_to_your_config>,target=/cloudreve/conf.ini \
--mount type=bind,source=<path_to_your_db>,target=/cloudreve/cloudreve.db \
-v <path_to_your_uploads>:/cloudreve/uploads \
-v <path_to_your_avatar>:/cloudreve/avatar \
cloudreve/cloudreve:latest
```

## Docker Compose

除此之外，我们还提供 `docker compose` 部署，并且整合了离线下载服务
在此之前，需要创建 `data` 目录作为离线下载临时中转目录

### 创建目录结构

```bash
mkdir -vp cloudreve/{uploads,avatar} \
&& touch cloudreve/conf.ini \
&& touch cloudreve/cloudreve.db \
&& mkdir -p aria2/config \
&& mkdir -p data/aria2 \
&& chmod -R 777 data/aria2
```

### 运行

然后将以下文件保存为 `docker-compose.yml`，放置于当前目录，与 cloudreve 同一层级，同时，修改文件中的 `RPC_SECRET`

```yml
version: "3.8"
services:
  cloudreve:
    container_name: cloudreve
    image: cloudreve/cloudreve:latest
    restart: unless-stopped
    ports:
      - "5212:5212"
    volumes:
      - temp_data:/data
      - ./cloudreve/uploads:/cloudreve/uploads
      - ./cloudreve/conf.ini:/cloudreve/conf.ini
      - ./cloudreve/cloudreve.db:/cloudreve/cloudreve.db
      - ./cloudreve/avatar:/cloudreve/avatar
    depends_on:
      - aria2
  aria2:
    container_name: aria2
    image: p3terx/aria2-pro
    restart: unless-stopped
    environment:
      - RPC_SECRET=your_aria_rpc_token
      - RPC_PORT=6800
    volumes:
      - ./aria2/config:/config
      - temp_data:/data
volumes:
  temp_data:
    driver: local
    driver_opts:
      type: none
      device: $PWD/data
      o: bind
```

运行镜像

```bash
docker-compose up -d
```

在之后的控制面板中，按照如下配置

1. **[不可修改]** RPC 服务器地址 => `http://aria2:6800`
2. **[可修改, 需保持和 docker-compose.yml 文件一致]** RPC 授权令牌 => `your_aria_rpc_token`
3. **[不可修改]** Aria2 用作临时下载目录的 节点上的绝对路径 => `/data`
