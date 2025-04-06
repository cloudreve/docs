# 更新 Cloudreve {#upgrade-cloudreve}

本章节描述步骤仅适用于在 V4.x.x 版本内进行更新。

## 准备 {#prepare}

在更新开始前，请先备份现有版本的数据库。你可以使用诸如 [`mysqldump`](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) 一类的第三方工具来创建数据库备份。对于 SQLite 数据库，你可以直接备份 `cloudreve.db` 文件。

虽然理论上升级流程不会对数据库造成损坏，但为了保险起见，建议你还是先备份数据库。

## 更新 {#upgrade}

:::tabs

== 裸机部署

将 Cloudreve 可执行文件替换为新版本，然后重启 Cloudreve 即可。

== Docker 单容器

<!--@include: ../parts/docker-upgrade.md-->

== Docker Compose

<!--@include: ../parts/docker-compose-upgrade.md-->

:::

## 后续 {#after}

如果你正在使用从机节点，请将从机节点上的 Cloudreve 也升级到相同版本。
