# Command Line Parameters {#cli}

## Global Parameters {#global-parameters}

| Parameter                 | Description                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-c`, `--conf`            | Specify the configuration file path, default is `data/config.ini` in the same directory.                                                                                        |
| `-w`, `--use-working-dir` | Default is `false`. Specify whether to use the current working directory to calculate relative paths. When `false`, it uses the directory where the executable file is located. |

## Start Cloudreve Server {#start-cloudreve}

```bash
./cloudreve
./cloudreve server
```

| Parameter             | Description                          |
| --------------------- | ------------------------------------ |
| `-l`, `--license-key` | Specify the Pro edition license key. |

## Extract Static Resources {#eject}

```bash
./cloudreve eject
```
