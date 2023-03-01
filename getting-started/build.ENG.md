# Construct

The Cloudreve project is mainly composed of two parts: the back-end main warehouse [cloudreve/Cloudreve](https://github.com/cloudreve/Cloudreve), and the front-end warehouse [cloudreve/frontend](https://github.com/cloudreve/ front end). Before compiling the Cloudreve backend, you need to build the frontend submodule in the `assets` directory and embed it into the backend repository using [statik](https://github.com/rakyll/statik).

## Environment preparation

1. Refer to [Getting Started - The Go Programming Language](https://golang.org/doc/install) to install and configure the Go language development environment (>=1.18);
2. Refer to [Download | Node.js](https://nodejs.org/zh-cn/download/) to install Node.js;
3. Refer to [Install | Yarn](https://classic.yarnpkg.com/zh-Hans/docs/install#windows-stable) to install Yarn;

## start building

### Clone code

```bash
# Clone repository
git clone --recurse-submodules https://github.com/cloudreve/Cloudreve.git

# Checkout the version you want to compile
git checkout 3.x.x
```

### Build static resources

```bash
# Enter the front terminal module
cd assets
# install dependencies
yarn install
# start building
yarn run build
# Delete the mapping file after the build is complete
cd build
find . -name "*.map" -type f -delete
# Return to the main directory of the project to package static resources
cd ../../
zip -r -assets/build >assets.zip
```

After completion, the built static resource files are located in the `assets/build` directory.

You can rename this directory to the `statics` directory, place it in the same directory as the main Cloudreve program and restart Cloudreve, Cloudreve will use the static resource files in this directory instead of the built-in ones.

### Compile the project

```bash
# Return to the project main directory
cd ../

# Get the current version number, Commit
export COMMIT_SHA=$(git rev-parse --short HEAD)
export VERSION=$(git describe --tags)

# start compiling
go build -a -o cloudreve -ldflags " -X 'github.com/cloudreve/Cloudreve/v3/pkg/conf.BackendVersion=$VERSION' -X 'github.com/cloudreve/Cloudreve/v3/pkg/conf.LastCommit =$COMMIT_SHA'"
```

{% hint style="info" %}
When compiling for the first time, Go will download related dependent libraries. If your network environment is not good, this step may be too slow or fail. You can use [GOPROXY.IO](https://goproxy.io/zh/) to speed up module downloading.
{% endhint %}

After the compilation is complete, the final executable file `cloudreve` will be generated in the project root directory.

## Build helpers

You can use [goreleaser](https://goreleaser.com/intro/) to quickly complete operations such as building and packaging, as follows:

```bash
# install goreleaser
go install github.com/goreleaser/goreleaser@latest

# Build the project
goreleaser build --clean --single-target --snapshot
```

Or cross compile all available versions:

```sh
goreleaser build --clean --snapshot
```
