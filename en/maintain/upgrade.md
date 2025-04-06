# Upgrad Cloudreve {#upgrade-cloudreve}

The steps described in this section only apply to upgrading within V4.x.x versions.

## Preparation {#prepare}

Before beginning the upgrade, please backup your existing database. You can use third-party tools such as [`mysqldump`](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) to create database backups. For SQLite databases, you can directly backup the `cloudreve.db` file.

Although theoretically the upgrade process will not modify the current database, it is still recommended that you backup the database for safety.

## Upgrade {#upgrade}

:::tabs

== Bare Metal Deployment

Replace the Cloudreve executable file with the new version, then restart Cloudreve.

== Docker Single Container

<!--@include: ../parts/docker-upgrade.md-->

== Docker Compose

<!--@include: ../parts/docker-compose-upgrade.md-->

:::

## Afterward {#after}

If you are using slave nodes, please also upgrade the Cloudreve on the slave nodes to the same version.
