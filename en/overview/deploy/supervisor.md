# Deploy Cloudreve with Process Supervisor {#deploy-supervisor}

In this deployment mode, Cloudreve will run directly on your server and be managed by a process supervision tool (such as Supervisor).

## Configure Process Supervisor {#configure-supervisor}

Choose one of the following two methods (Supervisor or Systemd).

### Deploy with Supervisor {#deploy-supervisor-supervisor}

Install Supervisor:

```bash
sudo apt-get install supervisor
```

Initialize Supervisor configuration:

```bash
# Initialize global configuration file
sudo echo_supervisord_conf > /etc/supervisor/supervisord.conf

# Open global configuration file
sudo nano /etc/supervisor/supervisord.conf
```

Remove the comment symbol `;` from the `[include]` section at the bottom of the file, and add a new configuration file include path:

```ini
[include]
files = /etc/supervisor/conf.d/*.conf
```

Create the directory for the Cloudreve application configuration file, and create and open the configuration file:

```bash
sudo mkdir -p /etc/supervisor/conf
sudo vim /etc/supervisor/conf/cloudreve.conf
```

Fill in the following content according to your needs and save:

```ini
[program:cloudreve]
directory=/home/cloudreve ; Directory where Cloudreve main program is located
command=/home/cloudreve/cloudreve ; Path to Cloudreve main program
autostart=true ; Whether to start automatically
autorestart=true ; Whether to restart automatically
stderr_logfile=/var/log/cloudreve.err ; Error log file path
stdout_logfile=/var/log/cloudreve.log ; Log file path
environment=
    CODENATION_ENV=prod,
    CR_LICENSE_KEY=your_authorization_key ; Pro edition authorization key, community edition can ignore this
```

Start the Supervisor service and Cloudreve application:

```bash
# Start supervisor through the global configuration file:
supervisord -c /etc/supervisord.conf

# Start Cloudreve
sudo supervisorctl start cloudreve

# Stop Cloudreve
sudo supervisorctl stop cloudreve

# Check Cloudreve status
sudo supervisorctl status cloudreve
```

### Deploy with Systemd {#deploy-supervisor-systemd}

Create a Systemd service file for Cloudreve:

```bash
sudo vim /etc/systemd/system/cloudreve.service
```

Fill in the following content according to your needs and save, where `PATH_TO_CLOUDREVE` is the directory where the Cloudreve main program is located, and `ExecStart` is the path to the Cloudreve main program.

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

# Pro edition authorization key
Environment="CR_LICENSE_KEY=your_authorization_key"

# Log output
StandardOutput=/var/log/cloudreve.log
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

Start Cloudreve through Systemd:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudreve
sudo systemctl start cloudreve
```

Manage Cloudreve in the future:

```bash
# Stop Cloudreve
sudo systemctl stop cloudreve

# Start Cloudreve
sudo systemctl start cloudreve

# Restart Cloudreve
sudo systemctl restart cloudreve

# Check Cloudreve status
sudo systemctl status cloudreve
```

## Configure Database {#configure-database}

After successfully starting Cloudreve for the first time, a default configuration file will be generated in `Cloudreve main program directory/data/conf.ini`. Add database configuration to this file:

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

The available configuration items are:

| Setting Name | Description                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| `Type`       | Database type, supports `postgres`, `mysql`, `sqlite`                              |
| `Host`       | Database address                                                                   |
| `Port`       | Database port                                                                      |
| `User`       | Database username                                                                  |
| `Password`   | Database password                                                                  |
| `Name`       | Database name                                                                      |
| `DBFile`     | Optional, SQLite database file path                                                |
| `UnixSocket` | Optional, `true` or `false`, whether to use Unix Socket to connect to the database |

After modifying the configuration file, you need to restart Cloudreve.

## Configure Redis {#configure-redis}

After successfully starting Cloudreve for the first time, a default configuration file will be generated in `Cloudreve main program directory/data/conf.ini`. Add Redis configuration to this file:

```ini{5-8}
[System]
Mode = master
Listen = :5212

[Redis]
Server = 127.0.0.1:6379
Password = your_redis_password
DB = 0
```

The available configuration items are:

| Setting Name | Description                                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Server`     | Redis address                                                                                                                                                                                                              |
| `Password`   | Connection password                                                                                                                                                                                                        |
| `DB`         | Database number, default is `0`                                                                                                                                                                                            |
| `Network`    | Network type, default is `tcp`, options include `tcp`, `tcp4` (IPv4-only), `tcp6` (IPv6-only), `udp`, `udp4` (IPv4-only), `udp6` (IPv6-only), `ip`, `ip4` (IPv4-only), `ip6` (IPv6-only), `unix`, `unixgram`, `unixpacket` |
| `User`       | Redis ACL username                                                                                                                                                                                                         |

After modifying the configuration file, you need to restart Cloudreve.

## Next Steps {#next-steps}

Cloudreve will listen on port 5212 by default. You can access Cloudreve by visiting `http://localhost:5212` in your browser. Please register an account; the first registered account will be set as the administrator.

At this point, Cloudreve has started successfully and is listening on port 5212. Please continue to the [Next Steps](./configure) page to complete your deployment.
