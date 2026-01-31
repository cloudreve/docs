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

## 通过 OAuth 获取 AccessToken（推荐）{#get-access-token-by-oauth}

Cloudreve 支持标准的 OAuth 2.0 授权码流程，允许第三方应用程序安全地获取用户授权。这是需要代表用户访问 Cloudreve 的应用程序推荐使用的方法。

### 注册 OAuth 应用程序

在使用 OAuth 之前，需要在 Cloudreve 管理面板中注册你的应用程序：

1. 以管理员身份登录，导航到 `管理面板` -> `OAuth 应用`
2. 点击 `新建 OAuth 应用`
3. 填写必要信息：
   - **应用名称**：在授权过程中向用户显示的名称
   - **应用图标**：图标 URL 或 Iconify 图标名称（如 `mdi:application`）
   - **客户端密钥**：生成或提供一个密钥（请妥善保管）
   - **重定向 URI**：一个或多个用于接收授权码的回调 URL（每行一个）
   - **权限 (Scopes)**：选择你的应用程序需要的权限。
4. 保存应用程序并记录 `客户端 ID` 和 `客户端密钥`

### 授权流程

#### 1. 将用户重定向到授权页面

将用户重定向到授权端点，并携带以下参数：

```
GET /session/authorize
```

| 参数                    | 必需 | 说明                                       |
| ----------------------- | ---- | ------------------------------------------ |
| `response_type`         | 是   | 必须为 `code`                              |
| `client_id`             | 是   | 你的应用程序的 Client ID                   |
| `redirect_uri`          | 是   | 已注册的回调地址之一                       |
| `scope`                 | 是   | 以空格分隔的请求权限列表                   |
| `state`                 | 否   | 自定义状态字符串，会被原样携带到重定向 URI |
| `code_challenge`        | 否   | PKCE 代码挑战（推荐使用）                  |
| `code_challenge_method` | 否   | 如果提供了 `code_challenge`，必须为 `S256` |

授权 URL 示例：

```
https://your-cloudreve-site.com/session/authorize?
  response_type=code&
  client_id=393a1839-f52e-498e-9972-e77cc2241eee&
  redirect_uri=https://your-app.com/callback&
  scope=openid%20profile%20offline_access%20Files.Write&
  state=random_state_string&
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
  code_challenge_method=S256
```

#### 2. 用户授权应用程序

用户将被提示登录（如果尚未登录）并授权请求的权限。用户批准后，Cloudreve 会将用户重定向回你的 `redirect_uri`，并携带：

```
https://your-app.com/callback?code=AUTHORIZATION_CODE&state=<state>
```

#### 3. 用授权码交换令牌

向令牌端点发送 POST 请求，用授权码交换访问令牌和刷新令牌。

请参考 [Exchange token](https://cloudrevev4.apifox.cn/exchange-token-413494630e0) API 文档。

```http
POST /api/v4/session/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
code=AUTHORIZATION_CODE&
code_verifier=YOUR_CODE_VERIFIER
```

| 参数            | 必需 | 说明                                    |
| --------------- | ---- | --------------------------------------- |
| `grant_type`    | 是   | 必须为 `authorization_code`             |
| `client_id`     | 是   | 你的应用程序的客户端 ID                 |
| `client_secret` | 是   | 你的应用程序的客户端密钥                |
| `code`          | 是   | 回调中收到的授权码                      |
| `code_verifier` | 否   | 如果使用了 `code_challenge`，则必须提供 |

响应：

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token_expires_in": 7776000
}
```

### PKCE（代码交换证明密钥）

建议所有 OAuth 客户端使用 PKCE，特别是无法安全存储客户端密钥的公共客户端（移动应用、单页应用）。即使对于机密客户端，PKCE 也能提供额外的安全性。

#### 生成 PKCE 参数

1. 生成一个随机的 `code_verifier`（43-128 个字符，使用 `A-Z`、`a-z`、`0-9`、`-`、`.`、`_`、`~`）
2. 通过计算 `code_verifier` 的 SHA-256 哈希值，然后进行 base64url 编码来创建 `code_challenge`

示例（JavaScript）：

```javascript
// 生成随机的 code verifier
function generateCodeVerifier(length = 64) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => charset[v % charset.length]).join("");
}

// 从 code verifier 生成 code challenge
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  // Base64url 编码
  let base64 = "";
  for (let i = 0; i < hashArray.length; i++) {
    base64 += String.fromCharCode(hashArray[i]);
  }
  return btoa(base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// 使用示例
const codeVerifier = generateCodeVerifier();
const codeChallenge = await generateCodeChallenge(codeVerifier);

// 安全存储 codeVerifier 以供令牌交换时使用
```

### 刷新 AccessToken

::: warning
要获取 `refresh_token`，必须在授权请求中包含 `offline_access` scope。如果没有此 scope，将只返回 `access_token`。
:::

当 `AccessToken` 过期时，使用 `RefreshToken` 获取一对新的令牌。请参考 [Refresh token](https://cloudrevev4.apifox.cn/refresh-token-289504601e0) 方法。

```http
POST /api/v4/session/token/refresh
Content-Type: application/json

{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

响应：

```json
{
  "code": 0,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "access_expires": "2025-04-26T16:19:38.833494+08:00",
    "refresh_expires": "2025-10-23T15:19:38.833495+08:00"
  },
  "msg": ""
}
```

当 `RefreshToken` 过期，或者刷新请求失败时，客户端应引导用户重新授权应用程序。

### OAuth 端点参考

| 端点         | URL                                                   |
| ------------ | ----------------------------------------------------- |
| 授权端点     | `https://your-site.com/session/authorize`             |
| 令牌端点     | `https://your-site.com/api/v4/session/oauth/token`    |
| 刷新令牌端点 | `https://your-site.com/api/v4/session/token/refresh`  |
| 用户信息端点 | `https://your-site.com/api/v4/session/oauth/userinfo` |

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
