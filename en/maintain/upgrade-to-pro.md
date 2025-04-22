# Upgrade to Pro edition {#upgrade-to-pro}

If you've been using the Community edition of Cloudreve, after obtaining the Pro edition, you can upgrade while preserving your data.

## Replace the Executable File {#replace-main-program}

Back up all data, and replace the Community edition executable file with the Pro edition versions in the original directory.

## Execute the Upgrade Utility {#execute-upgrade-script}

Run the following command to upgrade the database to the Pro edition:

```bash
./cloudreve proupgrade
```

::: tip

You can specify the configuration file location with `-c`:

```bash
./cloudreve proupgrade -c data/config.ini
```

:::

## Update Startup Parameters

The Pro edition requires the `--license-key` parameter at startup, passing the license key obtained from your authorization management panel.
