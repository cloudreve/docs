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

When submitting a PR, please follow these requirements:

1. **PRs must be linked to an issue labeled with `Backlog`**: We do not accept contributions that propose new features directly through a PR. Any new feature or change must first be discussed in an issue, acknowledged by a maintainer, and labeled with `Backlog` before development starts and the corresponding PR is opened. If you have a new idea, please first follow the [Propose a New Task](#propose-a-new-task) flow to create an issue.
2. **Each PR should correspond to a single change**: Keep your PR focused — one PR should address a single issue or implement a single feature. For large features or refactors, please split them into multiple smaller PRs whenever possible so that they can be reviewed and merged incrementally. This makes review and follow-up debugging much easier.

## Discussion {#discussion}

You can discuss task details or get support in the `development` channel of our [Discord community](https://discord.com/channels/1343585183047094367/1343585679585579018).

## AIGC

We do not oppose using AI-generated code tools (AIGC) to assist development, but we firmly oppose "vibe coding" (blindly copying and pasting AI-generated code without understanding its meaning).

### AIGC Guidelines {#aigc-guidelines}

If you choose to use AI tools to assist development, please follow these guidelines:

1. **Understand every line of code**: You must fully understand the purpose and principles of every line of AI-generated code
2. **Careful review**: Check whether the AI-generated code complies with the project's coding standards and best practices
3. **Thorough testing**: Conduct comprehensive testing of AI-generated code to ensure its correctness and stability
4. **Project adaptation**: Ensure that AI-generated code is consistent with the architecture and design patterns of the existing codebase
5. **Do not submit pure vibe-coded PRs**: If you intend to rely entirely on AI to generate code without deeply understanding and controlling the implementation details (i.e. pure "vibe coding"), please **do not** submit a PR. Instead, feel free to post the implementation ideas, design proposals, references, and other insights you obtained from your conversations with the AI directly under the corresponding issue, so that other developers can benefit from them.

To be clear, we are not against AI — on the contrary, contributors who are familiar with the project also use AI to improve their productivity. However, the effort required to review a PR that was AI-generated and not fully understood by its submitter is already enough for a contributor familiar with the project structure to produce a change of equal or higher quality with the help of AI. So if you cannot take responsibility for the code you submit, please do not shift the review cost onto the maintainers.

Remember, AI tools are just auxiliary means, and the final code quality and correctness still need to be guaranteed by developers.
