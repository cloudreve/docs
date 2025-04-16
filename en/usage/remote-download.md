# Remote Download {#remote-download}

Cloudreve can be used in conjunction with [aria2](https://aria2.github.io/) or [qBittorrent](https://www.qbittorrent.org/) to enable remote downloading. Users can create download tasks for magnet links, HTTP (Aria2 only), and torrents, which will be downloaded by the server and added to the user's files upon completion.

Remote downloading is also supported on slave nodes, allowing you to distribute download tasks across multiple servers to avoid overloading the main host's resources. Each node responsible for handling remote downloads needs to run a set of Cloudreve and downloader (Aria2/qBittorrent) instances, and both the file downloading and transfer will occur on the target node.

## Configuration {#configure}

### Adding Nodes

If you need to process remote downloads on slave nodes, please first refer to the [Slave Node](../usage/slave-node) documentation to add nodes to Cloudreve. If you want to handle remote downloads on the same server as the Cloudreve host, you can skip this step.

### Preparing the Downloader {#prepare-downloader}

Please install Aria2 or qBittorrent on the node server you want to use. Note that qBittorrent only supports downloading magnet links or torrent files. When running the downloader, ensure it shares the same file system with the Cloudreve process, or at least has a shared mount point for storing downloaded files.

#### Aria2 {#aria2}

For Aria2 installation, please refer to the [Aria2 official documentation](https://aria2.github.io/).

When starting Aria2, you need to enable the RPC service in its configuration file and set an RPC Secret for subsequent use.

```ini
# Enable RPC service
enable-rpc=true
# RPC listening port
rpc-listen-port=6800
# RPC authorization token, can be customized
rpc-secret=<your token>
```

You can also start Aria2 directly from the command line and specify RPC service parameters:

```bash
aria2c --enable-rpc --rpc-secret=your_rpc_secret --rpc-listen-port=6800
```

#### qBittorrent {#qbittorrent}

Download [qBittorrent](https://www.qbittorrent.org/) version higher than `4.4`, start it, and enable the Web UI service in settings, then set the username and password.

### Configuring Nodes

After configuring and starting the downloader, open the node settings in Cloudreve, check `Remote Download` in the `Enabled Features`, and configure the downloader parameters:

#### RPC Server Address / Web UI Address

Please enter the Aria2 RPC server address or qBittorrent Web UI address.

#### RPC Authorization Token / Access Credentials

Please enter the Aria2 RPC Secret or qBittorrent WebUI username and password.

#### Temporary Download Directory

Please specify the directory where downloaded files will be stored. If left empty, it will use the default `Temporary download directory`, which is typically in the `data/temp` directory at the same level as Cloudreve. Cloudreve needs read, write, and execute permissions for this directory.

::: tip Important

Please ensure that this directory's absolute path is accessible to both Cloudreve and the downloader, and that it refers to the same directory for both.

In non-container environments, this usually isn't an issue, but if Cloudreve or the downloader runs in containers, their file systems are isolated, preventing Cloudreve from accessing files downloaded by the downloader. (For the official full image, which includes Aria2 running in the same container, you don't need to worry about the Aria2 downloader path).

- If Cloudreve runs in a container and the downloader runs on the host machine, mount the container's `/cloudreve/data` directory to the same directory `/cloudreve/data` on the host; or specify another directory in the node downloader configuration, such as `/var/www/cloudreve/download/temp`, then mount this directory to the same path on the host, for example:

  ```bash {2}
  docker run -d --name cloudreve \
  -v /var/www/cloudreve/download/temp:/var/www/cloudreve/data/temp \
  -p 5212:5212 \
  cloudreve/cloudreve:latest
  ```

- If the downloader runs in a container and Cloudreve runs on the host machine, mount the host downloader's `/cloudreve/data` directory to the same path `/cloudreve/data` on the host; or specify another directory in the node downloader configuration, such as `/var/www/cloudreve/download/temp`, then mount this directory to the same path on the host, for example:

  ```bash {2}
  docker run -d --name qbittorrent \
  -v /var/www/cloudreve/download/temp:/var/www/cloudreve/data/temp \
  -p 6800:6800 \
  xxx/aria2:latest
  ```

- If both the downloader and Cloudreve run in different containers, mount both containers' `/cloudreve/data` directories to the same path `/cloudreve/data` on the host, or specify another directory in the node downloader configuration, such as `/var/www/cloudreve/download/temp`, then mount both Cloudreve and downloader containers' `/var/www/cloudreve/download/temp` directories to the same path `/var/www/cloudreve/download/temp` on the host.

:::

#### Downloader Task Parameters

Configure additional parameters that Cloudreve will pass to the downloader when creating download tasks.

::: tabs

=== Aria2

For Aria2, please refer to the [Aria2 official documentation](https://aria2.github.io/manual/en/html/aria2c.html#id2) for available parameters, then fill them in JSON format. For example, if you need to limit task download speed, maximum parallel downloads, specify tracker lists, limit seeding time, etc.:

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
For qBittorrent, please refer to the [qBittorrent API documentation](<https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#add-new-torrent>) for available parameters, then fill them in JSON format. For example, if you need to limit download speed, share ratio, and maximum seeding time:

```json
{
  "dlLimit": 102400,
  "ratioLimit": 1.0,
  "seedingTimeLimit": 1000
}
```

:::

In addition to configuring global parameters here, you can also configure user group level parameters in user group settings using a similar JSON format.

### Configuring User Groups

After completing the node's downloader configuration, please enable remote download permissions in the corresponding user group editing page.

## FAQ {#faq}

::: details Downloaded files are not deleted after tasks are completed or failed.

Cloudreve will delay file deletion for a few minutes. If files remain undeleted for a long time, please check if Cloudreve has permissions for the download temporary directory.

:::

::: details Task transfer fails after download completion, with error containing `no such file or directory`.

Please check if Cloudreve and the downloader share the same file system, or if the download temporary directory is mounted to the same directory.

:::

::: details BT downloads are too slow/have no speed.

Download tasks are processed by the corresponding downloader and cannot be optimized through Cloudreve. One possible solution is to manually add Tracker servers. For example, you can specify Trackers in the Aria2 configuration file:

```ini
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

The above specified Tracker list is just an example; you need to fill in your own based on actual needs. You can use the daily updated best Tracker list from the [trackerslist](https://github.com/ngosang/trackerslist) project.

:::

::: details Task status in the remote download list doesn't update promptly?

Cloudreve uses an asynchronous queue to monitor and process download tasks, so task progress may be delayed. Please be patient.

:::

::: details Error `... dial tcp xxx: connect: connection refused...` when testing downloader communication.

Please check if the downloader is running normally and verify if the `RPC Server Address` (Aria2) or `Web UI Address` (qBittorrent) is correct. If running in containers, check if the corresponding ports are mapped to the host machine.

:::

::: details qBittorrent download task fails with `failed to get task status after x retry` after adding.

- For magnet links, qBittorrent might not be able to get detailed information about the magnet link in a short time, causing the task not to be created.
- For tasks created from torrent files, please check if the main site URL setting is correct, as the downloader will download the torrent file through this URL.
- For HTTP link files, qBittorrent doesn't support HTTP downloads, please use the Aria2 downloader.
- In other cases, qBittorrent might already have an identical task and cannot create duplicates.

:::

::: details Aria2 task error `Infohash is already registered`

An identical task already exists in Aria2, and duplicate creation is not currently supported.

:::
