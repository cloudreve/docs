# Upgrade from 2.x.x

Due to the large changes in the data table structure, upgrading from V2 to V3 requires the manual implementation of the Database Upgrade Assistant. Please be sure to back up your V2 version website data before upgrading to avoid data loss.

## Upgrade Compatibility

After upgrading from V2 to V3, the following data will be lost.

* Offline download history
* Timed task settings
* User two-step verification settings

## Check items before upgrading

Before upgrading, please check the following list to ensure that all items are met and known before proceeding with the upgrade.

* Make sure that the specific version number of Cloudreve for V2 is `2.0.0-Alpha1`, which you can see in the Admin Panel - About.
* The V3 version does not support S3 type storage policies at the moment, if you are using S3 storage policies, please delete the storage policy and its subordinate files after backing up or transferring the files.
* If you are using a remote storage policy, please delete the storage policy and its subordinate files after backing up or transferring the files, as upgrading a remote storage policy is not supported at this time.
* Backing up V2 site files, databases.
* If you are using the OneDrive task queue, stop it first.
* stopping Crontab timed tasks that have been set.
* You already know how to set up the V3 version and how to configure it to use MySQL, which you will use later, so I won't go over it again.

## Starting the upgrade

### Building the V3 version

Start V3 in the V2 version of the Cloudreve web directory by referring to the following page.

{% include "./../../getting-started/install.md" %}

Specify the MySQL database for the V3 version in the configuration file by referring to the following page, and note that you can specify a different database for the V2 version, or use a data table prefix to distinguish it from the V2 version.

{% include "./../../getting-started/config.md" %}

Restart V3 and allow Cloudreve to initialise the V3 version of the data table, do not perform any actions once the initialisation is complete.

### Run the upgrade assistant

Download `upgrade_from_2.0.0-Alpha1.zip` from the [Release 3.0.0](https://github.com/cloudreve/Cloudreve/releases/tag/3.0.0) page \( Pro version users please download `upgrade_ffrom_2.0.0-Alpha1-pro.zip`\), unzip it and overwrite it to the V2 root directory.

At the command line, switch the working directory to the V2 root directory and start the upgrade assistant by

```bash
# Switch to the V2 root directory
cd /home/www/cloudreve.org

# Start the upgrade
php upgrade run
```

Follow the prompts and enter the database information for the V3 version, the database upgrade will start when you are done.

### Follow up

Once the upgrade assistant has been run, you will be able to use the V3 version. Please note that the `public` directory in the V2 website directory contains the user avatar and local policy files from the V2 version and will still be used by the V3 version, other files can be deleted as appropriate.

### What to do if the upgrade fails

If an exception occurs during the upgrade process and you need to retry, please restore the backed up V2 version database, delete the V3 version data table and restart the V3 main program before starting the Upgrade Assistant again. A thumbnail and avatar file upgrade error warning may appear during the upgrade process again and can be ignored.