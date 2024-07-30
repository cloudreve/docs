# quick start

## Get Cloudreve

You can get the main program that has been built and packaged on the [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) page. Each version provides the main program available under the common system architecture, and the naming rule is `cloudreve_version number_operating system_CPU architecture.tar.gz`. For example, to deploy version 3.0.0 on an ordinary 64-bit Linux system, you should download `cloudreve_3.0.0_linux_amd64.tar.gz`.

If you want to experience the latest features, you can download the development version built after each commit in [GitHub Actions](https://github.com/cloudreve/Cloudreve/actions). Note that the development version is not stable, cannot be used for production use, and is not guaranteed to be fully usable.

If you want to build from source yourself, see the following sections:

{% content-ref url="build.md" %}
[build.md](build.md)
{% endcontent-ref %}

## Start Cloudreve

{% tabs %}
{% tab title="Linux" %}
Under Linux, just decompress and execute the main program directly:

```bash
#Unzip the obtained main program
tar -zxvf cloudreve_VERSION_OS_ARCH.tar.gz

# Give execute permission
chmod +x ./cloudreve

# start Cloudreve
./cloudreve
```

{% endtab %}

{% tab title="Windows" %}
Under Windows, directly decompress the obtained zip archive and start `cloudreve.exe`.
{% endtab %}
{% endtabs %}

When Cloudreve starts for the first time, it will create an initial administrator account. Please keep the administrator password safe, this password will only appear when it is started for the first time. If you forget the initial administrator password, you need to delete `cloudreve.db` in the same directory and restart the main program to initialize a new administrator account.

Cloudreve listens on `5212` port by default. You can access `http://serverIP:5212` in your browser to enter Cloudreve.

After the above steps are completed, the simplest deployment is completed. You may need some more specific configurations to make Cloudreve work better. Please refer to the configuration process below for specific procedures.

## Optional deployment process

### reverse proxy

In the scenario of self-use or small-scale use, you can use Cloudreve's built-in web server. But if you need to use HTTPS, or need to coexist with other web services on the server, you may need to use the mainstream web server reverse proxy Cloudreve to get richer extensions.

You need to create a new virtual host in the web server, complete the required configurations (such as enabling HTTPS), and then add anti-generation rules to the website configuration file:

{% tabs %}
{% tab title="NGINX" %}
In the `server` field of the website add:

```
location / {
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header Host $http_host;
     proxy_redirect off;
     proxy_pass http://127.0.0.1:5212;

     # If you want to use the local storage strategy, please delete the comment on the next line and change the size to the theoretical maximum file size
     # client_max_body_size 20000m;
}
```

{% endtab %}

{% tab title="Apache" %}
Add the anti-generation configuration item `ProxyPass` under the `VirtualHost` field, for example:

```markup
<VirtualHost *:80>
     ServerName myapp.example.com
     ServerAdmin webmaster@example.com
     DocumentRoot /www/myapp/public

     # The following are the key parts
     AllowEncodedSlashes NoDecode
     ProxyPass "/" "http://127.0.0.1:5212/" nocanon

</VirtualHost>
```

{% endtab %}

{% tab title="IIS" %}

#### 1. Install IIS URL Rewrite and ARR modules

- URL Rewrite: [Click to download](https://www.iis.net/downloads/microsoft/url-rewrite#additionalDownloads)
- ARR: [Click to download](https://www.iis.net/downloads/microsoft/application-request-routing#additionalDownloads)

If it is already installed, please skip this step.

#### 2. Enable and configure ARR

Open IIS, enter **Application Request Routing Cache** on the home page, then enter **Server Proxy Settings...** on the right, check **Enable proxy** on the top, and uncheck the ** below Reverse rewrite host in response headers**. Click Apply on the right to save the changes.

Enter **Configuration Editor** at the bottom of the home page, go to `system.webServer/proxy` node, adjust **preserveHostHeader** to **True** and click Apply on the right to save the changes.

If you do not uncheck the reverse rewrite host header, the Cloudreve API will not be able to return the correct address, resulting in the inability to preview pictures and videos.

#### 3. Configure anti-generation rules

This is the content of the `web.config` file, just place it in the root directory of the target website. This example includes two rules and one restriction:

- HTTP to HTTPS redirect (mandatory HTTPS, you need to configure SSL before you can use it, please delete this rule if you don’t use it)
- Rerwite (reverse generation)
- `60000000` in `requestLimits` is the transfer file size limit, the unit is byte, if you want to use the local storage strategy, please change the size to the theoretical maximum file size

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
     <system. webServer>
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
     </system. webServer>
</configuration>
```

{% endtab %}
{% endtabs %}

### Process daemon

You can choose one of the following two ways.

#### Systemd

```bash
# edit configuration file
vim /usr/lib/systemd/system/cloudreve.service
```

Replace `PATH_TO_CLOUDREVE` below with the directory where the program is located:

```bash
[Unit]
Description=Cloudreve
Documentation=https://docs.cloudreve.org
After=network.target
After=mysqld.service
Wants=network.target

[Service]
Working Directory=/PATH_TO_CLOUDREVE
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
# update configuration
systemctl daemon-reload

# start the service
systemctl start cloudreve

# set boot
systemctl enable cloudreve
```

Management commands:

```bash
# start the service
systemctl start cloudreve

# Out of service
systemctl stop cloudreve

# restart service
systemctl restart cloudreve

# check status
systemctl status cloudreve
```

#### Supervisor

First install `supervisor`, you can skip the ones already installed.

```bash
# install supervisor
sudo yum install python-setuptools
sudo easy_install supervisor

# Initialize the global configuration file
sudo touch /etc/supervisord.conf
sudo echo_supervisord_conf > /etc/supervisord.conf
```

Edit the global configuration file:

```bash
sudo vim /etc/supervisord.conf
```

Delete the `[include]` partition comment symbol `;` at the bottom of the file, and add a new configuration file to include the path:

```bash
[include]
files = /etc/supervisor/conf/*.conf
```

Create the file directory where the Cloudreve application configuration is located, and create an open configuration file:

```bash
sudo mkdir -p /etc/supervisor/conf
sudo vim /etc/supervisor/conf/cloudreve.conf
```

Fill in the following content according to the actual situation and save:

```bash
[program: cloudreve]
directory=/home/cloudreve
command=/home/cloudreve/cloudreve
autostart=true
autorestart=true
stderr_logfile=/var/log/cloudreve.err
stdout_logfile=/var/log/cloudreve.log
environment=CODENATION_ENV=prod
```

The following configuration items need to be changed according to the actual situation:

- `directory`: The directory where the Cloudreve main program is located
- `command`: absolute path of Cloudreve main program
- `stderr_logfile`: error log path
- `stdout_logfile`: usual log path

Start supervisor via the global configuration file:

```bash
supervisord -c /etc/supervisord.conf
```

In the future you can manage the Cloudreve process with the following commands:

```bash
# start up
sudo supervisorctl start cloudreve

# stop
sudo supervisorctl stop cloudreve

# check status
sudo supervisorctl status cloudreve
```

## Docker
> Before using, please make sure you know the working mechanism of docker. In general, the above deployment process can already cover most usage scenarios.

We provide official docker image, which supports three architectures `armv7`, `arm64` and `amd64`, you can use the following command to deploy

### Create directory structure

Please **make sure** before running:

> 1. Manually create an empty `conf.ini` file or a `conf.ini` that conforms to the Cloudreve configuration file specification, and replace `<path_to_your_config>` with the path
> 2. Manually create `cloudreve.db` empty file and replace `<path_to_your_db>` with this path
> 3. Manually create `uploads` folder and replace `<path_to_your_uploads>` with the path
> 4. Manually create the `avatar` folder and replace `<path_to_your_avatar>` with the path

Alternatively, create it directly with the following command:

```bash
mkdir -vp cloudreve/{uploads,avatar} \
&& touch cloudreve/conf.ini \
&& touch cloudreve/cloudreve.db
```

### run

Then, run the docker container:

```bash
docker run -d \
-p 5212:5212 \
--mount type=bind,source=<path_to_your_config>,target=/cloudreve/conf.ini\
--mount type=bind,source=<path_to_your_db>,target=/cloudreve/cloudreve.db\
-v <path_to_your_uploads>:/cloudreve/uploads\
-v <path_to_your_avatar>:/cloudreve/avatar \
cloudreve/cloudreve:latest
```

## Docker Compose

In addition, we also provide `docker compose` deployment and integrate offline download service
Before that, you need to create a `data` directory as a temporary staging directory for offline downloads

### Create directory structure

```bash
mkdir -vp cloudreve/{uploads,avatar} \
&& touch cloudreve/conf.ini \
&& touch cloudreve/cloudreve.db\
&& mkdir -p aria2/config \
&& mkdir -p data/aria2 \
&& chmod -R 777 data/aria2
```

### run

Then save the following file as `docker-compose.yml`, place it in the current directory, at the same level as cloudreve, and modify `RPC_SECRET` in the file

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
       -RPC_SECRET=your_aria_rpc_token
       -RPC_PORT=6800
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

run mirror

```bash
# Background operation mode, you can get the default administrator account username and password from the docker/docker-compose log
docker-compose up -d

# Or, run it directly, the log will be output directly in the current console, please note that the current container is running after exiting
docker-compose up
```

In the subsequent control panel, configure as follows

1. **[Unmodifiable]** RPC server address => `http://aria2:6800`
2. **[Can be modified, must be consistent with the docker-compose.yml file]** RPC authorization token => `your_aria_rpc_token`
3. **[Unmodifiable]** Absolute path on the node where Aria2 is used as temporary download directory => `/data`

### renew

Close the currently running container, this step will not delete the mounted configuration files and related directories
```bash
docker-compose down
```

If the docker image has been pulled before, use the following command to get the latest image
```bash
docker pull cloudreve/cloudreve
```

Just repeat the steps
