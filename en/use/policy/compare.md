# Compare and Contrast

Cloudreve supports a variety of underlying storage policies, but due to various factors such as API limitations, Cloudreve does not support each policy to the same degree.

## Basic Comparison

| | Local | Slave | Qiniu | OSS | COS | Yubai Cloud | OneDrive | S3 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| Upload | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Download | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Copy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Mobile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| General Preview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Office Preview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Delete | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Thumbnails | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ ✅ | ❌ |
| Packed Downloads | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Real File Name Downloads | ✅ | ✅ | ✅ | ✅ | ✅ ✅ | ❌ | ✅ |
| Theoretical maximum file size | Unlimited | Unlimited | 5GB | 5GB | 150GB | Unknown | Unknown |
| Public Access Requirements | None | None | Required | Required | Required | Required | Required | Required | Required

## Advanced Features

| | Local | Slave | Qiniu | OSS | COS | Yubai Cloud | OneDrive | S3 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| Offline Download | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| Download Speed Limit | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Get direct links | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Decompression | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compression | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| | | | | | | | | | | | | |

## Traffic path

| | Local | Slave | Qiniu | OSS | COS | Yubai Cloud | OneDrive | S3 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Web Upload Client Direct Transfer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | &gt;= 4MB when Direct Transfer | ✅ |
| Download Direct Transfer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅
| download/zip/unzip | direct transfer | transfer | transfer | transfer | transfer | transfer | transfer | transfer | transfer | transfer
| Offline Download | Direct Transfer | Transit | Transit | Transit | Transit | Transit | Transit
| Text Editor | Direct Transfer | Transit | Transit | Transit | Transit | Transit | Transit
| WebDAV Upload Direct Transfer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| WebDAV Download Direct | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅

