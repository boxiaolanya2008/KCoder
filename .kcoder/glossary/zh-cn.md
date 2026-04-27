# zh-cn Glossary

## Sources

- PR #13942: https://github.com/yourname/kcoder/pull/13942

## Do Not Translate (Locale Additions)

- `KCoder` (preserve casing in prose; keep `KCoder` only when it is part of commands, package names, paths, or code)
- `KCoder Zen`
- `KCoder CLI`
- `CLI`, `TUI`, `MCP`, `OAuth`
- `Model Context Protocol` (prefer the English expansion when introducing `MCP`)

## Preferred Terms

These are preferred terms for docs/UI prose and may evolve.

| English                 | Preferred | Notes                                       |
| ----------------------- | --------- | ------------------------------------------- |
| prompt                  | 提示�?   | Keep `--prompt` unchanged in flags/code     |
| session                 | 会话      |                                             |
| provider                | 提供�?   |                                             |
| share link / shared URL | 分享链接  | Prefer `分享` for user-facing share actions |
| headless (server)       | 无界�?   | Docs wording                                |
| authentication          | 认证      | Prefer in auth/OAuth contexts               |
| cache                   | 缓存      |                                             |
| keybind / shortcut      | 快捷�?   | User-facing docs wording                    |
| workflow                | 工作�?   | e.g. GitHub Actions workflow                |

## Guidance

- Prefer natural, concise phrasing over literal translation
- Keep the tone direct and friendly (PR #13942 consistently moved wording in this direction)
- Preserve technical artifacts exactly: commands, flags, code, inline code, URLs, file paths, model IDs
- Keep enum-like values in English when they are literals (for example, `default`, `json`)
- Prefer consistent terminology across pages once a term is chosen (`会话`, `提供商`, `提示词`, etc.)

## Avoid

- Avoid `KCoder` in prose when referring to the product name; use `KCoder`
- Avoid mixing alternative terms for the same concept across docs when a preferred term is already established
