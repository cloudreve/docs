# Building from Source Code {#build}

Cloudreve project mainly consists of two parts: the backend main repository [cloudreve/Cloudreve](https://github.com/cloudreve/Cloudreve), and the frontend repository [cloudreve/frontend](https://github.com/cloudreve/frontend). Before compiling the Cloudreve backend, you need to build the frontend submodule in the `assets` directory first, then use [embed](https://pkg.go.dev/embed) to embed it into the backend executable.

## Installing Dependencies {#install-dependencies}

- [Golang](https://golang.org/doc/install) >= 1.23
- [Node.js](https://nodejs.org/en/download/package-manager) >= 20
- [Yarn](https://yarnpkg.com/getting-started)
- [Goreleaser](https://goreleaser.com/install/)

## Cloning the Repository {#clone-repository}

```bash
# Clone the repository
git clone --recurse-submodules https://github.com/cloudreve/Cloudreve.git

# Check out the version you want to compile
git checkout 4.x.x
```

## Building the Frontend {#build-frontend}

```bash
chmod +x ./.build/build-assets.sh

# Build the frontend
./.build/build-assets.sh
```

The compiled frontend resource package is located at `application/statics/assets.zip`.

::: tip <Badge type="tip" text="Pro" />

For Pro edition users, please download the frontend source code from the license management dashboard, then manually build it in the source code directory:

```bash
# Install dependencies
yarn install

# Mark version for frontend
yarn version --new-version 4.x.x --no-git-tag-version

# Build the frontend
yarn run build
```

The build output is in the `build` directory.

:::

## Building the Final Executable {#build-executable-file}

```bash
# Get current version number and commit
export COMMIT_SHA=$(git rev-parse --short HEAD)
export VERSION=$(git describe --tags)

# Start compiling
go build -a -o cloudreve \
    -ldflags "-s -w -X 'github.com/cloudreve/Cloudreve/v4/application/constants.BackendVersion=$VERSION' -X 'github.com/cloudreve/Cloudreve/v4/application/constants.LastCommit=$COMMIT_SHA'"
```

After compilation, the final executable `cloudreve` will be generated in the project root directory.

## Build Helper

You can use [goreleaser](https://goreleaser.com/) to quickly complete building, packaging, and other operations. Usage is as follows:

```bash
# Install goreleaser
go install github.com/goreleaser/goreleaser/v2@latest

# Build the project
goreleaser build --clean --single-target --snapshot
```

Or cross-compile all available versions:

```bash
goreleaser build --clean --snapshot
```
