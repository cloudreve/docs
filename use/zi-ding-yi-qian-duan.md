# 自定义前端

默认情况下，Cloudreve 会使用内置的静态资源文件，包括 HTML 文档、JS 脚本、CSS、图像资源等。如果您需要使用自己个性化修改后的静态资源，请将[前端仓库](https://github.com/cloudreve/frontend)编译编译得到的`build` 目录重命名为`statics` 并置于 Cloudreve 同级目录下，重启 Cloudreve 后生效。

有关前端仓库的构建流程，请参阅以下章节：

{% page-ref page="../getting-started/build.md" %}

{% hint style="warning" %}
请使用与 Cloudreve 主程序版本一致的前端仓库构建，您可以在所使用的 Cloudreve 主仓库的`assets` 子模块找到对应的前端仓库版本。

Pro 版本的前端资源与社区版本不能互相通用。
{% endhint %}

您可以在启动 Cloudreve 时加上`eject` 命令行参数，将内置的静态资源提取到`statics` 目录下：

```bash
./cloudreve -eject
```

