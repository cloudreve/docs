# 升级到 Pro 版 {#upgrade-to-pro}

如果您之前使用社区版的 Cloudreve，在获取到捐助版后，您可以在保留数据的前提下升级到捐助版。

## 替换可执行文件 {#replace-main-program}

备份所有数据，将 Pro 版可执行文件替换到原先的社区版目录下。

## 执行升级脚本 {#execute-upgrade-script}

执行下面的命令将数据库升级到 Pro 版：

```bash
./cloudreve proupgrade
```

::: tip

你可以通过 `-c` 指定配置文件位置：

```bash
./cloudreve proupgrade -c data/config.ini
```

:::

## 更新启动参数

Pro 版本启动时需要携带 `--license-key` 参数，传入你在授权管理面板获取的密钥。
