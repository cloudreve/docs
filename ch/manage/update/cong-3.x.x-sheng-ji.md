# 从 3.x.x 升级

V3 版本内升级步骤较为简单，总体流程如下：

1. 备份数据库；
2. 下载或构建最新版本的 Cloudreve；
3. 停止正在运行的 Cloudreve；
4. 将老版本的 Cloudreve 主程序替换为新版本；
5. 启动 Cloudreve；
6. 清空浏览器缓存；
7. 如果你在使用 Cloudreve 从机模式，请将从机节点的 Cloudreve 也替换为相同版本。

{% hint style="info" %}
如果你在老版本使用了自行构建的前端静态资源文件，请使用新版对应的前端仓库代码重新构建。
{% endhint %}
