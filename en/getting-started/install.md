# Quick Start

## Get Cloudreve

You can get the packaged master on the [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) page. Each of these releases provides the main program available on common system architectures with the naming convention `cloudreve_version_number_OS_CPU_architecture.tar.gz` . For example, to deploy version 3.0.0 on a common 64-bit Linux system, you should download `cloudreve_3.0.0_linux_amd64.tar.gz`.

If you want to experience the latest features, you can download the development version built after each commit in [GitHub Actions](https://github.com/cloudreve/Cloudreve/actions). Note that development builds are not stable, cannot be used in production, and are not guaranteed to be fully available.

If you want to build from source yourself, see the following sections.

{% page-ref page="build.md" %}

## Start Cloudreve

{% tabs %}
{% tab title="Linux" %}
On Linux, just unpack and execute the main program directly as follows.

```bash
## Unzip the main program you got
tar -zxvf cloudreve_VERSION_OS_ARCH.tar.gz

# Give execute permission
chmod +x . /cloudreve

# Start Cloudreve
. /cloudreve
```
{% endtab %}

{% tab title="Windows" %}
On Windows, unzip the zip archive and start `cloudreve.exe`.
{% endtab %}
{% endtabs %}

When Cloudreve is first started, an initial administrator account will be created. Please keep the administrator password, which will only appear on first startup. If you forget the initial administrator password, you will need to delete `cloudreve.db` from the same directory and restart the main application to initialize a new administrator account.

Cloudreve will listen on port `5212` by default. You can access Cloudreve by visiting `http://ServerIP:5212` in your browser.

After the above steps, the simplest deployment is complete. You may need some more specific configuration to make Cloudreve work better, please refer to the following configuration process.

## Optional Deployment Process

### Reverse Proxy

In a self-use or small-scale usage scenario, you can absolutely use Cloudreve's built-in web server. However, if you need to use HTTPS or need it to coexist with other web services on the server, you may need to use a mainstream web server to reverse proxy Cloudreve for richer extensions.

You need to create a new virtual host on your web server, complete the required configuration (e.g. enable HTTPS) and then add the reverse proxy rules to your website configuration file:

{% tabs %}
{% tab title="NGINX" %}
In the `server` field of the site add.

```text
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://127.0.0.1:5212;

    # If you want to use the local storage policy, remove the comment character from the next line and change the size to the theoretical maximum file size
    # client_max_body_size 20000m;
}
```
{% endtab %}

{% tab title="Apache" %}
Add the reverse proxy configuration item `ProxyPass` under the `VirtualHost` field, e.g.

```markup
<VirtualHost *:80>
    ServerName myapp.example.com
    ServerAdmin webmaster@example.com
    DocumentRoot /www/myapp/public

    # Here are the key parts
    AllowEncodedSlashes NoDecode
    ProxyPass "/" "http://127.0.0.1:5212/" nocanon

</VirtualHost
```
{% endtab %}
{% endtabs %}

### Process guarding

Either of the following two methods can be used.

#### Systemd

```bash
### Edit the configuration file
vim /usr/lib/systemd/system/cloudreve.service
```

Replace the following ``PATH_TO_CLOUDREVE`` with the directory where the program is located.

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
# Update the configuration
systemctl daemon-reload

# Start the service
systemctl start cloudreve

# Set up bootup
systemctl enable cloudreve
```

Management commands.

```bash
# Start the service
systemctl start cloudreve

# Stop the service
systemctl stop cloudreve

# Restart the service
systemctl restart cloudreve

# Check the status
systemctl status cloudreve
```

#### Supervisor

First install ``supervisor``, you can skip it if it is already installed.

```bash
# Install supervisor
sudo yum install python-setuptools
sudo easy_install supervisor

# Initialize the global configuration file
sudo touch /etc/supervisord.conf
sudo echo_supervisord_conf > /etc/supervisord.conf
```

Edit the global configuration file.

```bash
sudo vim /etc/supervisord.conf
```

Remove the `[include]` partition comment symbol `;` from the bottom of the file and add the new configuration file include path:

```bash
[include]
files = /etc/supervisor/conf/*.conf
```

Create the directory where the Cloudreve application configuration is located and create the open configuration file:

```bash
sudo mkdir -p /etc/supervisor/conf
sudo vim /etc/supervisor/conf/cloudreve.conf
```

Fill in the following as appropriate and save.

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

Where the following configuration items need to be changed as appropriate.

* `directory`: the directory where the Clopudreve main program is located
* `command`: absolute path to the Cloudreve main program
* `stderr_logfile`: path to the error log
* `stdout_logfile`: path to the usual log

Start the supervisor via the global configuration file.

```bash
supervisord -c /etc/supervisord.conf
```

In the future you can manage the Cloudreve process with the following command.

```bash
# Start
sudo supervisorctl start cloudreve

# Stop
sudo supervisorctl stop cloudreve

# Check the status
sudo supervisorctl status cloudreve
```

## Docker

You can choose to deploy with the following images.

* [xavierniu/cloudreve](https://hub.docker.com/r/xavierniu/cloudreve)