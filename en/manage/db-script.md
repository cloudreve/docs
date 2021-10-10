# Database Scripts

Cloudreve has some common database scripts built in for routine maintenance, versioning and other operations. You can execute each script by adding the command line parameter `-database-script <script name>` at startup.

### Calibrating user capacity

If the space used by users does not match the actual space used due to system failure or manual manipulation of database records, you can run the following database script and Cloudreve will recalibrate the capacity usage for all registered users.

```text
./cloudreve --database-script CalibrateUserStorage
```

### Upgrade donation version

{% page-ref page="update/update-from-os.md" %}

### Reset administrator password

The following database script resets the password of the initial administrator (i.e. the user with UID 1). The new password will be output in the command line log, so please take care to save it.

```text
. /cloudreve --database-script ResetAdminPassword
```