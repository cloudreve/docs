## 安装

本文将会介绍Cloudreve在不同场景下的安装方式，请根据您的情况按照说明进行操作，如果遇到麻烦，请仔细核对步骤是否正确。

## 安装前的准备

#### 选择部署环境

Cloudreve目前支持在虚拟主机、独立服务器、Docker等虚拟环境中安装，但Cloudreve的正常运行对部署环境有着一定的要求。Cloudreve的基本运行环境为`Apache/nginx` +` MySQL` + `PHP`，对于日后不同的使用需求，可能还需要增加新的要求。

#### 环境检查

此处列出的仅为基本要求，后续安装时还需要进行额外项目检查。

| 检查项                        | 要求                         | 说明                                      | 不满足的解决方案                                             |
| :---------------------------- | :--------------------------- | :---------------------------------------- | :----------------------------------------------------------- |
| PHP版本                       | 大于或等于5.6                | 满足Cloudreve基本需求的最低PHP版本为5.6   | 升级PHP版本                                                  |
| MySQL版本                     | 大于或等于5.5.3              | 满足Cloudreve基本需求的最低MySQL版本为5.6 | 升级MySQL版本                                                |
| 服务器程序(`nginx/Apache` 等) | 启用`UrlRewrite`相关模块     | 用于URL重写(伪静态)                       | `Apache`:启用`url_rewrite`模块；`nginx`：无需启用新模块，但是需进行后续额外配置（见后文） |
| php扩展                       | 启用`fileinfo`、`curl`、`gd` | 用于处理文件输出、网络请求、验证码生成    | 安装并启用相关扩展                                           |

#### 选择Cloudreve版本

Cloudreve目前有开发版和稳定版。其中开发版更新较快、潜在Bug较多、新特性较多；稳定版更新则相对缓慢。目前Cloudreve仍处于起步状态，因此仍推荐你选择开发版以获得较快的Bug修复、功能更新速度。

#### 选择安装方式

Cloudreve可以通过完整安装包、Composer、Docker进行安装，您可以根据喜好及需求选择安装方式。其中使用Composer安装全程可在命令行下进行，完整安装包安装可使用WebUI操作。

## 开始安装

选择以下任意一种方式开始安装。

#### 使用完整安装包安装

> Cloudreve在每个`commit`后都会自动打包安装包，其中已包含依赖库、静态资源，安装步骤较为简单，也是我们推荐的方式。

1. 前往[安装包发布页](https://cloudreve.org/download.php)下载最新的安装包，解压至您网站的根目录。**注意：目前Cloudreve只支持在根目录下使用；

2. `给runtime`目录写入权限，如果你使用本地存储，`public` 目录及其子目录也需要有写入权限；

3. 配置URL重写，Cloudreve的配置方式与`ThinkPHP`相同，如果遇到麻烦，你也可以参考有关`ThinkPHP`URL重写的配置教程。

   如果您使用的是`Apache`，一般情况下无需进行额外配置，只需要启用`url_rewrite`模块即可。

   如果您使用的是`nginx`，请在网站配置文件中添加以下内容：

   ```
   location / {
      if (!-e $request_filename) {
      rewrite  ^(.*)$  /index.php?s=/$1  last;
      break;
       }
    }
   ```

   如果您使用的是`kangle`，请将程序根目录下`.htaccess`的内容改为：

   ```
   <IfModule mod_rewrite.c>
       RewriteEngine on
       RewriteBase /
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteRule (.*)$ index.php/$1?%{QUERY_STRING} [QSA,PT,L]
   </IfModule>
   ```

   如果您使用的是`IIS`，请先在IIS中安装`urlwrite`，并在程序根目录新建`web.config`，键入以下内容：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?> 
   <configuration> 
     <system.webServer> 
       <rewrite> 
         <rules> 
           <rule name="WPurls" enabled="true" stopProcessing="true"> 
             <match url=".*" /> 
             <conditions logicalGrouping="MatchAll"> 
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /> 
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /> 
             </conditions> 
             <action type="Rewrite" url="index.php/{R:0}" /> 
           </rule> 
         </rules> 
       </rewrite> 
     </system.webServer> 
   </configuration>  
   ```

4. 前往`您的域名/CloudreveInstaller`进行环境检查、填写数据库信息并导入数据库；
5. 安装完成后还需要进行后续操作，请参考[后续操作](install?id=后续操作)章节。

#### 使用`Composer`安装

`Composer`为PHP的包管理器，你可以使用`Composer`在命令行环境下进行安装。

1. 安装`Composer`；

   执行以下命令：

   ```
   curl -sS https://getcomposer.org/installer | php
   mv composer.phar /usr/local/bin/composer
   ```

   详细安装说明请参阅http://docs.phpcomposer.com/00-intro.html

2. 如果您的服务器在国内，由于众所周知的原因，您可能需要切换至[Composer中国全量镜像](https://pkg.phpcomposer.com/)以加快安装速度；

3. 在空白的网站根目录下执行

   ```
   composer create-project hfo4/cloudreve:dev-master ./
   ```

   此命令会下载所需依赖并安装开发版的Cloudreve。

4. 等待安装依赖库后，会自动执行安装脚本，按照提示输入数据库账户信息。在此过程中，请给`runtime`目录写入权限，如果你使用本地存储，`public` 目录及其子目录也需要有写入权限；在安装过程中还额外需要`application` `static`目录的写入权限，但这两个目录在安装后就可以恢复原有权限配置；

   ```
      ___ _                 _                    
     / __\ | ___  _   _  __| |_ __ _____   _____ 
    / /  | |/ _ \| | | |/ _` | '__/ _ \ \ / / _ \
   / /___| | (_) | |_| | (_| | | |  __/\ V /  __/
   \____/|_|\___/ \__,_|\__,_|_|  \___| \_/ \___|
           
                   Ver XX
   ================================================
   #按提示输入信息
   ......
   ```

5. 出现以下提示即表明安装完成：

   ```
   Congratulations! Cloudreve has been installed successfully.
   
   Here's some informatioin about yor Cloudreve:
   Homepage: https://pan.aoaoao.me/
   Admin Panel: https://pan.aoaoao.me/Admin
   Default username: admin@cloudreve.org
   Default password: admin
   ```

6. 按照[使用完整安装包安装](install?id=%e4%bd%bf%e7%94%a8%e5%ae%8c%e6%95%b4%e5%ae%89%e8%a3%85%e5%8c%85%e5%ae%89%e8%a3%85)章节中第3步的说明配置URL重写规则；

7. 安装完成后还需要进行后续操作，请参考[后续操作](install?id=后续操作)章节。

#### 使用Docker安装

你可以使用由 [@ilemonrain](https://bitbucket.org/ilemonrain/) 维护的Docker镜像：<https://hub.docker.com/r/ilemonrain/cloudreve/>

## 后续操作

安装完成后还需要进行一些后续操作以避免奇怪的问题及安全隐患。

以下操作是必须的：

* 登录后台（初始用户名`admin@cloudreve.org` 初始密码 `admin` 后台URl`http://你的域名/Admin`），前往`用户` - `编辑`中修改初始管理员用户的用户名及密码；

* 到`设置` - `基本设置`中检查`站点URL`是否正确（结尾要带`/`，如果站点启用`https`，这里也应保持一致）；

* 添加`Crontab`定时任务：

    ```
    * * * * * curl http://你的域名/Cron
    ```

    如果因为环境设置无法使用`Crontab`，您也可以使用一些免费的网站监控服务。设法让`http://你的域名/Cron`被定期访问即可。

以下操作不是必须的，但仍推荐完成：

* 如果你需要使用二步验证功能，请在程序目录下依次执行`composer require phpgangsta/googleauthenticator:dev-master` `composer require endroid/qrcode`安装二步验证扩展
* 如果你打算使用本地上传策略并且不准备开启外链功能，请将`public/uploads`目录设置为禁止外部访问、禁止脚本执行