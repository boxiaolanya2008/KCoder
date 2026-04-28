# @kcoder/kcoder

This is the main KCoder CLI application package. It contains the TUI, agent logic, session management, and everything else that makes KCoder actually run.

## What lives here

- `src/index.ts` - Entry point
- `src/tui/` - Terminal UI components and rendering
- `src/agent/` - Agent implementations (build, plan, general)
- `src/session/` - Session state and management
- `src/tool/` - Built-in tools (file edit, bash, etc.)
- `src/provider/` - AI provider integrations (OpenAI, Copilot, etc.)
- `src/acp/` - Agent Client Protocol implementation
- `src/sync/` - Event sourcing system for session sync
- `src/db/` - Database schema and queries (Drizzle)

## Running locally

```bash
bun run src/index.ts
```

## Testing

```bash
bun test
```

## Notes

This package is kind of the "kitchen sink" - most of the application logic lives here. The other packages (`core`, `plugin`, `sdk`) are either shared utilities or separable concerns.

If you're trying to understand how KCoder works, start with `src/index.ts` and follow the agent flow.
