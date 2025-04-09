# OneDrive 或 SharePoint {#onedrive}

通过 OneDrive 存储策略，将文件存储在 OneDrive 或团队的 SharePoint 站点中。

## 重新授权账号 {#reauthorize}

在下面情况下，你需要重新授权账号：

- Cloudreve 长期未启动，导致授权信息过期；
- 账户或租户重要配置发生变更；
- Entra ID 应用的客户端密码过期；

你可以在存储策略设置页面检查授权状态，确认是否需要重新授权。重新授权时，请使用上次授权时使用的账号。

## 存储到 SharePoint 站点 {#sharepoint}

默认情况下，Cloudreve 会将文件存放到授权账号的默认 OneDrive 中。如果你希望将文件存放到 SharePoint 站点中：

1. 使用拥有目标 SharePoint 站点访问权限的账号登录授权；
2. 在存储策略设置中，将 `驱动器根目录` 选择为 `保存文件到 SharePoint`；
3. 填写 SharePoint 站点地址，填写完成后点击其他空白处，等待 Cloudreve 查询并转换站点 ID；
4. 保存存储策略。

## 常见问题 {#faq}

::: details 能否将文件存储到个人账号的 OneDrive 中？

在创建 Entra ID 应用时，确保 `受支持的账户类型` 选择的是 `任何组织目录(任何 Azure AD 目录 - 多租户)中的帐户和个人 Microsoft 帐户(例如，Skype、Xbox)`，然后在授权账号时登录你的个人 Microsoft 账号。

:::

::: details 下载的文件名不对？

由于 OneDrive 的限制，Cloudreve 无法在下载文件时指定文件名，用户看到的是文件 Blob 的名称。你可以在存储策略设置中开启 `由浏览器处理下载` 来使用正确的文件名下载。

:::

::: details 上传报错 `无法创建上传会话: 未知错误 (failed to obtain token from CredManager ...`

赚到存储策略设置，检查账号授权是否有效，根据提示重新登录账号授权。

:::

::: details 授权账号时提示 `invalid_request: The provided value for the input parameter 'redirect_uri' is not valid. `

请在 Azure 门户更新 Entra ID 应用的 `重定向 URL`，在授权账号时 Cloudreve 会给出正确的重定向 URL。

:::

::: details 授权账号登录跳转后的页面无法加载： `ERR_SSL_PROTOCOL_ERROR`

Entra ID 要求回调地址必须为 HTTPS 地址，你可以手动将跳转后的 URL 中的 `https` 替换为 `http` 后继续访问完成回调。

:::

::: details 账号授权登录跳转后报错 `AADSTS7000215: Invalid client secret provided...`

Entra ID 应用的 `客户端密码` 过期或无效，请创建一个新的密码，在存储策略设置页面点击 `重新授权` 按钮，填写新的密码后再登录账号。

:::
