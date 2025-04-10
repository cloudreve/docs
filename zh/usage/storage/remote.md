# 从机存储 {#slave-node}

通过从机存储策略，将文件存储到同样运行了 Cloudreve 的其他服务器上。

## 配置 {#configure}

### 添加从机节点 {#add-slave-node}

参考 [从机节点](../slave-node) 章节，将需要使用的存储服务器添加为从机节点。作为存储策略使用时，从机节点的地址会暴露给用户端用于上传文件，请确保此地址可以被用户访问。

你还需要为从机节点配置跨域策略，否则用户无法通过浏览器直传或预览文件。请在从机的配置文件中加入:

```ini
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
```

### 文件存储路径 {#file-storage-path}

你可以在存储策略配置中，修改 `Blob 存储目录` 来指定文件存储路径。默认情况下，新建的从机存储策略会使用从机节点 Cloudreve 程序同级目录下的 `data/uploads` 目录，你可以根据需要修改。如果填写相对路径，此路径也是相对于从机节点 Cloudreve 程序的所在的目录。

> [!TIP]
> 如果你在启动从机节点 Cloudreve 时指定了 [`--use-working-dir`](../../overview/cli#global-parameters) 参数，相对路径的 `Blob 存储目录` 会相对于启动时的工作目录。

### 预分配硬盘空间 {#pre-allocate-disk-space}

在 Linux 或 macOS 系统上，开启 `预分配硬盘空间` 选项后，Cloudreve 会在上传开始时预分配硬盘空间，减少分片上传产生的碎片。

## 原生缩略图 {#native-thumbnail}

本章节介绍的是原生缩略图的生成方式。如果你为存储策略开启了缩略图代理，本章节的内容并不适用。

### 缩略图缓存 {#thumbnail-cache}

从机原生生成的缩略图会以 `<原始 Blob 文件名>._thumb_sidecar` 的名称存放在与原始 Blob 文件相同的目录下。此缓存不会被计入用户容量，且对用户不可见。原始 Blob 删除后，缩略图缓存也会被删除。

### 扩展生成器 {#extended-thumbnail-generator}

默认情况下，从机 Cloudreve 只能为 `jpg`， `png`， `gif` 和歌曲封面生成原生缩略图。与主机类似，你可以通过外部工具扩展缩略图生成能力。修改从机配置文件，通过 [从机节点配置覆盖](../../overview/configure#slave-node-configuration-override) 来启用：

```ini
[OptionOverwrite]
# 缩略图宽度和高度
thumb_width = "400"
thumb_height = "300"
thumb_slave_sidecar_suffix = "._thumb_sidecar" # 缩略图缓存文件后缀
thumb_encode_method = "png" # 编码格式
thumb_gc_after_gen = "0" # 生成完成后立即回收内存
thumb_encode_quality = "95" # 质量

# 内置生成器
thumb_builtin_enabled = "1"
thumb_builtin_max_size = "78643200"

# VIPS
thumb_vips_max_size = "78643200"
thumb_vips_enabled = "1"
thumb_vips_exts = "3fr,ari,arw,bay,braw,crw,cr2,cr3,cap,data,dcs,dcr,dng,drf,eip,erf,fff,gpr,iiq,k25,kdc,mdc,mef,mos,mrw,nef,nrw,obm,orf,pef,ptx,pxn,r3d,raf,raw,rwl,rw2,rwz,sr2,srf,srw,tif,x3f,csv,mat,img,hdr,pbm,pgm,ppm,pfm,pnm,svg,svgz,j2k,jp2,jpt,j2c,jpc,gif,png,jpg,jpeg,jpe,webp,tif,tiff,fits,fit,fts,exr,jxl,pdf,heic,heif,avif,svs,vms,vmu,ndpi,scn,mrxs,svslide,bif,raw"
thumb_vips_path = "vips"

# FFMpeg
thumb_ffmpeg_enabled = "1"
thumb_ffmpeg_path = "ffmpeg"
thumb_ffmpeg_max_size = "10737418240"
thumb_ffmpeg_exts = "3g2,3gp,asf,asx,avi,divx,flv,m2ts,m2v,m4v,mkv,mov,mp4,mpeg,mpg,mts,mxf,ogv,rm,swf,webm,wmv"
thumb_ffmpeg_seek = "00:00:01.00"

## LibreOffice
thumb_libreoffice_enabled = "1"
thumb_libreoffice_path = "soffice"
thumb_libreoffice_max_size = "78643200" # 75 MB
thumb_libreoffice_exts = "txt,pdf,md,ods,ots,fods,uos,xlsx,xml,xls,xlt,dif,dbf,html,slk,csv,xlsm,docx,dotx,doc,dot,rtf,xlsm,xlst,xls,xlw,xlc,xlt,pptx,ppsx,potx,pomx,ppt,pps,ppm,pot,pom"

# 歌曲封面
thumb_music_cover_enabled = "1"
thumb_music_cover_exts = "mp3,m4a,ogg,flac"
thumb_music_cover_max_size = "1073741824" # 1 GB
```

保存后重启从机 Cloudreve。最后在 `存储策略设置` -> `缩略图` -> `使用原生缩略图的扩展名` 中增加新支持的文件扩展名。

## 原生媒体信息提取 {#native-media-metadata-extraction}

本章节介绍的是原生媒体信息提取。如果你为存储策略开启了代理提取媒体信息，本章节的内容并不适用。

默认情况下，从机 Cloudreve 可以原生提取图像 EXIF 和音频元数据。如果你需要扩展其他提取器，请在安装必要依赖后修改从机配置文件，通过 [从机节点配置覆盖](../../overview/configure#slave-node-configuration-override) 来启用：

```ini
[OptionOverwrite]
media_meta_ffprobe = "1"
media_meta_ffprobe_path = "ffprobe"
media_meta_ffprobe_size_local = "0"
media_meta_ffprobe_size_remote = "0"
```

保存后重启从机 Cloudreve。最后在 `存储策略设置` -> `媒体信息提取` -> `使用原生提取器的文件扩展名` 中增加新支持的文件扩展名。

## 常见问题 {#faq}

::: details 文件上传失败，提示 `无法解析响应`。

1. 展开详细错误，检查错误信息中是否含有 `413 Request Entity Too Large` 字样。

   如果有，请修改从机 Nginx 反代配置，设定或增大 `client_max_body_size` 的值，比如 `client_max_body_size 20000m;`。如果开启了分片上传，此值应大于分片大小；如果未开启分片上传，此值应大于上传文件的大小。

2. 检查从机是否有外部 WAF 防火墙拦截了上传请求。
3. 确保你在节点配置中使用的从机地址可以被用户直接访问到。

:::

::: details 上传的文件无法下载，缩略图也看不到。

1. 检查从机时间是否和客户端时间相差较大，如果相差较大，请同步时间，并前往 `管理面板` -> `文件系统`，点击底部的 `清除 Blob URL 缓存` 后重试下载；
2. 如果使用了 Cloudflare，请检查其缓存设置中 `缓存级别` 应设置为 `标准`。

:::
