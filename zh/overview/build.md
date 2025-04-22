# 从源代码编译 {#build}

Cloudreve 项目主要由两部分组成：后端主仓库 [cloudreve/Cloudreve](https://github.com/cloudreve/Cloudreve)，以及前端仓库 [cloudreve/frontend](https://github.com/cloudreve/frontend)。编译 Cloudreve 后端前，需要先构建`assets` 目录下的前端子模块，然后使用 [embed](https://pkg.go.dev/embed) 嵌入到后端的可执行文件。

## 安装依赖 {#install-dependencies}

- [Golang](https://golang.org/doc/install) >= 1.23
- [Node.js](https://nodejs.org/en/download/package-manager) >= 20
- [Yarn](https://yarnpkg.com/getting-started)
- [Goreleaser](https://goreleaser.com/install/)

## 克隆仓库 {#clone-repository}

```bash
# 克隆仓库
git clone --recurse-submodules https://github.com/cloudreve/Cloudreve.git

# 签出您要编译的版本
git checkout 4.x.x
```

## 编译前端 {#build-frontend}

```bash
chmod +x ./.build/build-assets.sh

# 构建前端
./.build/build-assets.sh
```

构建后的前端资源压缩包位于 `application/statics/assets.zip`。

::: tip <Badge type="tip" text="Pro" />

对于 Pro 用户，请在授权管理面板下载前端源代码，然后在源代码目录下手动构建：

```bash
# 安装依赖
yarn install

# 为前端标记版本
yarn version --new-version 4.x.x --no-git-tag-version

# 构建前端
yarn run build
```

编译产物在 `build` 目录下。

:::

## 编译最终可执行文件 {#build-executable-file}

```bash
# 获得当前版本号、Commit
export COMMIT_SHA=$(git rev-parse --short HEAD)
export VERSION=$(git describe --tags)

# 开始编译
go build -a -o cloudreve \
    -ldflags "-s -w -X 'github.com/cloudreve/Cloudreve/v4/application/constants.BackendVersion=$VERSION' -X 'github.com/cloudreve/Cloudreve/v4/application/constants.LastCommit=$COMMIT_SHA'"
```

编译完成后，会在项目根目录下生成最终的可执行文件 `cloudreve`。

## 构建助手

你可以使用 [goreleaser](https://goreleaser.com/) 快速完成构建、打包等操作，使用方法如下：

```bash
# 安装 goreleaser
go install github.com/goreleaser/goreleaser@latest

# 构建项目
goreleaser build --clean --single-target --snapshot
```

或者交叉编译出所有可用版本：

```bash
goreleaser build --clean --snapshot
```
