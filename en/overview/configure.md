# Configuration {#configure}

Cloudreve's configuration is stored in two parts: critical configuration for program operation is stored in the configuration file, while other application-level configurations are stored in the database. This page mainly introduces the structure of the configuration file.

Cloudreve's default configuration file is `data/config.ini`. You can pass the configuration file path as a command line parameter when starting Cloudreve:

```bash
./cloudreve -c /path/to/config.ini
```

## Configuration File Structure {#config-file-structure}

Cloudreve's configuration file structure is as follows:

```ini
[System]
; Running mode, available values are master/slave
Mode = master
; HTTP listening port, default is 5212
Listen = :5212
; Whether to enable Debug mode, default is false
Debug = false
; Header used to present client IP, default is X-Forwarded-For
ProxyHeader = X-Forwarded-For
; Maximum buffer time for safe process exit, default is 0, no limit
GracePeriod = 0
; Log level, available values are debug/info/warning/error, default is info
LogLevel = info

; SSL related
[SSL]
; SSL listening port, default is 443
Listen = :443
; Certificate path, default is empty
CertPath =
; Private key path, default is empty
KeyPath =

; Enable Unix Socket listening
[Unix]
; Unix Socket listening path, default is empty
Listen = /run/cloudreve/cloudreve.sock
; Set permissions for the generated socket file, default is empty
Perm = 0666

; Database related, if you only want to use the built-in SQLite database, you can delete this section
[Database]
; Database type, currently supports sqlite/mysql/postgres, default is sqlite
Type = sqlite
; Database port, default is 3306
Port = 3306
; Username, default is empty
User =
; Password, default is empty
Password =
; Database address, default is empty
Host = 127.0.0.1
; Database name, default is empty
Name = cloudreve
; Connection character set, default is utf8mb4
Charset = utf8mb4
; SQLite database file path, default is data/cloudreve.db
DBFile = cloudreve.db
; Connect to the database using Unix Socket, default is false. If enabled, please specify the Unix Socket path in Host
UnixSocket = false

; Slave mode configuration
[Slave]
; Communication secret key, default is empty
Secret =
; Callback request timeout (s), default is 20
CallbackTimeout = 20
; Signature validity period (s), default is 600
SignatureTTL = 600

; CORS configuration
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
AllowCredentials = false

; Redis related
[Redis]
; Connection type, default is tcp
Network = tcp
; Server address, default is empty, not enabled
Server = 127.0.0.1:6379
; Password, default is empty
Password =
; Database, default is 0
DB = 0
; Username, default is empty
User =

; Slave configuration application override
[OptionOverwrite]
; Directly use the `setting name = value` format to override
queue_slave_worker_num = 50
```

## Debug Mode {#debug-mode}

You can enable Debug mode by setting `Debug` to `true`. When enabled, Cloudreve will record more log information to help you troubleshoot issues.

```ini{4}
[System]
Mode = master
Listen = :5212
Debug = true
```

In Debug mode:

- Log level is forced to `debug`, regardless of your settings in the configuration file;
- All available routes are printed at startup;
- All database queries will print detailed log information. Note that this may include some sensitive information.
- Error messages displayed to users will include the original error information.

## Slave Node Configuration Override {#slave-node-configuration-override}

Slave nodes can override the master's configuration. You can use the `[OptionOverwrite]` section in the slave node's configuration file to override the master's configuration. For example, to modify the slave task queue configuration:

```ini
[OptionOverwrite]
; Maximum number of workers
queue_slave_worker_num = 15
; Maximum execution time (s)
queue_slave_max_execution = 2800
; Retry factor
queue_slave_backoff_factor = 4
; Maximum retry wait time (s)
queue_slave_backoff_max_duration = 3600
; Maximum retry count
queue_slave_max_retry = 5
; Retry delay (s)
queue_slave_retry_delay = 5
```
