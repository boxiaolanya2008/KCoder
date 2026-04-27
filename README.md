# KCoder

AI-powered CLI coding agent.

## Installation

```bash
# npm
npm i -g kcoder@latest

# bun
bun i -g kcoder@latest
```

## Usage

```bash
# Start TUI in current directory
kcoder

# Start TUI in specific directory
kcoder <directory>

# Start headless API server
kcoder serve

# Show help
kcoder --help
```

## Agents

KCoder includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

## Development

Requirements: Bun 1.3+

```bash
bun install
bun dev
```

## License

MIT
