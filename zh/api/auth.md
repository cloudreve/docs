# 认证方法 {#authentication-methods}

在浏览具体 API 文档时，每个 API 方法下都会标注其认证类型：

![认证方法](./images/auth-methods.png)

认证类型分为以下几种：

- **Auth: None** 不需要认证

  不需要携带 Authorization 头。

- **Auth: JWT Required** 需要认证

  需要携带 Authorization 头，格式为 `Bearer <AccessToken>`。如何获取或生成 `AccessToken` 请参考后文。

- **Auth: JWT Optional** 可选认证

  可选是否携带 Authorization 头。如果携带，请求会以所认证用户的身份执行；如果未携带，请求会以匿名用户身份执行。

## 通过登录获取 AccessToken {#get-access-token-by-login}

### 登录

通过 [Password sign-in](https://cloudrevev4.apifox.cn/password-sign-in-289490586e0) 或其他登录接口登录成功后，会得到一组 `AccessToken` 和 `RefreshToken`，以及它们的有效期：

```json
{
  "code": 0,
  "data": {
    "user": ...,
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwic3ViIjoibHB1YSIsImV4cCI6MTc0NTY1NTU3OCwibmJmIjoxNzQ1NjUxOTc4fQ.L1ETHHBNImNevze00QAgrrY1maZO2nefyIwdT4cb68c",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsInN1YiI6ImxwdWEiLCJleHAiOjE3NjEyMDM5NzgsIm5iZiI6MTc0NTY1MTk3OCwic3RhdGVfaGFzaCI6Ikk1OCtSbmsrTHVpTkxBbjBqek9KNG45OUorV3hqL0pzbjJoRVYrUXBhelE9In0.Q2s75zxPVA3bzZyIIBau3TBvqSxIdzbiEmK1zCd-_zk",
      "access_expires": "2025-04-26T16:19:38.833494+08:00",
      "refresh_expires": "2025-10-23T15:19:38.833495+08:00"
    }
  },
  "msg": ""
}
```

客户端应将 `AccessToken` 和 `RefreshToken` 安全保存到本地。在请求需要认证的 API 时，将 `AccessToken` 添加到请求头中：

```http
POST /api/v4/xxx
Authorization: Bearer <AccessToken>
......
```

### 刷新 AccessToken

当 `AccessToken` 过期时，客户端应使用 `RefreshToken` 获取一对新的 `AccessToken` 和 `RefreshToken`。请参考 [Refresh token](https://cloudrevev4.apifox.cn/refresh-token-289504601e0) 方法。

当 `RefreshToken` 过期，或者 [Refresh token](https://cloudrevev4.apifox.cn/refresh-token-289504601e0) 请求失败时，客户端应引导用户重新登录。

## 直接生成 AccessToken （仅本地调试） {#generate-access-token-for-local-debug}

在本地调试时，如果不想通过登录获取 `AccessToken`，可以使用站点的主密钥生成 `AccessToken`。

### 取得站点主密钥

::: warning
主密钥是站点安全的关键，请勿泄露给他人，请勿在生产环境使用这种方式认证。
:::

主密钥会在 Cloudreve 初始化时生成，并存放在数据库的 `settings` 表中。你可以通过数据库管理工具或下面的 SQL 语句取得：

```sql
SELECT `value` FROM `settings` WHERE `name` = 'secret_key';
```

### 生成 AccessToken

使用 HS256 算法和站点主密钥对下面的 Payload 生成 JWT token，作为 `AccessToken`：

```json
{
  "token_type": "access",
  "sub": "<User ID>",
  "exp": <Unix Timestamp>, // 过期时间
  "nbf": <Unix Timestamp> // 生效时间
}
```

其中 `<User ID>` 为用户的 ID，比如 `lUpa`。你可以在 `设置` -> `UID` 中取得。
