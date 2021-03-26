# 数据库脚本

Cloudreve 内置了一些常用数据库脚本，可用于日常维护、版本升级等操作。您可以在启动时添加命令行参数 `--database-script <script name>` 执行各个脚本。

### 校准用户容量

如果因为系统故障、手动操作数据库记录导致用户已用空间与实际不符时，你可以运行以下数据库脚本，Cloudreve 会重新校准所有已注册用户的容量使用。

```text
./cloudreve --database-script CalibrateUserStorage
```

### 升捐助版

{% page-ref page="update/update-from-os.md" %}

### 重置管理员密码

以下数据库脚本可以重设初始管理员（即 UID 为 1 的用户）的密码，新密码会在命令行日志中输出，请注意保存。

```text
./cloudreve --database-script ResetAdminPassword
```





