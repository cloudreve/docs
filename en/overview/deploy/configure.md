# Next Steps {#next-steps}

This page lists some recommended subsequent deployment steps. Although not mandatory, we still recommend that you complete these steps.

## Configure Reverse Proxy {#configure-reverse-proxy}

In the previous process, the Cloudreve instance you deployed can only be accessed via `http://<your-server-ip>:5212`, where users directly access Cloudreve's built-in web server. You can continue to use this method for personal use or small-scale scenarios, but if you need to deploy Cloudreve to the public internet, we recommend configuring a reverse proxy, which can give you more configuration options, such as logging, SSL, WAF, etc.

You need to create a new virtual host in your web server, complete the required configurations (such as enabling HTTPS), and then add reverse proxy rules to the website configuration file:

:::tabs

== Nginx

Add the following configuration to the `server` block:

```nginx
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host; # Important, the Host header must be presented for some Cloudreve features to work properly.
    proxy_redirect off;
    proxy_pass http://127.0.0.1:5212; # Please replace this line with the actual address of your Cloudreve instance.

    # Set maximum file upload size, uncomment if needed.
    # Theoretically, the chunk size of the local storage policy, the maximum upload size of WebDAV, and the maximum upload size of the transfer service should not exceed the setting here.
    # client_max_body_size 20000m;
}
```

== Caddy

Add the following configuration to the `Caddyfile`:

```caddy
reverse_proxy 127.0.0.1:5212
```

== Apache

Add `ProxyPass` configuration to the `VirtualHost` block:

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

### Configure SSL for Built-in Web Server {#configure-ssl-for-built-in-web-server}

If you don't want to use a reverse proxy but still want to use SSL, you can use Cloudreve's built-in web server and configure SSL. Edit the `data/config.ini` file and add the following configuration:

```ini
[SSL]
Listen = :443
CertPath = /path/to/your/fullchain.pem ; Certificate file path
KeyPath = /path/to/your/privkey.pem ; Private key file path
```

### Deliver Client Real IP {#deliver-client-real-ip}

Cloudreve's event logging feature will attempt to record the client's real IP, but if you use a reverse proxy, the real IP will be overwritten in the `X-Forwarded-For` header, causing incorrect log records. You can add the `ProxyHeader` configuration to the `data/config.ini` file to let Cloudreve extract the real IP from the `X-Forwarded-For` header:

```ini{4}
[System]
Mode = master
Listen = :5212
ProxyHeader = X-Forwarded-For
```

If you have also configured a CDN service outside the reverse proxy, please refer to the CDN service provider's documentation on how to deliver the real IP. For example, with Cloudflare and Nginx, you need to use the [`ngx_http_realip_module` module](https://nginx.org/en/docs/http/ngx_http_realip_module.html) to let Nginx extract the real IP from Cloudflare:

```nginx
set_real_ip_from 192.0.2.1 (need to be replaced with the latest Cloudflare IP ranges)
real_ip_header CF-Connecting-IP;
proxy_set_header X-Forwarded-For $realip_remote_addr;
```

For more information and configuration methods for other web servers, please refer to the [Cloudflare documentation](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/).

## Check Cache Configuration {#check-cache}

Cloudreve uses Service Worker to cache static resources. When a user first visits, Cloudreve will fetch static resources and cache them in the local browser. For subsequent visits, Cloudreve will use the local cache to improve access speed. However, after a version update, Cloudreve needs to check `sw.js` to determine whether to update the cache. If your web server incorrectly caches `sw.js`, this will cause users to be unable to update the page cache normally.

Please ensure that the following paths are not cached by the web server:

- `/sw.js`
- `/index.html`
- `/manifest.json`

Some server management panels may add caching configurations similar to the following without your knowledge:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
}
```

Please remove such configurations. Cloudreve's built-in server has already optimized cache control for static resources; such configurations will cause `sw.js` to be incorrectly cached.
