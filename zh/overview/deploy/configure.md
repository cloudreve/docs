# 后续步骤 {#next-steps}

本页面列出了一些推荐的后续部署流程，虽然不是必须的，但我们仍然推荐你完成这些步骤。

## 配置反向代理 {#configure-reverse-proxy}

在之前的流程中，你所部署的 Cloudreve 实例只能通过 `http://<your-server-ip>:5212` 访问，用户直接访问 Cloudreve 实例的内建 Web 服务器。你可以在自用或小规模场景下继续使用这种方式，但如果你需要将 Cloudreve 部署到公网，我们推荐你配置反向代理，这可以让你有更丰富的配置选项，如日志、SSL、WAF 等。

你需要在 Web 服务器中新建一个虚拟主机，完成所需的各项配置（如启用 HTTPS），然后在网站配置文件中加入反代规则：

:::tabs

== Nginx

在 `server` 块中加入以下配置：

```nginx
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host; # 重要，必须呈递 Host 头才能让 Cloudreve 的某些功能正常工作。
    proxy_redirect off;
    proxy_pass http://127.0.0.1:5212; # 请将此行替换为你的 Cloudreve 实例的实际地址。

    # 设置最大文件上传大小，如需设置清取消注释。
    # 理论上后续本机存储策略的分片大小、WebDAV 最大上传大小、中转服务最大上传大小不得大于这里的设定。
    # client_max_body_size 20000m;
}
```

== Caddy

在 `Caddyfile` 中加入以下配置：

```caddy
reverse_proxy 127.0.0.1:5212
```

== Apache

在 `VirtualHost` 块中加入 `ProxyPass` 配置：

```apache{6,7}
<VirtualHost *:80>
    ServerName myapp.example.com
    ServerAdmin webmaster@example.com
    DocumentRoot /www/myapp/public

    AllowEncodedSlashes NoDecode
    ProxyPass "/" "http://127.0.0.1:5212/" nocanon
</VirtualHost>
```

:::

### 为内建 Web 服务器配置 SSL {#configure-ssl-for-built-in-web-server}

如果你不想使用反向代理，但又想使用 SSL，你可以使用 Cloudreve 内建的 Web 服务器，并配置 SSL。编辑 `data/config.ini` 文件，加入以下配置：

```ini
[SSL]
Listen = :443
CertPath = /path/to/your/fullchain.pem ; 证书文件路径
KeyPath = /path/to/your/privkey.pem ; 私钥文件路径
```

### 呈递客户端真实 IP {#deliver-client-real-ip}

Cloudreve 的事件日志功能会尝试记录客户端的真实 IP，但如果你使用反向代理，真实 IP 会被覆写在 `X-Forwarded-For` 头中，导致日志记录错误。你可以在 `data/config.ini` 文件中加入 `ProxyHeader` 配置，让 Cloudreve 从 `X-Forwarded-For` 头中提取真实 IP：

```ini{4}
[System]
Mode = master
Listen = :5212
ProxyHeader = X-Forwarded-For
```

如果你在反向代理服务外又配置了 CDN 服务，请参考 CDN 服务商文档如何呈递真实 IP。以 Cloudflare 和 Nginx 为例，你需要配合使用 [`ngx_http_realip_module` 模块](https://nginx.org/en/docs/http/ngx_http_realip_module.html)，让 Nginx 从 Cloudflare 提取真实 IP：

```nginx
set_real_ip_from 192.0.2.1 （需要替换为最新的 Cloudflare IP 段）
real_ip_header CF-Connecting-IP;
proxy_set_header X-Forwarded-For $realip_remote_addr;
```

更多信息和其他 Web 服务器的配置方式，请参考 [Cloudflare 文档](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/)。

## 检查缓存配置 {#check-cache}

Cloudreve 使用了 Service Worker 来缓存静态资源，当用户首次访问时，Cloudreve 会拉取静态资源并缓存到本地浏览器，后续用户访问时，Cloudreve 会直接使用本地缓存，从而提高访问速度。但是在版本更新后，Cloudreve 需要检查 `sw.js` 来决定是否需要更新缓存。如果你的 Web 服务器错误地缓存了 `sw.js`，这会导致用户无法正常更新页面缓存。

请确保下列路径没有被 Web 服务器缓存：

- `/sw.js`
- `/index.html`
- `/manifest.json`

某些服务器管理面板可能会自作主张加入类似下面的缓存配置：

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
}
```

请将上述配置删除，Cloudreve 内建服务器已经对静态资源的缓存控制进行了优化，这样的配置会导致 `sw.js` 被错误地缓存。
