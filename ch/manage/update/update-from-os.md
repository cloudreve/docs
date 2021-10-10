# 升级到捐助版

如果您之前使用社区版的 Cloudreve，在获取到捐助版后，您可以在保留数据的前提下升级到捐助版。

### 替换主程序

备份所有数据，将捐助版主程序、授权文件上传并替换到原先的社区版目录下。

### 执行升级脚本

使用 Cloudreve 的命令行参数，运行升级数据库脚本：

{% tabs %}
{% tab title="Linux" %}
```text
./cloudreve --database-script UpgradeToPro
```
{% endtab %}

{% tab title="Windows" %}
```text
cloudreve.exe --database-script UpgradeToPro
```
{% endtab %}
{% endtabs %}



