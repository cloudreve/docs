# 离线下载 {#remote-download}

Cloudreve 可配合 [aria2](https://aria2.github.io/) 或 [qBittorrent](https://www.qbittorrent.org/) 使用，实现离线下载。用户可以创建磁力链、HTTP （仅限 Aria2）、种子下载任务，由服务端下载完成后加入到用户文件中。

离线下载支持在从机节点启用，您可以将离线下载任务分流至多台服务器处理，避免这些任务过多占用主机的资源。每个负责处理离线下载任务的节点需要运行一组 Cloudreve 和下载器（Aria2/qBittorrent）实例，文件的下载和转存都会在目标节点上进行。

## 配置 {#configure}

### 添加节点

如果你需要在从机节点上处理离线下载，请先参考 [从机节点](../usage/slave-node) 文档，将节点添加到 Cloudreve 中；如果你想在 Cloudreve 主机相同服务器上处理离线下载，可跳过此步骤。

### 准备下载器 {#prepare-downloader}

请在你要使用的节点服务器上安装 Aria2 或 qBittorrent，其中 qBittorrent 只支持下载磁力链接或种子文件。运行下载器时，请确保其与 Cloudreve 进程共享相同的文件系统，或者至少有一个共享的挂载点用于存放下载的文件。

#### Aria2 {#aria2}

Aria2 的安装方法请参考 [Aria2 官方文档](https://aria2.github.io/)。

在启动 Aria2 时，需要在其配置文件中启用 RPC 服务，并设定 RPC Secret，以便后续使用。

```ini
# 启用 RPC 服务
enable-rpc=true
# RPC监听端口
rpc-listen-port=6800
# RPC 授权令牌，可自行设定
rpc-secret=<your token>
```

你也可以直接使用命令行启动 Aria2，并指定 RPC 服务参数：

```bash
aria2c --enable-rpc --rpc-secret=your_rpc_secret --rpc-listen-port=6800
```

#### qBittorrent {#qbittorrent}

下载高于 `4.4` 版本的 [qBittorrent](https://www.qbittorrent.org/) 后启动，在设置中启用 Web UI 服务，并设定用户名和密码。

### 配置节点

下载器配置并启动后，在 Cloudreve 中打开其所在的节点设置，在 `已启用功能` 中勾选 `离线下载`，并配置下载器的参数：

#### RPC 服务器地址 / Web UI 地址

请填写 Aria2 的 RPC 服务器地址或 qBittorrent 的 Web UI 地址。

#### RPC 授权令牌 / 访问凭证

请填写 Aria2 的 RPC Secret 或 qBittorrent 的 WebUI 用户名和密码。

#### 临时下载目录

请填写下载的文件存放的目录，留空时，会使用默认的 `临时路径`，默认情况下在 Cloudreve 同级的 `data/temp` 目录下，Cloudreve 需要有对此目录的读写和执行权限。

::: tip 重要

请确保此目录的绝对路径对 Cloudreve 和下载器来说，都是可以访问，且都是同一目录。

在非容器环境下，一般也不会出现问题，但是如果 Cloudreve 或下载器运行在容器中，两者的文件系统是隔离开的，导致 Cloudreve 无法访问到下载器下载的文件。（对于官方的全量镜像，其中已包含 Aria2 运行在同一容器中，无需关注 Aria2 下载器的路径问题）。

- 如果 Cloudreve 在容器运行，下载器在宿主机运行，请将容器的 `/cloudreve/data` 目录挂载到宿主机的同一目录 `/cloudreve/data` 下；或者在节点下载器配置中指定其他目录，比如 `/var/www/cloudreve/download/temp`，然后将此目录挂载到宿主机相同路径，比如：

  ```bash {2}
  docker run -d --name cloudreve \
  -v /var/www/cloudreve/download/temp:/var/www/cloudreve/data/temp \
  -p 5212:5212 \
  cloudreve/cloudreve:latest
  ```

- 如果下载器在容器运行，Cloudreve 在宿主机运行，请将宿主机下载器的 `/cloudreve/data` 目录挂载到宿主机同一路径的 `/cloudreve/data` 目录下；或者在节点下载器配置中指定其他目录，比如 `/var/www/cloudreve/download/temp`，然后将此目录挂载到宿主机相同路径，比如：

  ```bash {2}
  docker run -d --name qbittorrent \
  -v /var/www/cloudreve/download/temp:/var/www/cloudreve/data/temp \
  -p 6800:6800 \
  xxx/aria2:latest
  ```

- 如果下载器和 Cloudreve 都在不同容器运行，请将下载器和 Cloudreve 容器的 `/cloudreve/data` 目录都挂载到宿主机相同路径的 `/cloudreve/data` 目录下，或者在节点下载器配置中指定其他目录，比如 `/var/www/cloudreve/download/temp`，然后将 Cloudreve 和下载器容器的 `/var/www/cloudreve/download/temp` 目录挂载到宿主机相同路径 `/var/www/cloudreve/download/temp`。

:::

#### 下载器任务参数

配置 Cloudreve 创建下载任务时额外附加给下载器的参数。

::: tabs

=== Aria2

对于 Aria2，请参考 [Aria2 官方文档](https://aria2.github.io/manual/en/html/aria2c.html#id2) 找到可用参数，然后以 JSON 格式填写。比如，如果需要限制任务下载速度、限制最大并行下载数、指定 Tracker 列表、限制做种时间等：

```json
{
  "max-download-limit": "100K",
  "max-concurrent-downloads": 5,
  "bt-tracker": [
    "udp://tracker.coppersurfer.tk:6969/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://tracker.leechers-paradise.org:6969/announce"
  ],
  "seed-ratio": 1.0,
  "seed-time": 1000
}
```

=== qBittorrent
对于 qBittorrent，请参考 [qBittorrent API 文档](<https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#add-new-torrent>) 找到可用参数，然后以 JSON 格式填写。比如需要限制下载速度、分享率和最大做种时间：

```json
{
  "dlLimit": 102400,
  "ratioLimit": 1.0,
  "seedingTimeLimit": 1000
}
```

:::

除了在此配置全局参数外，你还可以在用户组设置中用类似的 JSON 格式配置用户组级别的参数。

### 配置用户组

节点的下载器配置完成后，请在对应用户组编辑页面开启离线下载使用权限。

## 常见问题 {#faq}

::: details 任务下载完成或失败后，下载的文件没有被删除。

Cloudreve 会延迟几分钟删除文件。如果文件长时间仍未删除，请检查 Cloudreve 是否拥有下载临时目录的权限。

:::

::: details 任务下载完成后，转存失败，切报错包含 `no such file or directory`。

请检查 Cloudreve 和下载器是否共享同一文件系统，或者是否将下载临时目录挂载到同一目录。

:::

::: details BT 下载太慢/无速度。

下载任务是由对应下载器进行处理，无法通过 Cloudreve 做出优化。一个可能的解决方案是，手动添加 Tracker 服务器。比如 你可以在 Aria2 配置文件中指定 Tracker：

```ini
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

以上指定的 Tracker 列表只是示例，你需要根据实际自己填写。你可以使用 [trackerslist](https://github.com/ngosang/trackerslist) 项目中每日更新的最佳 Tracker 列表。

:::

::: details 离线下载列表里任务状态更新不及时？

Cloudreve 会使用异步队列监控并处理下载任务，任务进度可能会有延迟，请耐心等待。

:::

::: details 测试下载器通信时报错 `... dial tcp xxx: connect: connection refused...`。

请检查下载器是否正常启动，并检查 `RPC 服务器地址` （Aria2）或 `Web UI 地址` （qBittorrent）是否正确。如果运行在容器上，请检查对应端口是否被映射到宿主机。

:::

::: details qBittorrent 下载任务添加后，任务失败 `failed to get task status after x retry`。

- 如果任务是磁力链接，可能是 qBittorrent 无法在短时间内获取到磁力链接的详细信息，导致任务没有创建出来。
- 如果是从种子文件创建任务，请检查主要站点 URL 设置是否正确，下载器会通过此 URL 下载种子文件。
- 如果是 HTTP 链接的文件，qBittorrent 并不支持通过 HTTP 下载，请使用 Aria2 下载器。
- 其他情况，有可能是 qBittorrent 已经存在相同的任务，无法重复创建。

:::

::: details Aria2 任务出错 `Infohash is already registered`

Aria2 中已存在相同的任务，暂不支持重复创建。

:::
