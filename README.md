# KCoder

> AI-powered CLI coding agent that actually works in your terminal.

<div style="border-left: 4px solid #0969da; padding: 12px 16px; margin: 16px 0; background-color: #f6f8fa; border-radius: 0 6px 6px 0;">

<p style="margin: 0; color: #1f2328;">
  <strong>KCoder</strong> is a command-line coding assistant with a terminal UI. It can edit files, run commands, analyze code, and help you build stuff without leaving your shell.
</p>

</div>

## Quick Start

Install it globally:

```bash
# npm
npm i -g kcoder@latest

# or if you're using bun (recommended)
bun i -g kcoder@latest
```

Then just run it:

```bash
# Start TUI in current directory
kcoder

# Start TUI in a specific directory
kcoder ~/my-project

# Start headless API server
kcoder serve
```

## Agents

KCoders has two built-in agents. Hit `Tab` to switch between them.

| Agent | What it does |
|-------|-------------|
| **build** | Default. Full access to edit files, run commands, do actual work. |
| **plan** | Read-only. Wont touch your files unless you say so. Good for exploring unfamiliar codebases or planning changes. |

There's also a **general** subagent for complex multi-step tasks. Use it by typing `@general` in your messages.

## Features

- **TUI Interface** - Interactive terminal UI, no browser needed
- **File Operations** - Read, write, edit files directly
- **Bash Execution** - Run shell commands with permission prompts in plan mode
- **ACP Support** - Works with editors via the Agent Client Protocol (try `kcoder acp`)
- **Plugin System** - Extend functionality with custom plugins
- **Multi-Provider** - Supports various AI providers including OpenAI-compatible APIs and GitHub Copilot

## Development

You need **Bun 1.3+**.

```bash
bun install
bun dev
```

This is a monorepo with several packages under `packages/`:

- `packages/kcoder/` - Main CLI application
- `packages/core/` - Core utilities and shared code
- `packages/plugin/` - Plugin system
- `packages/sdk/` - SDK and API definitions
- `packages/script/` - Build and utility scripts

## Requirements

- Bun 1.3+ (this project uses Bun-specific features)
- Node.js 22+ (for some build tools)

## License

MIT - do whatever you want, just don't blame us if it deletes your `node_modules`.
