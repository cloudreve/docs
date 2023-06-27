# Compared

Transit Cloudreve supports a variety of underlying storage strategies, but due to various factors such as API restrictions, Cloudreve does not support each strategy at the same level. This chapter will list the specific support differences between different storage strategies in detail.

## Basic comparison



|           |       Local          |       Slave          |         Qiniu        |          OSS         |          COS         |Shoot the clouds again |       OneDrive       | S3                   |
| --------- | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | -------------------- |
| upload     | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Multipart upload      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |          :x:         |          :x:         | :white\_check\_mark: | :white\_check\_mark: |
| download        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| copy        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| move        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| normal preview      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Office preview| :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| delete        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| thumbnail       | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :x:                  |
| Download package      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| real file name download   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: |
| theoretical maximum file    |          Unlimited          |          Unlimited          |          Unlimited          |          Unlimited          |         5 GB         |        150 GB        |        250 GB        | Unlimited                   |
| Public network access requirements    |           None          |           None          |          Required          |          Required          |          Required          |          Required          |          Required          | Required                   |
| available for public use   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |       subject to ToS       | :x:                  |

## Advanced Features

|           |       Local          |       Slave          |         Qiniu        |          OSS         |          COS         |Shoot the clouds again |       OneDrive       | S3                   |
| -------- | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | -------------------- |
| offline download     | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| download speed limit     | :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: | :white\_check\_mark: |          :x:         |          :x:         | :x:                  |
| Transit direct chain is permanently effective | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| The original straight chain is permanently valid | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: |
| unzip      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| compression       | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
|          |                      |                      |                      |                      |                      |                      |                      |                      |

## traffic path

|           |       Local          |       Slave          |         Qiniu        |          OSS         |          COS         |Shoot the clouds again |       OneDrive       | S3                   |
| ----------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Web Upload Client Direct | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| download direct        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Package download/compress/decompress| direct pass                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   |
| offline download        | direct pass                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   |
| Text Editor        | direct pass                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   | transit                   |
| WebDAV upload direct | :white\_check\_mark: | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  |
| WebDAV download direct | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |



