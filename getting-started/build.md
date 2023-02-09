# 构建

Cloudreve 项目主要由两部分组成：后端主仓库 [cloudreve/Cloudreve](https://github.com/cloudreve/Cloudreve)，以及前端仓库 [cloudreve/frontend](https://github.com/cloudreve/frontend)。编译 Cloudreve 后端前，需要先构建`assets` 目录下的前端子模块，并使用 [statik](https://github.com/rakyll/statik) 嵌入到后端仓库。

## 环境准备

1. 参照 [Getting Started - The Go Programming Language](https://golang.org/doc/install) 安装并配置 Go 语言开发环境 (>=1.18)；
2. 参考 [下载 | Node.js](https://nodejs.org/zh-cn/download/) 安装 Node.js;
3. 参考 [安装 | Yarn](https://classic.yarnpkg.com/zh-Hans/docs/install#windows-stable) 安装 Yarn;

## 开始构建

### 克隆代码

```bash
# 克隆仓库
git clone --recurse-submodules https://github.com/cloudreve/Cloudreve.git

# 签出您要编译的版本
git checkout 3.x.x
```

### 构建静态资源

```bash
# 进入前端子模块
cd assets
# 安装依赖
yarn install
# 开始构建
yarn run build
# 构建完成后删除映射文件
cd build
find . -name "*.map" -type f -delete
# 返回项目主目录打包静态资源
cd ../../
zip -r - assets/build >assets.zip
```

完成后，所构建的静态资源文件位于 `assets/build` 目录下。

你可以将此目录改名为`statics` 目录，放置在 Cloudreve 主程序同级目录下并重启 Cloudreve，Cloudreve 将会使用此目录下的静态资源文件，而非内置的。

### 编译项目

```bash
# 回到项目主目录
cd ../

# 获得当前版本号、Commit
export COMMIT_SHA=$(git rev-parse --short HEAD)
export VERSION=$(git describe --tags)

# 开始编译
go build -a -o cloudreve -ldflags " -X 'github.com/cloudreve/Cloudreve/v3/pkg/conf.BackendVersion=$VERSION' -X 'github.com/cloudreve/Cloudreve/v3/pkg/conf.LastCommit=$COMMIT_SHA'"
```

{% hint style="info" %}
首次编译时，Go 会下载相关依赖库，如果您的网络环境不佳，可能会导致这一步速度过慢或者失败。你可以使用 [GOPROXY.IO](https://goproxy.io/zh/) 加快模块下载速度。
{% endhint %}

编译完成后，会在项目根目录下生成最终的可执行文件`cloudreve` 。

## 构建助手

你可以使用 [goreleaser](https://goreleaser.com/intro/) 快速完成构建、打包等操作，使用方法如下：

```bash
# 安装 goreleaser
go install github.com/goreleaser/goreleaser@latest

# 构建项目
goreleaser build --clean --single-target --snapshot
```

或者交叉编译出所有可用版本：

```sh
goreleaser build --clean --snapshot
```
