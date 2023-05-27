# 扩展文档预览/编辑

Cloudreve 会通过文件的扩展名自动选择预览器。Cloudreve 内置了多种文件格式的预览器，包括视频、音频、代码、文本、Office 文档等。其中 Office 文档预览器提供了较高的扩展性，你可以在 后台 - 参数设置 - 图像与预览 - 文件预览 中更换默认的文档预览服务地址。也可以通过开启 WOPI 集成，将 Office 文档预览器替换为更强大的预览/编辑器，并自主定义可被预览/编辑的文件扩展名。本文将介绍三种支持 WOPI 协议的服务的部署及对接方式。你也可以通过实现自己的 WOPI 客户端，扩展 Cloudreve 的预览编辑能力（不仅限于 Office 文档）。

## Collabora Online (LibreOffice Online)

使用 Docker 部署 Collabora Online（[官方文档](https://sdk.collaboraonline.com/docs/installation/CODE\_Docker\_image.html#code-docker-image)）：

```sh
docker pull collabora/code

docker run -t -d -p 127.0.0.1:9980:9980 \
           -e "aliasgroup1=<允许使用此服务的 Cloudreve 地址，包含明确端口>" \
           -e "username=<面板管理员用户名>" \
           -e "password=<面板管理员密码>" \
           --name code --restart always collabora/code
```

以官方演示站为例：

```sh
docker run -t -d -p 127.0.0.1:9980:9980 \
           -e "aliasgroup1=https://demo.cloudreve.org:443" \
           -e "username=<面板管理员用户名>" \
           -e "password=<面板管理员密码>" \
           --name code --restart always collabora/code
```

Container 启动后，配置 Nginx 或其他 Web 服务器反向代理 `https://127.0.0.1:9980`, 可参考 [Proxy settings](https://sdk.collaboraonline.com/docs/installation/Proxy\_settings.html)，确保反代后的服务能够被你的最终用户访问，你可以手动访问 `<你的服务主机>/hosting/discovery` 来确认是否返回了预期的 XML 响应。

在 后台 - 参数设置 - 图像与预览 - 文件预览 - WOPI 客户端 中开启 `使用 WOPI` 并在 `WOPI Discovery Endpoint` 中填入`<你的服务主机>/hosting/discovery`。保存后可在前台测试文档预览和编辑：

<figure><img src="../.gitbook/assets/截屏2023-02-10 11.17.52.png" alt=""><figcaption></figcaption></figure>

## OnlyOffice

OnlyOffice 在 6.4 版本后支持了 WOPI 协议，请参考 官方文档 部署你的 [OnlyOffice](https://helpcenter.onlyoffice.com/) 实例。推荐使用 [Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer) 来快速部署。

参考 [官方文档](https://helpcenter.onlyoffice.com/installation/docs-developer-configuring.aspx#WOPI) 配置 OnlyOffice 开启 WOPI 功能。如果使用 Docker，可在创建 Contianer 时指定 `WOPI_ENABLED` 为 `true` 来开启：

```sh
docker run -i -t -d -p 8080:80 -e WOPI_ENABLED=true onlyoffice/documentserver
```

你可以手动访问 `<你的 OnlyOffice 主机>/hosting/discovery` 来确认是否返回了预期的 XML 响应。

在 后台 - 参数设置 - 图像与预览 - 文件预览 - WOPI 客户端 中开启 `使用 WOPI` 并在 `WOPI Discovery Endpoint` 中填入`<你的服务主机>/hosting/discovery`。保存后可在前台测试文档预览和编辑：

<figure><img src="../.gitbook/assets/截屏2023-02-10 11.49.56.png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
OnlyOffice 不支持过滤 WOPI 请求来源，如果你有对公使用需求，请通过外部应用防火墙检查预览页面请求中 `wopisrc` 参数是否为预期的 Cloudreve 站点。
{% endhint %}

## Office Online Server (On-Prem)

[Office Online Server](https://learn.microsoft.com/en-us/officeonlineserver/office-online-server) 是微软推出的可私有部署的 Office 在线文档服务。请参考 [官方文档](https://learn.microsoft.com/en-us/officeonlineserver/deploy-office-online-server) 在你的 Windows Server 上部署。

你可以手动访问 `<你的 OnlyOffice 主机>/hosting/discovery` 来确认是否返回了预期的 XML 响应。

在 后台 - 参数设置 - 图像与预览 - 文件预览 - WOPI 客户端 中开启 `使用 WOPI` 并在 `WOPI Discovery Endpoint` 中填入`<你的服务主机>/hosting/discovery`。保存后可在前台测试文档预览和编辑：

<figure><img src="../.gitbook/assets/IMG_8653 (1).PNG" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
Office Online Server 不支持过滤 WOPI 请求来源，如果你有对公使用需求，请通过外部应用防火墙检查预览页面请求中 `wopisrc` 参数是否为预期的 Cloudreve 站点。
{% endhint %}

## WOPI 协议

Web Application Open Platform Interface (WOPI) 协议是一种用于集成 Web 文档编辑器的协议，你可以在 [微软的文档](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/) 中阅读详细的协议定义。Cloudreve 可以对接实现了 WOPI 协议的文档处理服务，用于扩展已有的文档预览和编辑能力。

### 兼容性

Cloudreve 对 WOPI REST 方法的实现情况如下表所示：

<table><thead><tr><th width="318">Method</th><th>支持情况</th></tr></thead><tbody><tr><td>CheckFileInfo</td><td>✅</td></tr><tr><td>GetFile</td><td>✅</td></tr><tr><td>Lock</td><td>⚠️（可调用但无效果）</td></tr><tr><td>RefreshLock</td><td>⚠️（可调用但无效果）</td></tr><tr><td>Unlock</td><td>⚠️（可调用但无效果）</td></tr><tr><td>PutFile</td><td>✅</td></tr><tr><td>PutRelativeFile</td><td>❌</td></tr><tr><td>RenameFile</td><td>✅</td></tr></tbody></table>
