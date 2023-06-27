# database script

Cloudreve has built-in some commonly used database scripts, which can be used for daily maintenance, version upgrade and other operations. You can add the command line parameter `--database-script <script name>` to execute individual scripts at startup.

### Calibrate user capacity

If the user's used space is inconsistent with the actual one due to system failure or manual operation of database records, you can run the following database script, and Cloudreve will recalibrate the capacity usage of all registered users.

```text
./cloudreve --database-script CalibrateUserStorage
```

### Upgrade Donation Edition

{% page-ref page="update/update-from-os.md" %}

### Reset admin password

The following database script can reset the password of the initial administrator (that is, the user with UID 1). The new password will be output in the command line log, please save it.

```text
./cloudreve --database-script ResetAdminPassword
```
