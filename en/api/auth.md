# Authentication Methods {#authentication-methods}

When browsing specific API documentation, the authentication type for each API method will be indicated:

![Authentication Methods](./images/auth-methods.png)

Authentication types are as follows:

- **Auth: None** No authentication required

  No `Authorization` header needs to be sent.

- **Auth: JWT Required** Authentication required

  An `Authorization` header is required, in the format `Bearer <AccessToken>`. Refer to the sections below on how to obtain or generate an `AccessToken`.

- **Auth: JWT Optional** Optional authentication

  Sending the `Authorization` header is optional. If sent, the request will be executed as the authenticated user; if not sent, the request will be executed as an anonymous user.

## Obtaining AccessToken via Login {#get-access-token-by-login}

### Login

After successfully logging in via [Password sign-in](https://cloudrevev4.apifox.cn/password-sign-in-289490586e0) or other login interfaces, you will receive a pair of `AccessToken` and `RefreshToken`, along with their expiration times:

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

The client should securely store the `AccessToken` and `RefreshToken` locally. When requesting an API that requires authentication, add the `AccessToken` to the request header:

```http
POST /api/v4/xxx
Authorization: Bearer <AccessToken>
......
```

### Refreshing AccessToken

When the `AccessToken` expires, the client should use the `RefreshToken` to obtain a new pair of `AccessToken` and `RefreshToken`. Refer to the [Refresh token](https://cloudrevev4.apifox.cn/refresh-token-289504601e0) method.

When the `RefreshToken` expires, or if the [Refresh token](https://cloudrevev4.apifox.cn/refresh-token-289504601e0) request fails, the client should guide the user to log in again.

## Directly Generating AccessToken (Local Debugging Only) {#generate-access-token-for-local-debug}

During local debugging, if you do not want to obtain an `AccessToken` via login, you can use the site's master key to generate an `AccessToken`.

### Obtaining the Site Master Key

::: warning
The master key is crucial for site security. Do not disclose it to others, and do not use this authentication method in a production environment.
:::

The master key is generated during Cloudreve initialization and stored in the `settings` table in the database. You can obtain it using a database management tool or the following SQL statement:

```sql
SELECT `value` FROM `settings` WHERE `name` = 'secret_key';
```

### Generating AccessToken

Use the HS256 algorithm and the site master key to generate a JWT token for the following payload, to be used as the `AccessToken`:

```json
{
  "token_type": "access",
  "sub": "<User ID>",
  "exp": <Unix Timestamp>, // Expiration time
  "nbf": <Unix Timestamp> // Not before time
}
```

Where `<User ID>` is the user's ID, for example, `lUpa`. You can obtain it in `Settings` -> `UID`.
