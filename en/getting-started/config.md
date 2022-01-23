# Configuration files

## Configuration file

When you start Cloudreve for the first time, Cloudreve creates a configuration file named `conf.ini` in the same level directory.

You can also specify the path to the configuration file by adding the `-c` parameter at startup:

```
./cloudreve -c /path/to/conf.ini
```

An example of a complete configuration file is as follows.

```d
[System]
; Run mode
Mode = master
; Listening port
Listen = :5000
; Whether to enable Debug
Debug = false
; Session key, usually generated automatically at first boot
SessionSecret = 23333
; Hash salt, usually generated automatically at first boot
HashIDSalt = something really hard to guess

; SSL related
[SSL]
; SSL listening port
Listen = :443
; Certificate path
CertPath = C:\Users\i\Documents\fullchain.pem
; private key path
KeyPath = C:\Users\i\Documents\privkey.pem

; Enable Unix Socket Listening
[UnixSocket]
Listen = /run/cloudreve/cloudreve.sock

;If you only want to use the built-in SQLite database, just delete this section
[Database]
; Database type, currently supports sqlite/mysql/mssql/postgres
Type = mysql
MySQL port
Port = 3306
; Username
User = root
Password
Password = root
; Database address
Host = 127.0.0.1
; Database name
Name = v3
; Data table prefix
TablePrefix = cd_
; Character set
Charset = utf8
; SQLite database file path
DBFile = cloudreve.db

; Configuration in slave mode
[Slave]
; Communication key
Secret = 1234567891234567123456789123456712345678912345671234567891234567
; Callback request timeout (s)
CallbackTimeout = 20
; Signature validity
SignatureTTL = 60

; Cross-domain configuration
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
AllowCredentials = false

; Redis-related
[Redis]
Server = 127.0.0.1:6379
Password =
DB = 0

; Thumbnail
[Thumbnail]
MaxWidth = 400
MaxHeight = 300
FileSuffix = ._thumb
; Maximum number of thumbnails to be generated in parallel, filled with -1 will be determined automatically based on the number of CPU cores
MaxTaskCount = -1
; can be filled with jpg / png
EncodeMethod = jpg
; whether to garbage collect thumbnails immediately after they are generated
GCAfterGen = false
; Thumbnail quality
EncodeQuality = 85
```

## Using MySQL

By default, Cloudreve uses the built-in SQLite database and creates the database file `cloudreve.db` in the same directory. If you want to use MySQL, please add the following to the configuration file and restart Cloudreve.

Note that Cloudreve only supports MySQL versions greater than or equal to 5.7.
```
[Database]
; database type, currently sqlite/mysql/mssql/postgres is supported
Type = mysql
MySQL port
Port = 3306
; Username
User = root
; Password
Password = root
; Database address
Host = 127.0.0.1
; Database name
Name = v3
; Data table prefix
TablePrefix = cd
; Character set
Charset = utf8
```

{% hint style="info" %}
After changing the database configuration, Cloudreve will reinitialize the database and the old data will be lost.
{% endhint %}

## Using Redis

You can add Redis-related settings to your configuration file.

```
[Redis]
Server = 127.0.0.1:6379
Password = your password
DB = 0
```

{% hint style="info" %}
Please specify a DB for Cloudreve that is not used by other services to avoid conflicts.
{% endhint %}

After restarting Cloudreve, you can note the console output to determine if Cloudreve successfully connected to the Redis server. When using Redis, the following will be taken over by Redis.

* User sessions (no more lost login sessions after restarting Cloudreve)
* Data table HF record query cache (e.g. storage policies, settings entries)
* Callback sessions
* OneDrive credentials

## Enable HTTPS

{% hint style="info" %}
If you are using Cloudreve as a web server reverse proxy, it is recommended that you configure SSL in your web server, the how to described in this section is only valid if you are using Cloudreve's built-in web server.
{% endhint %}

In the configuration file add.

```
[SSL]
Listen = :443
CertPath = C:\Users\i\Documents\fullchain.pem
KeyPath = C:\Users\i\Documents\privkey.pem
```

where `CertPath` and `KeyPath` are the SSL certificate and private key paths, respectively. Save and restart Cloudreve to take effect.