# KCoder

AI 驱动的命令行编码助手。

## 安装

```bash
# npm
npm i -g kcoder@latest

# bun
bun i -g kcoder@latest
```

## 使用

```bash
# 在当前目录启动 TUI
kcoder

# 在指定目录启动 TUI
kcoder <directory>

# 启动无头 API 服务器
kcoder serve

# 显示帮助
kcoder --help
```

## Agents

KCoder 内置两种 Agent，可用 `Tab` 键快速切换：

- **build** - 默认模式，具备完整权限，适合开发工作
- **plan** - 只读模式，适合代码分析与探索
  - 默认拒绝修改文件
  - 运行 bash 命令前会询问
  - 便于探索未知代码库或规划改动

另外还包含一个 **general** 子 Agent，用于复杂搜索和多步任务，内部使用，也可在消息中输入 `@general` 调用。

## 开发

要求：Bun 1.3+

```bash
bun install
bun dev
```

## 许可证

MIT
