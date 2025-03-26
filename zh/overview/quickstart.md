# 快速开始 {#quickstart}

了解如何快速启动一个 Cloudreve 实例，用于试用或探索 Cloudreve 的功能。此页面只包含了最基本的启动流程，如果你需要将 Cloudreve 正式部署到生产环境中，请参考 [部署指南](./deploy/index)。

## 获取 Cloudreve {#get-cloudreve}

:::tabs
== 社区版

你可以在 [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) 页面获取已经构建打包完成的预编译版本。如果你需要从源代码构建，请参考 [从源代码构建](./build)。

== Pro 版

登录 [Pro 授权管理面板](https://cloudreve.org/login) 获取主程序。

:::

我们提供了针对不同 CPU 架构和操作系统的预编译版本，命名规则为 `cloudreve_版本号_操作系统_CPU架构.tar.gz`，所有可用组合如下表：

| 操作系统 | 架构                  | 压缩包名                              |
| -------- | --------------------- | ------------------------------------- |
| Linux    | x86_64                | cloudreve\_版本号\_linux_amd64.tar.gz |
| Linux    | ARM64                 | cloudreve\_版本号\_linux_arm64.tar.gz |
| Linux    | ARMv5                 | cloudreve\_版本号\_linux_armv5.tar.gz |
| Linux    | ARMv6                 | cloudreve\_版本号\_linux_armv6.tar.gz |
| Linux    | ARMv7                 | cloudreve\_版本号\_linux_armv7.tar.gz |
| Windows  | x86_64                | cloudreve\_版本号\_windows_amd64.zip  |
| Windows  | ARM64                 | cloudreve\_版本号\_windows_arm64.zip  |
| MacOS    | Intel x86_64          | cloudreve\_版本号\_macos_amd64.zip    |
| MacOS    | Apple Silicon (ARM64) | cloudreve\_版本号\_macos_arm64.zip    |

## 启动 Cloudreve {#start-cloudreve}

:::tabs
== Linux

Linux 下，直接解压并执行主程序即可：

```bash
#解压获取到的主程序
tar -zxvf cloudreve_VERSION_OS_ARCH.tar.gz

# 赋予执行权限
chmod +x ./cloudreve

# 启动 Cloudreve
./cloudreve
```

== Windows

Windows 下，直接解压获取到的 ZIP 压缩包，启动 `cloudreve.exe` 即可。你也可以在终端中运行 `cloudreve.exe` 来启动 Cloudreve：

```powershell
# 启动 Cloudreve
.\cloudreve.exe
```

:::

对于 Pro 版本，在启动时需要将授权密钥通过命令行参数 `--license-key` 传入：

```bash
./cloudreve --license-key "你的授权密钥"
```

你可以在 [Pro 授权管理面板](https://cloudreve.org/login) 获取你的授权密钥。

Cloudreve 默认会监听 5212 端口。你可以在浏览器中访问 `http://localhost:5212`进入 Cloudreve。请注册一个账户，首个注册的账户会被设置为管理员。

## 下一步 {#next-steps}

本页面只包含了最基本的启动流程，用于本地试用体验，如果你需要将 Cloudreve 正式部署到生产环境中，请参考 [部署指南](./deploy)。
