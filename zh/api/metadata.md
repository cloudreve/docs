# Metadata (元数据) {#metadata}

文件的元数据用于记录文件的附加信息，如音乐的作者、专辑、流派、年份、封面等；也可用于记录辅助性的信息，可能会影响文件的行文和展示。元数据为键值形式，类型统一是字符串。其中键的命名格式为 `<Namespace>:<Key>`。

本章节会介绍其中会影响文件行为和展示的元数据。

## 分享链接快捷方式

文件或目录带有 `sys:shared_redirect` 元数据时，表示该文件或目录是分享链接的快捷方式。打开、下载文件时，请使用 `sys:shared_redirect` 的值作为文件 URI。

`sys:shared_owner` 用于记录分享链接的创建者 ID，可用于在文件图标左下角展示用户的头像角标。

## 上传中

`sys:upload_session_id` 用于记录文件上传的会话 ID，可用于标识仍在上传中的文件。

## 目录颜色

`customize:icon_color` 用于记录自定义目录的图标颜色，其值为 Hex 颜色码。

## 自定义 Emoji 图标

`customize:emoji` 用于记录使用 Emoji 替换的自定义图标，其值为 Emoji 字符串。

## 标签

`tag:<tag_name>` 用于记录文件的标签，其值为标签颜色的 Hex 颜色码。

## 缩略图不可用

`thumb:disabled` 用于标识文件没有缩略图，客户端不应继续尝试请求此文件的缩略图。

## 回收站文件

`sys:restore_uri` 用于记录回收站文件的原始 URI，可从中得到文件的展示名称。

`sys:expected_collect_time` 用于记录回收站文件的预计回收时间的 Unix 秒级时间戳。
