# Desktop Sync Client {#desktop-sync-client}

Cloudreve provides an official desktop sync client for Windows, enabling seamless bidirectional file synchronization between your local machine and Cloudreve server.

![Desktop Sync Client](/images/desktop-hero.png)

## Features {#features}

- **Real-time bidirectional synchronization**: Changes on either side are automatically synced
- **On-demand file access**: Files are downloaded only when accessed, saving local storage
- **Windows Explorer integration**: Native context menus, thumbnails, and status indicators
- **Multiple storage provider support**: Works with all storage policies configured on your Cloudreve server

## System Requirements {#system-requirements}

- Windows 10 version 1903 (build 18362) or later
- A Cloudreve Pro server instance

## Download {#download}

<p>
  <a href="https://apps.microsoft.com/store/detail/9p3gh5rnnzfd">
    <img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200"/>
  </a>
</p>

Source code: [GitHub](https://github.com/cloudreve/desktop)

## Placeholder Files {#placeholder-files}

The desktop client uses the Windows Cloud Files API to create "placeholder" files. These are special files that appear in Windows Explorer like regular files but may not have their content stored locally. This allows you to browse your entire cloud storage without consuming local disk space.

### File States {#file-states}

Placeholder files have three main states, indicated by status icons in Windows Explorer:

![File states](/images/cloudfiles.png)

| State                 | Icon                              | Description                                                                                                                                          |
| --------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Online-only**       | Cloud icon                        | File metadata is available locally, but file content remains on the server. The file will be downloaded when you open it.                            |
| **Locally available** | Green checkmark                   | File content has been downloaded and is available locally. The system may automatically free up space by removing local content when storage is low. |
| **Always available**  | Solid green circle with checkmark | File is pinned to always keep local content. The system will not automatically remove local content.                                                 |

### Managing File States {#managing-file-states}

You can change a file's state by right-clicking it in Windows Explorer:

- **Free up space**: Removes local content, keeping only the placeholder (Online-only)
- **Always keep on this device**: Pins the file to ensure content is always available locally

## File Synchronization {#file-synchronization}

### Real-time Change Detection {#real-time-change-detection}

Under normal operation, the desktop client receives file change notifications in real-time through [Server-Sent Events (SSE)](../api/events). When files are created, modified, renamed, or deleted on the server (by web interface, mobile app, or other clients), your local view updates immediately.

::: warning Troubleshooting
If real-time updates are not working:

- Check if your web server (Nginx, Apache, etc.) has buffering disabled for SSE endpoints
- Ensure reverse proxy timeout settings are long enough for persistent connections
- Verify that the Cloudreve server is accessible and responding normally
  :::

### Force Sync {#force-sync}

In rare cases where synchronization state becomes inconsistent (e.g., after network interruptions or system crashes), you can trigger a manual full synchronization:

1. Right-click on a file or folder in Windows Explorer
2. Select **Cloudreve** > **Sync now**

This will reconcile the local state with the server, resolving any discrepancies.

### Conflict Resolution {#conflict-resolution}

When a local file version conflicts with the cloud, the client will pop up a notification asking how to resolve the conflict:

![Conflict resolution](/images/file-conflict.png)

You can right-click on the conflicting file and select **Cloudreve** > **Resolve conflict** to re-open the conflict resolution dialog.

## Comparison with WebDAV {#comparison-with-webdav}

While Cloudreve also supports WebDAV for file access, the desktop sync client offers significant advantages:

| Feature                  | Desktop Client                     | WebDAV                              |
| ------------------------ | ---------------------------------- | ----------------------------------- |
| **System requirements**  | Windows 10 1903+                   | Any OS with WebDAV client           |
| **On-demand files**      | Yes (placeholder files)            | No (must download entire file)      |
| **Real-time sync**       | Yes (SSE push)                     | No (manual refresh required)        |
| **Upload method**        | Direct to storage provider         | Must relay through Cloudreve server |
| **Chunked upload**       | Yes (parallel chunks)              | No (single stream)                  |
| **Large file support**   | Excellent                          | Limited by WebDAV client            |
| **Offline access**       | Pinned files available offline     | Cached files only                   |
| **Explorer integration** | Full (status icons, context menus) | Basic (mounted drive)               |

::: tip When to use WebDAV
WebDAV remains useful for:

- Non-Windows platforms (macOS, Linux, mobile)
- Applications that require direct file path access
- Simple file access without sync requirements
  :::
