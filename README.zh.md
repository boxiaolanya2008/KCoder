# KCoder

> 一个真正能用的终端 AI 编程助手。

<div style="border-left: 4px solid #0969da; padding: 12px 16px; margin: 16px 0; background-color: #f6f8fa; border-radius: 0 6px 6px 0;">

<p style="margin: 0; color: #1f2328;">
  <strong>KCoder</strong> 是一个带终端界面的命令行编程助手。它可以改文件、跑命令、分析代码，不用离开终端就能帮你写东西。
</p>

</div>

## 快速开始

全局安装：

```bash
# npm
npm i -g kcoder@latest

# 或者用 bun（推荐）
bun i -g kcoder@latest
```

然后直接运行：

```bash
# 在当前目录启动 TUI
kcoder

# 在指定目录启动 TUI
kcoder ~/my-project

# 启动无头 API 服务器
kcoder serve
```

## Agents

内置两种 Agent，按 `Tab` 键切换。

| Agent | 作用 |
|-------|------|
| **build** | 默认模式。可以改文件、跑命令，干正经活。 |
| **plan** | 只读模式。不会碰你的文件，除非你明确同意。适合探索不熟悉的代码库或规划改动。 |

还有一个 **general** 子 Agent，用来处理复杂的多步任务。在消息里输入 `@general` 就能调用。

## 功能特性

- **TUI 界面** - 交互式终端 UI，不用开浏览器
- **文件操作** - 直接读写修改文件
- **命令执行** - 运行 shell 命令，plan 模式下会询问权限
- **ACP 支持** - 通过 Agent Client Protocol 与编辑器集成（试试 `kcoder acp`）
- **插件系统** - 用自定义插件扩展功能
- **多模型支持** - 支持 OpenAI 兼容 API、GitHub Copilot 等多种 AI 提供商

## 开发

需要 **Bun 1.3+**。

```bash
bun install
bun dev
```

这是一个 monorepo，`packages/` 下面有几个包：

- `packages/kcoder/` - 主 CLI 应用
- `packages/core/` - 核心工具和共享代码
- `packages/plugin/` - 插件系统
- `packages/sdk/` - SDK 和 API 定义
- `packages/script/` - 构建和工具脚本

## 环境要求

- Bun 1.3+（这个项目用了一些 Bun 专属特性）
- Node.js 22+（部分构建工具需要）

## 许可证

MIT - 随便用，删了 `node_modules` 别怪我就行。
