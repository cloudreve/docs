# Compare and Contrast

Cloudreve supports a variety of underlying storage policies, but due to various factors such as API limitations, Cloudreve does not support each policy to the same degree, and this section will detail the specific differences in support between different storage policies.

## Basic Comparison

|           |          Local          |          Slave          |          Qiniu          |          OSS         |          COS          |          Yubai Cloud         |       OneDrive       | S3                   |
| --------- | :------------------: | :------------------: | :------------------: | :------------------: | :-------------------: | :------------------: | :------------------: | -------------------- |
| Upload        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Download        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Copy        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Mobile        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| General Preview      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Office Preview | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Delete        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Thumbnails       | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :x:                  |
| Packed Downloads      | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Real File Name Downloads   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |  :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: |
| Theoretical maximum file size    |          Unlimited          |          Unlimited          |          Unlimited          |          5GB         |          5GB          |         150GB        |          Unknown          | Unknown                   |
| Public Access Requirements    |           None          |           None          |          Required          |          Required          |           Required          |          Required          |          Required          | Required                   |

## Advanced Features

|      |          Local          |          Slave          |          Qiniu          |          OSS         |          COS         |          Yubai Cloud         |       OneDrive       | S3                   |
| ---- | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | -------------------- |
| Offline Download | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Download Speed Limit | :white\_check\_mark: | :white\_check\_mark: |          :x:         | :white\_check\_mark: | :white\_check\_mark: |          :x:         |          :x:         | :x:                  |
| Get direct links | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :x:                  |
| Decompression  | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| Compression   | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
|      |                      |                      |                      |                      |                      |                      |                      |                      |

## Traffic path

|             | Local                   | Slave                   | Qiniu                   | OSS                  | COS                  | Yubai Cloud                  | OneDrive             | S3                   |
| ----------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Web Upload Client Direct Transfer | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | >= 4MB when direct transfer           | :white\_check\_mark: |
| Download Direct Transfer        | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |
| download/zip/unzip | direct transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   |
| Offline Download        | direct transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   |
| Text Editor        | direct transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   | transfer                   |
| WebDAV Upload Direct Transfer  | :white\_check\_mark: | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  | :x:                  |
| WebDAV Direct Download | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: | :white\_check\_mark: |


