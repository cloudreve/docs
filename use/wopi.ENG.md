# Extended document preview/editing

Cloudreve automatically selects the previewer by the file's extension. Cloudreve has built-in previewers for multiple file formats, including video, audio, code, text, Office documents, and more. Among them, the Office document previewer provides high scalability. You can change the default document preview service address in Background - Preferences - Image and Preview - File Preview. You can also replace the Office document previewer with a more powerful preview/editor by enabling WOPI integration, and define the file extensions that can be previewed/edited. This article will introduce the deployment and docking methods of three services that support the WOPI protocol. You can also extend Cloudreve's preview editing capabilities (not limited to Office documents) by implementing your own WOPI client.

## Collabora Online (LibreOffice Online)

Deploy Collabora Online using Docker ([Official Documentation](https://sdk.collaboraonline.com/docs/installation/CODE\_Docker\_image.html#code-docker-image)):

```sh
docker pull collaboration/code

docker run -t -d -p 127.0.0.1:9980:9980 \
            -e "aliasgroup1=<Cloudreve address allowed to use this service, including explicit port>" \
            -e "username=<panel administrator username>" \
            -e "password=<panel administrator password>" \
            --name code --restart always collaborate/code
```

Take the official demo site as an example:

```sh
docker run -t -d -p 127.0.0.1:9980:9980 \
            -e "aliasgroup1=https://demo.cloudreve.org:443" \
            -e "username=<panel administrator username>" \
            -e "password=<panel administrator password>" \
            --name code --restart always collaborate/code
```

After the Container starts, configure Nginx or other web server reverse proxy `https://127.0.0.1:9980`, please refer to [Proxy settings](https://sdk.collaboraonline.com/docs/installation/Proxy\_settings. html), to ensure that the reversed service can be accessed by your end users, you can manually visit `<your service host>/hosting/discovery` to confirm whether the expected XML response is returned.

Enable `Use WOPI` in Background - Parameter Settings - Image and Preview - File Preview - WOPI Client and fill in `<your service host>/hosting/discovery` in `WOPI Discovery Endpoint`. After saving, you can test document preview and editing in the foreground:

<figure><img src="../.gitbook/assets/screenshot 2023-02-10 11.17.52.png" alt=""><figcaption></figcaption></figure>

##OnlyOffice

OnlyOffice supports the WOPI protocol after version 6.4, please refer to the official documentation to deploy your [OnlyOffice](https://helpcenter.onlyoffice.com/) instance. It is recommended to use [Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer) for quick deployment.

Refer to [Official Documentation](https://helpcenter.onlyoffice.com/installation/docs-developer-configuring.aspx#WOPI) to configure OnlyOffice to enable WOPI function. If using Docker, it can be enabled by specifying `WOPI_ENABLED` as `true` when creating the Contianer:

```sh
docker run -i -t -d -p 8080:80 -e WOPI_ENABLED=true onlyoffice/documentserver
```

You can manually visit `<your OnlyOffice host>/hosting/discovery` to confirm that the expected XML response is returned.

Enable `Use WOPI` in Background - Parameter Settings - Image and Preview - File Preview - WOPI Client and fill in `<your service host>/hosting/discovery` in `WOPI Discovery Endpoint`. After saving, you can test document preview and editing in the foreground:

<figure><img src="../.gitbook/assets/screenshot 2023-02-10 11.49.56.png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
OnlyOffice does not support filtering the source of WOPI requests. If you have public use requirements, please check whether the `wopisrc` parameter in the preview page request is the expected Cloudreve site through an external application firewall.
{% endhint %}

## Office Online Server (On-Prem)

[Office Online Server](https://learn.microsoft.com/en-us/officeonlineserver/office-online-server) is a privately deployable Office online document service launched by Microsoft. Please refer to [Official Documentation](https://learn.microsoft.com/en-us/officeonlineserver/deploy-office-online-server) to deploy on your Windows Server.

You can manually visit `<your OnlyOffice host>/hosting/discovery` to confirm that the expected XML response is returned.

Enable `Use WOPI` in Background - Parameter Settings - Image and Preview - File Preview - WOPI Client and fill in `<your service host>/hosting/discovery` in `WOPI Discovery Endpoint`. After saving, you can test document preview and editing in the foreground:

<figure><img src="../.gitbook/assets/IMG_8653 (1).PNG" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
Office Online Server does not support filtering the source of WOPI requests. If you have public use requirements, please check whether the `wopisrc` parameter in the preview page request is the expected Cloudreve site through an external application firewall.
{% endhint %}

## WOPI protocol

The Web Application Open Platform Interface (WOPI) protocol is a protocol for integrating web document editors, which you can find in [Microsoft's documentation](https://learn.microsoft.com/en-us/microsoft-365/cloud -storage-partner-program/online/) to read the detailed protocol definition. Cloudreve can be connected to the document processing service that implements the WOPI protocol to expand the existing document preview and editing capabilities.

### Compatibility

Cloudreve's implementation of WOPI REST methods is shown in the table below:

| Method          | Support                         |
| --------------- | -----------                     |
| CheckFileInfo   | ✅                              |
| GetFile         | ✅                              |
| Lock            | ⚠️ (callable but has no effect) |
| RefreshLock     | ⚠️ (callable but has no effect) |
| Unlock          | ⚠️ (callable but has no effect) |
| PutFile         | ✅                              |
| PutRelativeFile | ❌                              |
| RenameFile      | ✅                              |
