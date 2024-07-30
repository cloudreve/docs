# Upgrade from 2.x.x

Due to large changes in the data table structure, upgrading from V2 to V3 requires manual execution of the database upgrade assistant. Please be sure to backup the V2 website data before upgrading to avoid data loss.

## Upgrade Compatibility

After upgrading from V2 to V3, the following data will be lost:

* Offline download records
* Timing task setting
* User two-step verification settings

## Check items before upgrading

Before upgrading, please check carefully according to the following list to ensure that all items are met and known before performing subsequent upgrade operations.

* Make sure that the specific version number of Cloudreve V2 is `2.0.0-Alpha1`, you can see the version number in Admin Panel - About;
* The V3 version does not support the S3 storage policy for the time being. If you are using the S3 storage policy, please delete the storage policy and its subordinate files after backing up or transferring the files;
* If you are using a remote storage policy, please delete the storage policy and its subordinate files after backing up or transferring the files, because upgrading the remote storage policy is not currently supported;
* Back up V2 website files and databases;
* If you are using OneDrive task queue, please stop it first;
* Stop the set Crontab timing task;
* You already know how to build the V3 version, and the process of configuring and using MySQL, which will be used later, and will not be described in this article.

## Start upgrading

### Build the V3 version

Refer to the following page to start V3 under the V2 version Cloudreve website directory:

{% page-ref page="../../getting-started/install.md" %}

Refer to the following page to specify the V3 version to use the MySQL database in the configuration file. Please pay attention to specifying a database with a different V2 version, or use the data table prefix to distinguish it from the V2 version:

{% page-ref page="../../getting-started/config.md" %}

Restart V3 to let Cloudreve initialize the V3 version of the data table. After the initialization is complete, please do not perform any operations.

### Run the upgrade assistant

Download `upgrade_from_2.0.0-Alpha1.zip` from [Release 3.0.0](https://github.com/cloudreve/Cloudreve/releases/tag/3.0.0) page \(Pro users please download `upgrade_from_2.0.0 -Alpha1-pro.zip`\), decompress and cover to V2 root directory.

On the command line, switch the working directory to the V2 root directory and start the upgrade assistant:

```bash
# Switch to the V2 root directory
cd /home/www/cloudreve.org

# start upgrading
php upgrade run
```

According to the prompt, enter the database information of the V3 version, and the database upgrade will start after the input is completed.

### Subsequent operations

After the upgrade assistant is executed, you can use the V3 version. Under the V2 website directory, please pay attention to keep the `public` directory. There are data such as user avatars and local policy files of the V2 version in this directory, which will still be used by the V3 version. Other files can be deleted as appropriate.

### Operation after upgrade failure

If there is an exception during the upgrade process and you need to try again, please restore the backup V2 version database, delete the V3 version data table and restart the V3 main program, and then start the upgrade assistant. Thumbnail and avatar file upgrade error warnings may appear during the upgrade process again, which can be ignored.
