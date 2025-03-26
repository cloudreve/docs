# Quick Start {#quickstart}

Learn how to quickly launch a Cloudreve instance for trial or exploring Cloudreve's features. This page only contains the most basic startup process. If you need to formally deploy Cloudreve to a production environment, please refer to the [Deployment Guide](./deploy/index).

## Get Cloudreve {#get-cloudreve}

:::tabs
== Community Edition

You can obtain pre-compiled versions on the [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) page. If you need to build from source code, please refer to [Building from Source Code](./build).

== Pro Edition

Log in to the [Pro License Management Panel](https://cloudreve.org/login) to get the main program.

:::

We provide pre-compiled versions for different CPU architectures and operating systems. The naming convention is `cloudreve_version_OS_CPU-architecture.tar.gz`. All available combinations are shown in the table below:

| Operating System | Architecture          | Package Name                         |
| ---------------- | --------------------- | ------------------------------------ |
| Linux            | x86_64                | cloudreve_version_linux_amd64.tar.gz |
| Linux            | ARM64                 | cloudreve_version_linux_arm64.tar.gz |
| Linux            | ARMv5                 | cloudreve_version_linux_armv5.tar.gz |
| Linux            | ARMv6                 | cloudreve_version_linux_armv6.tar.gz |
| Linux            | ARMv7                 | cloudreve_version_linux_armv7.tar.gz |
| Windows          | x86_64                | cloudreve_version_windows_amd64.zip  |
| Windows          | ARM64                 | cloudreve_version_windows_arm64.zip  |
| MacOS            | Intel x86_64          | cloudreve_version_macos_amd64.zip    |
| MacOS            | Apple Silicon (ARM64) | cloudreve_version_macos_arm64.zip    |

## Launch Cloudreve {#start-cloudreve}

:::tabs
== Linux

On Linux, simply extract and execute the main program:

```bash
# Extract the obtained main program
tar -zxvf cloudreve_VERSION_OS_ARCH.tar.gz

# Grant execution permission
chmod +x ./cloudreve

# Start Cloudreve
./cloudreve
```

== Windows

On Windows, simply extract the obtained ZIP archive and start `cloudreve.exe`. You can also run `cloudreve.exe` in the terminal to start Cloudreve:

```powershell
# Start Cloudreve
.\cloudreve.exe
```

:::

For the Pro edition, you need to pass the license key through the command line parameter `--license-key` when starting:

```bash
./cloudreve --license-key "your license key"
```

You can obtain your license key from the [Pro License Management Panel](https://cloudreve.org/login).

Cloudreve will listen on port 5212 by default. You can access Cloudreve by visiting `http://localhost:5212` in your browser. Please register an account; the first registered account will be set as the administrator.

## Next Steps {#next-steps}

This page only contains the most basic startup process for local trial and experience. If you need to formally deploy Cloudreve to a production environment, please refer to the [Deployment Guide](./deploy).
