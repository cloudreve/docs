## 常见问题

这里记录了安装过程中常被问到的问题及解决建议。

#### Composer安装Cloudreve时提示`The requested PHP extension ext-XXX * is missing from your system`

这是PHP扩展未达到要求所致，Cloudreve需要`curl`、`fileinfo`、`gd`扩展支持，请先安装并启用这些扩展。如果您尝试在虚拟主机上安装，请联系您的主机提供商安装以上扩展。

#### 安装成功后页面`404`/`No input file specified`.

URL重写规则未配置好，请参考[开始安装](/docs/#/install?id=%e5%bc%80%e5%a7%8b%e5%ae%89%e8%a3%85)章节进行配置。

#### 安装后首页提示“遇到错误”

请依次检查：

-  `application/database.php`是否存在，如果不存在请手动创建写入数据库信息
-  `runtime`及其子目录是否有写入权限
- 其他原因，编辑`application/config.php`打开debug模式，查看详细报错

#### 安装后所有页面空白

安装方式有误导致前端静态文件缺失。目前Cloudreve代码的主仓库中不含静态文件，直接clone下来安装会有文件缺失。您可以使用官网安装包安装，其中已包含静态文件，或者使用`composer creat-project`命令安装，详情参考[开始安装](/docs/#/install?id=%e5%bc%80%e5%a7%8b%e5%ae%89%e8%a3%85)章节。

如果您不想重新安装，可以参考以下步骤手动补全静态文件：

1. [点击这里](https://cloudreve.org/download.php?newestStatic)下載自动打包的前端静态文件；
2. 将压缩包下`static`目录下的所有文件解压至程序目录下的`static`目录下。

