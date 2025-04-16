# OneDrive or SharePoint {#onedrive}

Store files in OneDrive or your team's SharePoint site using OneDrive storage policy.

## Reauthorizing Account {#reauthorize}

You need to reauthorize your account in the following situations:

- Cloudreve has not been running for a long time, causing the authorization information to expire;
- Important account or tenant configurations have changed;
- The client secret of the Entra ID application has expired;

You can check the authorization status on the storage policy settings page to confirm whether reauthorization is needed. When reauthorizing, please use the same account used during the last authorization.

## Storing to SharePoint Site {#sharepoint}

By default, Cloudreve will store files in the authorized account's default OneDrive. If you want to store files in a SharePoint site:

1. Use an account with access permissions to the target SharePoint site for authorization;
2. In the storage policy settings, select `Save files to SharePoint` for the `Drive Root`;
3. Fill in the SharePoint site address, then click elsewhere after completion to wait for Cloudreve to query and convert the site ID;
4. Save the storage policy.

## FAQ {#faq}

::: details Can I store files in a personal OneDrive account?

When creating the Entra ID application, make sure that `Supported account types` is selected as `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`, then log in with your personal Microsoft account when authorizing.

:::

::: details Incorrect filename when downloading?

Due to OneDrive limitations, Cloudreve cannot specify the filename when downloading files, so users see the Blob name of the file. You can enable `Download via browser` in the storage policy settings to download with the correct filename.

:::

::: details Upload error: `Unable to create upload session: Unknown error (failed to obtain token from CredManager ...`

Go to the storage policy settings, check if the account authorization is valid, and follow the prompts to reauthorize the account.

:::

::: details When authorizing the account, the message shows: `invalid_request: The provided value for the input parameter 'redirect_uri' is not valid. `

Please update the `Redirect URL` of the Entra ID application in the Azure portal. Cloudreve will provide the correct redirect URL when authorizing the account.

:::

::: details The page cannot be loaded after the account authorization login redirect: `ERR_SSL_PROTOCOL_ERROR`

Entra ID requires that the callback address must be an HTTPS address. You can manually replace `https` with `http` in the URL after redirection to continue and complete the callback.

:::

::: details Account authorization login redirect error: `AADSTS7000215: Invalid client secret provided...`

The `Client Secret` of the Entra ID application has expired or is invalid. Please create a new secret, click the `Authorize again` button on the storage policy settings page, fill in the new secret, and then log in to the account.

:::

::: details All OneDrive storage policy authorizations suddenly become invalid.

It may be due to clearing the Redis cache, please restart Cloudreve to reload the authorization.

:::
