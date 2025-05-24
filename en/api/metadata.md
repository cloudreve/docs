# Metadata {#metadata}

File metadata is used to record additional information about files, such as the artist, album, genre, year, and cover art for music; it can also be used to record auxiliary information that may affect the file's behavior and presentation. Metadata is in key-value format, and the type is uniformly string. The key naming format is `<Namespace>:<Key>`.

This chapter introduces metadata that affects file behavior and presentation.

## Share Link Shortcut

When a file or directory has the `sys:shared_redirect` metadata, it indicates that the file or directory is a shortcut for a share link. When opening or downloading the file, please use the value of `sys:shared_redirect` as the real file URI.

`sys:shared_owner` is used to record the creator ID of the share link, which can be used to display the user's profile picture badge in the lower left corner of the file icon.

## Uploading

`sys:upload_session_id` is used to record the session ID of a file upload, which can be used to identify files that are still uploading.

## Directory Color

`customize:icon_color` is used to record the icon color of a custom directory, and its value is a Hex color code.

## Custom Emoji Icon

`customize:emoji` is used to record a custom icon replaced with an Emoji, and its value is an Emoji string.

## Tags

`tag:<tag_name>` is used to record file tags, and its value is the Hex color code of the tag color.

## Thumbnail Unavailable

`thumb:disabled` is used to identify files that do not have a thumbnail, and the client should not continue to try to request a thumbnail for this file.

## Trash File

`sys:restore_uri` is used to record the original URI of a trashed file, from which the display name of the file can be obtained.

`sys:expected_collect_time` is used to record the expected collection time of the trashed file as a Unix timestamp in seconds.
