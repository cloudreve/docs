# 离线下载

Cloudreve 的离线下载核心由 [Aria2](https://aria2.github.io/) 驱动。正确配置并启用离线下载功能后，用户可以创建磁力链、HTTP、种子下载任务，由服务端下载完成后加入到用户文件中。

对于云存储策略，离线下载任务完成后，Cloudreve 会将所下载的文件转存到云存储端，在转存结束前，用户无法下载、管理已下载的文件。用户可以在前台任务队列中查看转存任务进度。

## 启用离线下载

### Aria2  RPC 配置

Aria2 的安装、启动过程不在本文讨论范围之内。您需要在 Cloudreve 相同的机器上启动 Aria2。

{% hint style="info" %}
推荐在日常启动流程中，先启动 Aria2，再启动 Cloudreve，这样 Cloudreve 可以向 Aria2 订阅事件通知，下载状态变更处理更及时。当然，如果没有这一流程，Cloudreve 也会通过轮询追踪任务状态。
{% endhint %}

在启动 Aria2 时，需要在其配置文件中启用 RPC 服务，并设定 RPC Secret，以便后续使用。

```bash
# 启用 RPC 服务
enable-rpc=true
# RPC监听端口
rpc-listen-port=6800
# RPC 授权令牌，可自行设定
rpc-secret=<your token>
```

### 接入 Cloudreve

前往 Cloudreve 的 管理面板-参数设置-离线下载，根据指引填写信息并测试是否可以与aria2正常通信。

对于其中重要参数项的解释如下：

**RPC 服务器地址**

Aria2 RPC 服务器的地址，一般可填写为`http://127.0.0.1:6800/` 。其中`6800` 为上文 Aria2 配置文件中指定的监听端口。您可以使用 WebSocket 通信，此处填写为`ws://127.0.0.1:6800/` 。

**RPC Secret**

上文中您在  Aria2 配置文件中设定的 RPC 授权令牌

**临时下载目录**

Cloudreve 会指定 Aria2 将文件下载到此目录中，下载完成后 Cloudreve 会复制到指定的存储策略，并删除文件。此目录**必须为绝对路径**，否则 Cloudreve 在任务下载完成后会找不到文件。Windows 下指定的绝对路径应该携带盘符，比如`G:\www\downloads` 。

**状态刷新间隔（秒）**

指定针对每一个任务，Cloudreve 向 Aria2 轮询更新任务状态的间隔。用户再前台看到的任务进度不会实时更新，而是根据这里设定的间隔自动刷新。

**全局任务参数**

在此处指定 Cloudreve 创建 Aria2 下载任务时携带的额外参数，如果 Aria2 未与其他服务公共时，你也可以在 Aria2 的配置文件中指定这些参数。具体的可用参数可参考[官方文档](https://aria2.github.io/manual/en/html/aria2c.html#options)，以 JSON 的格式填写在这里。如果格式有误，可能会导致无法创建任务。以下为一个填写示例，指定了最大并行任务数和 Tracker 服务器列表：

```javascript
{
	"max-concurrent-downloads": 10,
	"bt-tracker": [
		"udp://tracker.coppersurfer.tk:6969/announce",
		"udp://tracker.opentrackr.org:1337/announce",
		"udp://tracker.leechers-paradise.org:6969/announce"
	]
}
```

您也可在用户组配置中，为每个用户组指定其特有的参数，比如限制最大下载速度等。具体格式与上述一致，不再复述。

### 用户组权限

对于您想要允许使用离线下载功能的用户组，请在用户组编辑页面开启离线下载使用权限。

## 常见问题

#### 测试 Aria2 连接时提示`无法请求 RPC 服务, Post "XXX": dial tcp XXX connect: connection refused`

填写的 RPC 地址有误，无法连接，检查地址是否有误、Aria2 是否启动、端口是否与 Aria2 配置文件中指定的一致。

#### 测试 Aria2 连接时提示 `无法请求 RPC 服务, invalid character '<' looking for beginning of value`

填写的 RPC 地址有误，可以连接，但其并不是 Aria2 的 RPC服务，请检查地址是否有误、端口是否正确。这一错误的原因一般是将 RPC 地址 填写为了某项 Web 服务的地址。

#### Cloudreve 任务列表里任务状态不更新/更新不及时

Cloudreve 会定期轮询任务状态，任务创建后状态不会实时更新，请耐心等待。您也可以在 管理面板-参数设置-离线下载-状态刷新间隔（秒）中调整更新频率。

#### BT 下载太慢/无速度

下载任务是由 Aria2 进行处理，无法通过 Cloudreve 做出优化。一个可能的解决方案是，手动添加 Tracker 服务器。你可以在 Aria2 配置文件中指定 Tracker：

```bash
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

以上指定的 Tracker 列表只是示例，你需要根据实际自己填写。你可以使用  [trackerslist](https://github.com/ngosang/trackerslist) 项目中每日更新的最佳 Tracker 列表。

#### BT 任务进度100%后，任务仍长期处在”进行中“的列表中不被处理

默认情况下 Aria2 会对下载完成的 BT 任务进行做种，做种完成后才会被 Cloudreve 认定为已完成，并进行后续处理。您可以在 Aria2 配置文件中指定做种分享率或做种时间，当达到任一条件后，做种会停止：

```bash
# 做种分享率, 0为一直做种, 默认:1.0
seed-ratio=1.0
# 作种时间大于30分钟，则停止作种
seed-time=30
```



