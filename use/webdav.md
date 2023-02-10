# WebDAV

WebDAV 是一种基于 HTTP 协议的文件传输协议，如今有许多第三方文件管理器、视频播放器等产品都支持通过 WebDAV 协议访问 Cloudreve 中的文件，你可以借此实现跨平台的文件共享与同步。

要使用 WebDAV，请先前往后台管理面板为对应用户组开启 WebDAV 使用权限。WebDAV 所使用的账号与 Cloudreve 账号**并不互通**，需要单独创建。前往前台 导航左侧 - WebDAV - 创建新账号 创建供 WebDAV 使用的账号信息。创建完成后系统会为此账号自动生成密码，使用 WebDAV 时请使用注册邮箱作为账号名，密码则为上述系统所生成的密码。

创建 WebDAV 账号时，你可以为此账号指定相对根目录，此账号只能通过 WebDAV 访问所指定相对根目录下的目录及文件。对于捐助版，用户还可以为不同目录挂载不同的存储策略，在 WebDAV 下上传新文件时会优先使用为目录挂载的存储策略。

## 常见客户端使用说明

### 使用 Windows 资源管理器(不推荐)

{% hint style="info" %}
使用这种方式前，请确保你的 Cloudreve 站点已启用 HTTPS。如果需要在非 HTTPS 协议下添加，需要修改注册表`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WebClient\Parameters` 将`BasicAuthLevel` 的值改为`2`。
{% endhint %}

在 “此电脑”空白处右键，选择“添加一个网络位置”：

![](<../.gitbook/assets/image (1) (1) (1).png>)

输入站点 WebDAV 连接地址，一般格式为`https://您的域名/dav`，填写完成后输入您的 Cloudreve 账号和系统生成的账号密码即可。

已知问题：重启后无法访问已添加的 WebDAV 挂载，需要重新输入账号密码。这是由于 Windows 不再支持 BasicAuth 下存储 WebDAV 账号及密码信息 ([相关说明](https://docs.microsoft.com/en-us/troubleshoot/windows-client/networking/cannot-automatically-reconnect-dav-share))。Cloudreve 会在后续版本中更换 WebDAV 验证方式以改善此问题。

****
