# 缩略图

Cloudreve 支持使用多种缩略图生成器，为不同类型的文件生成缩略图，包括图像、视频、Office 文档。您也可以借助“缩略图代理”功能扩展原本不支持缩略图生成的存储策略。

## 缩略图生成逻辑

### 何时生成

自 3.8.0 开始，Cloudreve 不会在文件上传后立即尝试为其生成缩略图，而是在尝试加载缩略图时生成。这一小节描述了 Cloudreve 会在何时决定加载缩略图。对于每个文件，其缩略图的状态可分为以下三种：

* **未知**：新文件上传后的默认状态。在文件列表查看此文件时，Cloudreve 会尝试生成并展示缩略图，如果失败，则将状态标记为`无缩略图`；如果成功，则将状态标记为`缩略图存在`。
* **缩略图存在：**在文件列表查看此文件时，Cloudreve 会尝试加载缩略图。
* **缩略图不存在：**在文件列表查看此文件时，Cloudreve 不会展示缩略图。

在下列情况下，文件的缩略图状态会被重设为`未知`：

* 文件被转移到其他存储策略；
* 文件被重命名时，处于`缩略图不存在`状态，且文件的扩展名发生变化；
* 文件内容被更新。

### 如何生成

这一小节描述了 Cloudreve 如何为文件生成缩略图。Cloudreve 支持多种缩略图生成器，在生成缩略图时会按照“流水线”模式依此尝试每个生成器，直到有生成器成功返回了缩略图。目前支持的生成器及其尝试顺序如下表所示：

<table><thead><tr><th>生成器</th><th>描述</th><th>不支持的存储策略</th><th width="156">优先级（高到低）</th></tr></thead><tbody><tr><td>存储策略原生</td><td>使用第三方存储策略原生接口生成缩略图，不会产生缩略图文件，只会产生缩略图的 URL 以供重定向。</td><td>本机、S3</td><td>1</td></tr><tr><td>LibreOffice</td><td>使用 LibreOffice 生成 Office 文档的缩略图。这一生成器依赖于任一其他图像生成器（Cloudreve 内置 或 VIPS）。</td><td>除了本机存储外，所有未开启“生成器代理”的其他类型存储策略。</td><td>2</td></tr><tr><td>VIPS</td><td>使用 libvips 处理缩略图图像，支持更多图像格式，资源消耗更低。</td><td>除了本机存储外，所有未开启“生成器代理”的其他类型存储策略。</td><td>3</td></tr><tr><td>FFmpeg</td><td>使用 FFmpeg 生成视频缩略图。</td><td>除了本机存储外，所有未开启“生成器代理”的其他类型存储策略。</td><td>4</td></tr><tr><td>Cloudreve 内置</td><td>无第三方依赖，使用 Cloudreve 内置的图像处理能力，仅支持 PNG、JPEG、GIF 格式的图片。</td><td>除了本机存储外，所有未开启“生成器代理”的其他类型存储策略。</td><td>5</td></tr></tbody></table>

有关各个生成器的详细介绍在后续章节中。

### 生成器代理

默认情况下，所有非本机存储策略只支持使用存储策略原生生成器，这一生成器速度最快，但支持的文件格式有限，某些存储策略（如 S3）甚至根本不支持缩略图生成。你可以在参数设置 - 图像与预览 - 缩略图 - 生成器代理中为这些存储策略开启“生成器代理”。开启后，如果原生生成器无法产生缩略图，Cloudreve 会尝试将文件下载下来后用流水线生成，再将生成的缩略图回传到存储策略。这一过程速度较慢，更适合自用场景，或者是小规模站点。

## 生成器

这一章节将详细介绍各个生成器及配置流程。

### 存储策略原生

在调用此生成器时，Cloudreve 会根据文件扩展及文件大小进行预检查，如果校验失败，Cloudreve 会跳过此生成器。默认的扩展名检查规则是根据各个存储提供商的文档制定，你可以在 专家模式编辑存储策略 - 可生成缩略图的文件扩展名 中覆盖这一规则。这里列出的大小限制独立于 Cloudreve 的缩略图大小统一限制（参数设置 - 图像与预览 - 缩略图 - 基本设置 - 最大原始文件尺寸）。

所有存储策略的默认支持规则如下表：

| 存储策略     | 扩展名                                 | 最大原始文件 | 来源                                                                                                                                                 |
| -------- | ----------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| COS      | JPG、BMP、GIF、PNG、WebP                | 32 MB  | [https://cloud.tencent.com/document/product/436/44893](https://cloud.tencent.com/document/product/436/44893)                                       |
| OneDrive | 不检查扩展名 （直接尝试生成）                     | 不检查大小  | -                                                                                                                                                  |
| OSS      | JPG、PNG、BMP、GIF、WebP、TIFF、HEIC、AVIF | 20 MB  | [https://help.aliyun.com/document\_detail/183902.html](https://help.aliyun.com/document\_detail/183902.html)                                       |
| Qiniu    | PSD、JPG、PNG、GIF、WebP、TIFF、BMP、AVIF  | 20 MB  | [https://developer.qiniu.com/dora/api/basic-processing-images-imageview2](https://developer.qiniu.com/dora/api/basic-processing-images-imageview2) |
| 从机       | PNG、JPG、GIF （可扩展更多生成器，请参阅后续章节）      | 不检查大小  | -                                                                                                                                                  |
| Upyun    | JPG、JPEG、PNG、WebP、GIF、BMP、SVG       | 不检查    | [https://help.upyun.com/knowledge-base/image/](https://help.upyun.com/knowledge-base/image/)                                                       |

要注意的是，上述检查规则只是 Cloudreve 用于判断是否需要跳转到下一生成器，具体能否生成缩略图取决于存储端。

{% hint style="info" %}
#### 从机的原生生成器

从机的原生生成器本质上就是“Cloudreve 内置”生成器。你可以在从机端配置其他生成器，并在存储策略专家模式中覆盖支持的扩展名列表，达到扩展从机原生生成器的效果。

以 VIPS 为例，在从机的配置文件中通过[配置项覆盖](../getting-started/config.md#fu-gai-cong-ji-jie-dian-de-pei-zhi-xiang)开启 VIPS：

```
[OptionOverwrite]
thumb_vips_enabled = 1
thumb_vips_path = vips
thumb_vips_exts = csv,mat,img,hdr,pbm,pgm,ppm,pfm,pnm,svg,svgz,j2k,jp2,jpt,j2c,jpc,gif,png,jpg,jpeg,jpe,webp,tif,tiff,fits,fit,fts,exr,jxl,pdf,heic,heif,avif,svs,vms,vmu,ndpi,scn,mrxs,svslide,bif,raw
```

同理，可以在从机上开启其他生成器：

```
[OptionOverwrite]
thumb_builtin_enabled = 1
thumb_ffmpeg_enabled = 1
thumb_ffmpeg_path = ffmpeg
thumb_ffmpeg_exts = mp4,avi
thumb_ffmpeg_seek = 00:00:01.00
thumb_libreoffice_enabled = 1
thumb_libreoffice_path = soffice
thumb_libreoffice_exts = pptx,docx
```
{% endhint %}

### LibreOffice

主页：[https://www.libreoffice.org/discover/libreoffice/](https://www.libreoffice.org/discover/libreoffice/)

此生成器可以为 Office 文档生成缩略图，需要依赖于其他任一支持图片的生成器（VIPS 或者 Cloudreve 原生）。

以 Ubuntu 为例，安装 LibreOffice：

```sh
sudo apt install libreoffice
```

### VIPS

主页：[https://www.libvips.org/](https://www.libvips.org/)

以 Ubuntu 为例：

```sh
sudo apt install libvips-tools
```

Cloudreve 仅支持 8.5 或更新的 libvips，你可以通过如下命令确认安装的版本：

```sh
vips -v
```

某些较老发行版的包管理器中无最新版本的 libvips，推荐从源代码编译安装最新版：[https://www.libvips.org/install.html](https://www.libvips.org/install.html)

### FFMpeg

主页：[https://ffmpeg.org](https://ffmpeg.org/)

以 Ubuntu 为例：

```shell
sudo apt install ffmpeg
```

### Cloudreve 内置

无需安装第三方库，可直接生成常见图像（PNG、JPEG、GIF）的缩略图。
