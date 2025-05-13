# API 介绍

Cloudreve 服务端提供 RESTful API 接口，您可以通过这些接口实现对 Cloudreve 的文件管理、用户管理、系统管理等操作。

## 路由 {#routes}

除了少部分特殊重定向路由外，所有 API 路由均以 `/api/v4/` 开头。

## 响应 {#responses}

除了少部分特殊路由外，所有 API 路由均返回 JSON 格式数据，HTTP 响应码固定为 `200`，实际的错误信息通过 `code` 和 `message` 字段返回。

::: tabs

=== 成功

```json
{
  "data": ..., // 任意类型
  "code": 0, // 0 表示无错误
  "msg": ""
}
```

=== 失败

```json
{
  "code": 40001, // 错误码
  "msg": "Bad Request", // 错误信息
  "error": "Bad Request", // 内部错误信息，仅在 Debug 模式下生效
  "correlation_id": "b4351ecc-ee1a-4455-bc94-2c3dbcc58538", // 请求 ID，用于关联日志排查问题
  "data": ... // 某些错误会返回额外的数据
}
```

=== 失败（批量操作）

```json
{
  "code": 40081, // 总体错误码
  "aggregated_error": {
    "cloudreve://my/%E6%96%B0%E6%96%87%E4%BB%B6.docx": {
      "code": 40016, // 子操作错误码
      "msg": "Path not exist", // 子操作错误信息
      "correlation_id": "5b0f5f05-451e-4dcd-9c65-474315dd7d20"
    }
  },
  "msg": "failed to get target file: failed to walk into \"新文件.docx\": Path not exist: ent: file not found", // 总体错误信息
  "correlation_id": "5b0f5f05-451e-4dcd-9c65-474315dd7d20" // 请求 ID，用于关联日志排查问题
}
```

其中 `aggregated_error` 为操作失败的资源标识和具体错误的映射。

:::

## 错误代码 {#error-codes}

错误代码的定义可以在 [`error.go`](https://github.com/cloudreve/Cloudreve/blob/master/pkg/serializer/error.go) 文件中找到。以下为参考列表：

| Code  | Description                               |
| ----- | ----------------------------------------- |
| 203   | Not Fully Successful                      |
| 401   | Not Logged In                             |
| 403   | No Permission to Access                   |
| 404   | Resource Not Found                        |
| 409   | Resource Conflict                         |
| 40001 | Parameter Error                           |
| 40002 | Upload Failed                             |
| 40003 | Folder Creation Failed                    |
| 40004 | Object Already Exists                     |
| 40005 | Signature Expired                         |
| 40006 | Current Storage Policy Not Allowed        |
| 40007 | User Group Not Allowed for This Operation |
| 40008 | Admin Privileges Required                 |
| 40009 | Master Node Not Registered                |
| 40010 | Phone Binding Required                    |
| 40011 | Upload Session Expired                    |
| 40012 | Invalid Chunk Index                       |
| 40013 | Invalid Content Length                    |
| 40014 | Batch Source Size Limit Exceeded          |
| 40015 | Maximum Aria2 Task Limit Exceeded         |
| 40016 | Parent Directory Does Not Exist           |
| 40017 | User Banned                               |
| 40018 | User Not Activated                        |
| 40019 | Feature Not Enabled                       |
| 40020 | Invalid Credentials                       |
| 40021 | User Not Found                            |
| 40022 | 2FA Code Error                            |
| 40023 | Login Session Does Not Exist              |
| 40024 | Cannot Initialize WebAuthn                |
| 40025 | Invalid WebAuthn Credential               |
| 40026 | Captcha Error                             |
| 40027 | Captcha Refresh Needed                    |
| 40028 | Failed to Send Email                      |
| 40029 | Invalid Temporary Link                    |
| 40030 | Temporary Link Expired                    |
| 40031 | Email Provider Banned                     |
| 40032 | Email Already Exists                      |
| 40033 | Email Has Been Resent                     |
| 40034 | User Cannot Be Activated                  |
| 40035 | Storage Policy Does Not Exist             |
| 40036 | Cannot Delete Default Storage Policy      |
| 40037 | Storage Policy Still Has Files            |
| 40038 | Storage Policy Bound to User Groups       |
| 40039 | User Group Not Found                      |
| 40040 | Invalid Action on System Group            |
| 40041 | User Group in Use                         |
| 40042 | Cannot Change Group for Default User      |
| 40043 | Invalid Action on Default User            |
| 40044 | File Not Found                            |
| 40045 | Failed to List Files                      |
| 40046 | Invalid Action on System Node             |
| 40047 | Failed to Create File System              |
| 40048 | Failed to Create Task                     |
| 40049 | File Too Large                            |
| 40050 | File Type Not Allowed                     |
| 40051 | Insufficient User Capacity                |
| 40052 | Illegal Object Name                       |
| 40053 | Root Directory Protected                  |
| 40054 | File with Same Name Being Uploaded        |
| 40055 | Metadata Mismatch                         |
| 40056 | Unsupported Archive Type                  |
| 40057 | Available Storage Policy Changed          |
| 40058 | Share Link Not Found                      |
| 40059 | Cannot Save Own Share                     |
| 40060 | Slave Cannot Send Callback to Master      |
| 40061 | Cloudreve Version Mismatch                |
| 40062 | Insufficient Credit                       |
| 40063 | Group Conflict                            |
| 40064 | Already in Current User Group             |
| 40065 | Invalid Gift Code                         |
| 40066 | Account Already Bound                     |
| 40067 | Account Bound to Another User             |
| 40068 | Account Not Linked                        |
| 40069 | Incorrect Password                        |
| 40070 | Share Preview Disabled                    |
| 40071 | Invalid Signature                         |
| 40072 | Admin Cannot Purchase User Group          |
| 40073 | Lock Conflict                             |
| 40074 | Too Many URIs                             |
| 40075 | Lock Token Expired                        |
| 40076 | Current Version is Stale                  |
| 40077 | Entity Does Not Exist                     |
| 40078 | File is in Recycle Bin                    |
| 40079 | File Count Limit Reached                  |
| 40080 | Invalid Password                          |
| 40081 | Batch Operation Not Fully Completed       |
| 40082 | Owner Operation Only                      |
| 40083 | Purchase Required                         |
| 40084 | Managed Account Minimum OpenID            |
| 40085 | Amount Too Small                          |
| 40086 | Node Used by Storage Policy               |
| 40087 | Domain Not Licensed                       |
| 50001 | Database Operation Failed                 |
| 50002 | Encryption Failed                         |
| 50004 | IO Operation Failed                       |
| 50005 | Internal Setting Parameter Error          |
| 50006 | Cache Operation Failed                    |
| 50007 | Callback Failed                           |
| 50008 | Failed to Update Backend Settings         |
| 50009 | Failed to Add CORS Policy                 |
| 50010 | Node Offline                              |
| 50011 | Failed to Query File Metadata             |
