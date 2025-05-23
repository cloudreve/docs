# Slave Node Storage {#slave-node}

Through the slave node storage policy, files are stored on other servers also running Cloudreve.

## Configuration {#configure}

### Adding Slave Nodes {#add-slave-node}

Refer to the [Slave Node](../slave-node) section to add storage servers as slave nodes. When used as a storage policy, the slave node's endpoint will be exposed to clients for uploading files, so please ensure this address is accessible to users.

You also need to configure CORS policy for the slave node, otherwise users cannot directly upload through browsers or preview files. Please add the following to the slave's configuration file:

```ini
[CORS]
AllowOrigins = *
AllowMethods = OPTIONS,GET,POST
AllowHeaders = *
```

### File Storage Path {#file-storage-path}

You can modify the `Blob Storage Directory` in the storage policy configuration to specify the file storage path. By default, newly created local storage strategies use the `data/uploads` directory under the same directory as the Cloudreve executable on slave node. You can modify this as needed. If you enter a relative path, it will be relative to the directory where the Cloudreve executable on slave node is located.

> [!TIP]
> If you specified the [`--use-working-dir`](../../overview/cli#global-parameters) parameter in the slave node Cloudreve command line arguments, the relative path of the `Blob Storage Directory` will be relative to the working directory at startup.

### Pre-allocate Disk Space {#pre-allocate-disk-space}

On Linux or macOS, when the `Pre-allocate disk space` option is enabled, Cloudreve will pre-allocate disk space when the upload begins, reducing fragmentation caused by chunk uploads.

## Native Thumbnails {#native-thumbnail}

This section covers the native thumbnail generation method. If you have enabled thumbnail proxy for your storage policy, this section does not apply.

### Thumbnail Cache {#thumbnail-cache}

Thumbnails natively generated by slave nodes are stored with the name `<original Blob filename>._thumb_sidecar` in the same directory as the original Blob file. This cache is not counted towards user capacity and is not visible to users. When the original Blob is deleted, the thumbnail cache will also be deleted.

### Extended Generators {#extended-thumbnail-generator}

By default, slave Cloudreve can only generate native thumbnails for `jpg`, `png`, `gif` and song covers. Similar to the master node, you can extend thumbnail generation capabilities through external tools. Modify the slave configuration file and enable it through [Slave Node Configuration Override](../../overview/configure#slave-node-configuration-override):

```ini
[OptionOverwrite]
# Thumbnail width and height
thumb_width = "400"
thumb_height = "300"
thumb_slave_sidecar_suffix = "._thumb_sidecar" # Thumbnail cache file suffix
thumb_encode_method = "png" # Encoding format
thumb_gc_after_gen = "0" # Immediately recycle memory after generation
thumb_encode_quality = "95" # Quality

# Built-in generator
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

# Song covers
thumb_music_cover_enabled = "1"
thumb_music_cover_exts = "mp3,m4a,ogg,flac"
thumb_music_cover_max_size = "1073741824" # 1 GB
```

Save and restart the slave Cloudreve. Finally, add the newly supported file extensions in `Storage Policy Settings` -> `Thumbnails` -> `File extensions for native thumbnails`.

## Native Media Metadata Extraction {#native-media-metadata-extraction}

This section covers native media metadata extraction. If you have enabled proxy media metadata extraction for your storage policy, this section does not apply.

By default, slave Cloudreve can natively extract image EXIF and audio metadata. If you need to extend other extractors, after installing the necessary dependencies, modify the slave configuration file and enable it through [Slave Node Configuration Override](../../overview/configure#slave-node-configuration-override):

```ini
[OptionOverwrite]
media_meta_ffprobe = "1"
media_meta_ffprobe_path = "ffprobe"
media_meta_ffprobe_size_local = "0"
media_meta_ffprobe_size_remote = "0"
```

Save and restart the slave Cloudreve. Finally, add the newly supported file extensions in `Storage Policy Settings` -> `Extract media metadata` -> `Enabled file extensions for native extractors`.

## FAQ {#faq}

::: details File upload fails with the error "Cannot parse response".

1. Expand the detailed error and check if it contains the phrase `413 Request Entity Too Large`.

   If so, please modify the slave Nginx reverse proxy configuration, set or increase the value of `client_max_body_size`, for example `client_max_body_size 20000m;`. If chunk upload is enabled, this value should be larger than the chunk size; if chunk upload is not enabled, this value should be larger than the upload file size.

2. Check if the slave has an external WAF firewall blocking the upload request.
3. Ensure that the slave address you use in the node configuration can be directly accessed by users.

:::

::: details File cannot be downloaded, and the thumbnail is also not visible.

1. Check if the system time on slave node is significantly different from the client time. If so, please synchronize the time and then try downloading again by clicking the `Clear Blob URL Cache` button at the bottom of the `Filesystem` page in the `Settings`.
2. If you are using Cloudflare, please check that the `Cache Level` is set to `Standard`.

:::
