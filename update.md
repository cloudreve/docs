## 升级

Cloudreve会在每个稳定版本发布的同时，在[release页面](https://github.com/cloudreve/Cloudreve/releases)发布增量更新包，适用于开发版和稳定版。如使用的是开发版，也可以使用`git`更新至最新的版本，无需等待安装包。

#### 使用增量更新包升级

在Cloudreve后台`其他` - `关于`中查看当前版本，在[release页面](https://github.com/cloudreve/Cloudreve/releases)下载与你版本对应的升级包，一般名为`update_patch_for_您当前版本.zip`。

备份当前网站文件、数据库，参考发布说明中的升级说明部分进行升级。一般必须进行的步骤为：覆盖升级包到网站根目录、访问后台首页升级数据库。

注意：每个稳定版发布时，只会发布与其相近版本的旧版升级包，如果您所使用的版本过旧，请以此覆盖过去的升级包以升级至最新版本。

#### 使用`git`手动升级

此种方法适用于开发版并且未对Cloudreve程序进行改动的用户。升级前请确保已安装`git`，并且网站根目录下的`.git`目录未被删除。

在网站根目录下执行以下命令：

```
git pull
```

如果您修改了代码，可能会需要进行合并操作。

[点击这里](https://cloudreve.org/download.php?newestStatic)下载最新的静态资源文件，将其中`static`目录下的所有内容覆盖至网站目录下`stiatic`目录中。

