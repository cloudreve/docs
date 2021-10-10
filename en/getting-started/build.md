# Build

The Cloudreve project consists of two main parts: the main backend repository [cloudreve/Cloudreve](https://github.com/cloudreve/Cloudreve), and the frontend repository [cloudreve/frontend](https://github.com/cloudreve/frontend). Before compiling the Cloudreve backend, you need to build the frontend submodules in the `assets` directory and embed them in the backend repository using [statik](https://github.com/rakyll/statik).

## Environment preparation

1. refer to [Getting Started - The Go Programming Language](https://golang.org/doc/install) to install and configure the Go language development environment.
2. Refer to [Download \| Node.js](https://nodejs.org/download/) to install Node.js;
3. Refer to [Install \| Yarn](https://classic.yarnpkg.com/docs/install#windows-stable) to install Yarn;
4. run `go get github.com/rakyll/statik` to install the statik command line tool;

## Start building

### Clone the repository

``bash
## Clone the repository
git clone --recurse-submodules https://github.com/cloudreve/Cloudreve.git

# # Check out the version you want to compile
git checkout 3.x.x
```

### Build static resources

```bash
# Access the front-end submodule
cd assets
# Install dependencies
yarn install
# Start building
yarn run build
```

When finished, the static resource files are located in the `assets/build` directory.

You can rename this directory to `statics`, place it in the same level as the main Cloudreve application and restart Cloudreve, which will use the static resource files in this directory instead of the built-in ones.

### Embedding static resources

```bash
### Return to the project home directory
cd ../

# Install statik, for embedding static resources
go get github.com/rakyll/statik

# Start embedding
statik -src=assets/build/ -include=*.html,*.js,*.json,*.css,*.png,*.svg,*.ico,*.ttf -f
```

{% hint style="info" %}
If the `statik` command is not found when embedding, try executing.

`export PATH=$PATH:$(go env GOPATH)/bin`
{% endhint %}

### Compile the project

```bash
### Get current version number, commit
export COMMIT_SHA=$(git rev-parse --short HEAD)
export VERSION=$(git describe --tags)

# Start the build
go build -a -o cloudreve -ldflags " -X 'github.com/cloudreve/Cloudreve/v3/pkg/conf.BackendVersion=$VERSION' -X 'github.com/cloudreve/ Cloudreve/v3/pkg/conf.LastCommit=$COMMIT_SHA'"
```

{% hint style="info" %}
When first compiling, Go will download the relevant dependencies, which may cause this step to slow down or fail if you have a poor network. You can use [GOPROXY.IO](https://goproxy.io/zh/) to speed up the module download.
{% endhint %}

Once compiled, the final executable `cloudreve` will be generated in the project root directory.

## Build Assistant

You can quickly build, package etc. using the build script `build.sh` in the project root directory, which is used as follows

```bash
. /build.sh [-a] [-c] [-b] [-r]
    a - build static resources
    c - compile binaries
    b - build front-end + compile binaries
    r - cross-compile, build for release
```

## Cross-compiling

Before cross-compiling, you need to enable `CGO`, properly install the GCC toolchain for the target platform and set the `CC` environment variable to the GCC compiler for the corresponding platform.

For example, to cross-compile Windows/AMD64 on a Linux/AMD64 host platform.

```bash
export GOOS=windows
export GOARCH=amd64
export CC=x86_64-w64-mingw32-gcc
export CGO_ENABLED=1

go build
```