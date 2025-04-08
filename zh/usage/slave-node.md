# 从机节点 {#slave-node}

你可以将 Cloudreve 以从机模式运行在其他服务器上，Cloudreve 主机可以与其通信，并将部分任务分发到从机节点上执行，或者将从机节点作为文件存储节点使用。

## 配置新节点 {#configure-new-node}

1. 前往 `管理面板` -> `节点` -> `新建节点`，获取弹出窗口中给出的从机配置文件。
2. 在要作为从机节点的服务器上，新建一个配置文件 `conf.ini`，把从机配置文件中的内容粘贴进去。你可以根据自己需求修改监听端口等配置。

   ```bash
   # 新建目录
   mkdir ~/cloudreve_slave
   cd ~/cloudreve_slave

   # 新建数据目录，用于存放配置
   mkdir ~/cloudreve_slave/data

   # 新建配置文件
   nano ~/cloudreve_slave/conf.ini
   ```

3. 将与主机节点相同版本的 Cloudreve 程序拷贝到 `~/cloudreve_slave` 下，并启动：

   ```bash
   ./cloudreve
   ```

   ::: tip
   你也可以使用 `-c` 参数指定配置文件位置：

   ```bash
   ./cloudreve -c data/conf.ini
   ```

   :::

4. 返回到管理面板中新建节点的表单，填写节点的名称和地址，测试节点通信。如果通信测试失败，可以先保存节点，并根据 [常见问题](#faq) 排查问题。
5. <Badge type="info" text="可选" /> 参考 [使用 进程守护 部署 Cloudreve](../overview/deploy/supervisor) 使用进程守护部署 Cloudreve 从机节点。
6. <Badge type="info" text="可选" /> 参考 [配置反向代理](../overview/deploy/configure#configure-reverse-proxy) 为从机节点配置反向代理。

## 开启节点的功能 {#enable-node-features}

节点添加后，可前往节点设置页面为节点启用各项功能。

### 文件压缩/解压缩 {#file-compression-decompression}

开启后，用户在线创建压缩文件或解压缩文件的任务会被分配至此节点执行，文件的下载、处理、转存都会在此节点上执行。

- 创建压缩文件时，节点需要将文件压缩至临时目录，再进行转存，所需存储空间为文件压缩后的大小；
- 解压缩文件时：
  - 对于格式为 `zip` 的压缩包，需要将压缩包完整下载到临时目录后再开始解压，所需存储空间为压缩包的大小；
  - 对于其他格式的压缩包，整个解压过程不会有文件落盘。

### 离线下载 {#remote-download}

请参考 [离线下载](./remote-download)。

### 存储文件 {#storage-files}

请参考 [从机存储](./storage/remote)。

## 负载均衡

如果用户创建任务时没有明确选择节点，且有多个节点可用时，Cloudreve 会使用加权轮询策略选择一个节点。你可以在 `节点设置` -> `负载均衡权重` 中设置权重值。比如：节点 A 的权重为 3，节点 B 的权重为 2，那么在每 5 次任务请求中，节点 A 会被选择 3 次，节点 B 会被选择 2 次。

## 常见问题 {#faq}

::: details 节点通信失败 `Failed to connect to node: Post "xxx": connect: xxx`

检查你填写的节点 URL 是否正确，所使用的端口在防火墙中是否开放。

如果报错以 `status code: xxx` 结尾，说明你填写的节点地址并未指向 Cloudreve 从机节点，而是指向了其他 Web 服务，或者是其他 WAF 防火墙阻断了请求。

:::

::: details 节点通信失败 `Successfully connected to slave node, but slave returns: {具体报错}`

说明主机节点可以连接到从机节点，但是从机节点返回了错误，请根据报错结尾的 `{具体报错}` 排查问题。

- 如果以 `invalid sign` 结尾，说明从机节点的签名验证失败，请检查：
  - 从机节点配置文件中的`[Slave]` 下的 `Secret` 配置是否与管理面面板中该节点的 `从机密钥` 配置一致。修改一致后重启从机节点。
  - 从机节点与主机节点之间的系统时间是否相差较大，如果是，请同步时间。
- 如果以 `Master: 4.x.x., Slave: 4.x.x.` 结尾，说明从机节点与主机节点的 Cloudreve 版本不一致，请更换从机 Cloudreve 到与主机节点相同的版本。
- 如果以 `but slave returns: Get "xxx/api/v4/site/ping"` 或者 `but slave returns: invalid character '<' looking for beginning of value` 结尾，说明从机节点无法与主机节点通信，请检查：
  - 主机节点 `参数设置` -> `站点信息` -> `站点 URL` 中的 `主要` 站点 URL 是否正确，从机需要能够访问到这个地址。
  - 检查从机与主机之间的网络通信，是否有防火墙阻断。

:::

::: details 从机执行任务时，任务执行失败或部分失败。

失败的原因有很多，你可以通过查询从机的日志来找到具体的失败原因。先在主机 Cloudreve 管理面板中找到失败的任务，通过任务的 `请求 ID` 在从机日志中搜索与此任务相关的日志。比较常见的原因有：任务超时、网络波动等。

从机节点的任务队列默认配置如下：

| 配置项       | 值       |
| ------------ | -------- |
| 工作线程数   | 15       |
| 最大执行时间 | 86400 秒 |
| 退避因子     | 4        |
| 最大退避时间 | 3600 秒  |
| 重试延迟     | 5 秒     |
| 最大重试次数 | 5        |

如果你认为以上默认配置导致了任务的失败，请参考 [从机节点配置覆盖](../overview/configure#slave-node-configuration-override) 章节，修改配置。

:::
