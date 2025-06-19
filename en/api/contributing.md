# Contributing {#contributing}

If you are interested in contributing to Cloudreve, please refer to this chapter to get started. It should be noted that Cloudreve is released under a dual-license strategy. The community edition is released under [GPL-3.0](https://github.com/cloudreve/cloudreve/blob/master/LICENSE), while the Pro edition uses a proprietary license. We only accept contributions to the community edition, and contributors need to sign the [CLA](https://cla-assistant.io/cloudreve/cloudreve) before merging a PR.

## Project Structure {#project-structure}

The main repository of Cloudreve is [cloudreve/cloudreve](https://github.com/cloudreve/cloudreve), which includes the frontend repository [cloudreve/frontend](https://github.com/cloudreve/frontend) as a git submodule.

## Start Developing {#start-developing}

### Development Environment {#development-environment}

Please refer to the [Build from source](../overview/build#install-dependencies) section to install the required tools.

### Clone Repository {#clone-repository}

```bash
git clone --recurse-submodules https://github.com/cloudreve/cloudreve.git
cd cloudreve
```

### Start Backend {#start-backend}

```bash
# Before the first start, install dependencies
go mod download

# Start the backend
go run main.go
```

If you need to pass [command line arguments](../overview/cli#global-parameters):

```bash
go run main.go -c /path/to/conf.ini
```

Since the frontend static assets are not embedded, after the backend starts, `http://localhost:5212` can only provide API services. In a typical development workflow, you also need to start the frontend dev server to access the local site.

### Start Frontend {#start-frontend}

Keep the backend server running, and execute the following commands in another terminal:

```bash
cd frontend
yarn install
yarn run dev
```

After the dev server starts, you can access the site at `http://localhost:5173`. By default, all API requests will be forwarded to `http://localhost:5212`. You can modify this in [`vite.config.ts`](https://github.com/cloudreve/frontend/blob/master/vite.config.ts).

## Select a Task {#select-a-task}

In Cloudreve's [issues](https://github.com/cloudreve/cloudreve/issues?q=state%3Aopen%20label%3A%22backlog%22), filter for issues with the `Backlog` label. These are tasks waiting to be claimed. After choosing a task, leave a comment in the issue to indicate that you will claim it, and remind the maintainer to assign the issue to you.

For newcomers, we recommend choosing issues labeled with `good first issue`.

## Propose a New Task {#propose-a-new-task}

If you have a new task idea, create a new issue in [issues](https://github.com/cloudreve/cloudreve/issues), describe your idea and implementation plan in detail, and remind the maintainer to assign it to you. Please wait for other developers to confirm your idea before you start development.

## Submit a PR {#submit-pr}

After completing the task, you can submit a PR to the [cloudreve/cloudreve](https://github.com/cloudreve/cloudreve) and [cloudreve/frontend](https://github.com/cloudreve/frontend) repositories. After the PR is submitted, a bot will guide you to sign the CLA.

## Discussion {#discussion}

You can discuss task details or get support in the `development` channel of our [Discord community](https://discord.com/channels/1343585183047094367/1343585679585579018).
