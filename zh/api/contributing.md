# 贡献指南 {#contributing}

如果你对参与 Cloudreve 的开发感兴趣，请参考本章节开始上手。要注意的是，Cloudreve 使用双许可证策略发行，社区版在 [GPL-3.0](https://github.com/cloudreve/cloudreve/blob/master/LICENSE) 下发行，而 Pro 版则使用私有许可证。我们只接受针对社区版的贡献，且贡献者需要在合并 PR 前签署 [CLA](https://cla-assistant.io/cloudreve/cloudreve)。

## 项目结构 {#project-structure}

Cloudreve 主仓库为 [cloudreve/cloudreve](https://github.com/cloudreve/cloudreve)，通过 git submodule 在主仓库中加入前端仓库 [cloudreve/frontend](https://github.com/cloudreve/frontend) 的依赖。

## 开始开发 {#start-developing}

### 开发环境 {#development-environment}

请参考 [从源代码编译](../overview/build#install-dependencies) 章节安装所需工具。

### 克隆仓库 {#clone-repository}

```bash
git clone --recurse-submodules https://github.com/cloudreve/cloudreve.git
cd cloudreve
```

### 启动后端 {#start-backend}

```bash
# 首次启动前，安装依赖
go mod download

# 启动后端
go run main.go
```

如果你需要传入[命令行参数](../overview/cli#global-parameters)：

```bash
go run main.go -c /path/to/conf.ini
```

因为没有嵌入前端静态资源，后端启动后，`http://localhost:5212` 仅能提供 API 服务。在一般开发流程中，你还需要启动前端开发服务器以便能访问本地站点。

### 启动前端 {#start-frontend}

保持后端服务器运行，在另一个终端中执行以下命令：

```bash
cd frontend
yarn install
yarn run dev
```

前端开发服务器启动后，你可以通过 `http://localhost:5173` 访问本地站点。默认情况下，所有 API 请求会被转发到 `http://localhost:5212`，你可以在 [`vite.config.ts`](https://github.com/cloudreve/frontend/blob/master/vite.config.ts) 中修改。

## 选择一个任务 {#select-a-task}

在 Cloudreve 的 [issue](https://github.com/cloudreve/cloudreve/issues?q=state%3Aopen%20label%3A%22backlog%22) 中，过滤出 label 带有 `Backlog` 的 issue，这些 issue 是待认领的任务。选择一个任务后，在 issue 中留言，表示你将认领该任务，并提醒维护者将此 issue 分配给你自己。

对于入门开发者，我们推荐选择 label 带有 `good first issue` 的 issue。

## 提议新的任务 {#propose-a-new-task}

如果你有新的任务想法，请在 [issue](https://github.com/cloudreve/cloudreve/issues) 中创建一个新 issue，详细描述你的想法和实现计划，并提醒维护者将其分配给你自己。请在等待其他开发者确认你的想法后，再开始开发。

## 提交 PR {#submit-pr}

在完成任务后，你可以提交 PR 到 [cloudreve/cloudreve](https://github.com/cloudreve/cloudreve) 和 [cloudreve/frontend](https://github.com/cloudreve/frontend) 仓库。PR 提交后，会有 Bot 引导你签署 CLA。

提交 PR 时，请遵循以下要求：

1. **PR 必须关联到已标有 `Backlog` label 的 issue**：我们不接受直接通过 PR 提出新功能的贡献。任何新功能或改动都必须先在 issue 中经过讨论、被维护者认可并打上 `Backlog` label 之后，才能开始开发并提交对应的 PR。如果你有新的想法，请先按照 [提议新的任务](#propose-a-new-task) 的流程创建 issue。
2. **每个 PR 只对应一个变更**：请保持 PR 的聚焦，一个 PR 只解决一个 issue 或实现一个功能点。对于大型 feature 或重构，请尽可能拆分成多个较小的 PR 分批合并，这样有利于 Review 和后续的问题追踪。

## 讨论 {#discussion}

你可以在 Discord 社区的 [development](https://discord.com/channels/1343585183047094367/1343585679585579018) 频道中与开发者讨论任务细节，或者是获取支持。

## AIGC

我们不反对使用 AI 生成代码工具（AIGC）来辅助开发，但是我们坚决反对 "vibe coding"（即盲目复制粘贴 AI 生成的代码而不理解其含义）。

### 使用 AIGC 的准则 {#aigc-guidelines}

如果你选择使用 AI 工具来辅助开发，请遵循以下准则：

1. **理解每一行代码**：你必须完全理解 AI 生成的每一行代码的作用和原理
2. **仔细审查**：检查 AI 生成的代码是否符合项目的编码规范和最佳实践
3. **充分测试**：对 AI 生成的代码进行全面测试，确保其正确性和稳定性
4. **适配项目**：确保 AI 生成的代码与现有代码库的架构和设计模式保持一致
5. **不要提交纯 vibe coding 的 PR**：如果你打算完全依赖 AI 生成代码而不去深入理解和把控实现细节（即完全的 "vibe coding"），请**不要**提交 PR。作为替代，你可以直接在对应的 issue 下补充你与 AI 交流过程中得到的实现思路、设计方案、参考资料等，供其他开发者参考。

需要强调的是，我们并不排斥 AI——恰恰相反，熟悉项目结构的成员同样会使用 AI 来提升开发效率。但从零开始 Review 一个由 AI 生成、提交者本人并未完全理解的 PR 所需要投入的精力，已经足以让熟悉项目结构的成员借助 AI 写出相同质量、甚至更优的变更。因此，如果你无法对提交的代码负责，请不要将 Review 成本转嫁给维护者。

记住，AI 工具只是辅助手段，最终的代码质量和正确性仍然需要开发者来保证。
