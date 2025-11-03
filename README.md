# TODO Aggregator

A powerful VSCode extension that scans your entire workspace for TODO, FIXME, HACK, BUG, and NOTE comments, displaying them in an organized tree view with real-time updates.

## Features

### 🔍 Comprehensive Scanning
- Automatically detects TODO comments across **all text files** in your workspace
- Supports multiple comment styles: `//`, `/* */`, `#`, `<!-- -->`, and `;`
- Recognizes common tags: `TODO`, `FIXME`, `HACK`, `BUG`, `NOTE`

### 📊 Organized Tree View
- Groups TODOs by tag type for easy navigation
- Shows file name, line number, and count per category
- Click any TODO to jump directly to its location in the code

### ⚡ Real-Time Updates
- Automatically refreshes as you type (with smart debouncing)
- Watches for file creation, modification, and deletion
- No manual refresh needed - always up to date

### 🏷️ Enhanced Metadata
- **Priority Tags**: Mark TODOs with `[HIGH]`, `[MEDIUM]`, or `[LOW]` priority
- **Author Attribution**: Tag team members with `@username`
- **Smart Icons**: Visual indicators based on tag type and priority level

## Usage

### Basic TODO Comments

```typescript
// TODO: Implement user authentication
/* FIXME: Fix memory leak in data processing */
# HACK: Temporary workaround for API issue
<!-- NOTE: This component needs refactoring -->
```

### Advanced TODO Comments with Metadata

```typescript
// TODO [HIGH]: Critical security vulnerability
// FIXME [MEDIUM] @john: Optimize database queries
// HACK [LOW] @jane: Remove this before production
```

### View Your TODOs

1. Open the **Explorer** sidebar
2. Find the **TODO Aggregator** panel
3. TODOs are automatically grouped by tag type (TODO, FIXME, etc.)
4. Click any TODO to navigate to its location

### Manual Refresh

While the extension updates automatically, you can manually refresh by clicking the refresh icon (🔄) in the TODO Aggregator panel title bar.

## Commands

- `TODO Aggregator: Refresh TODOs` - Manually scan and refresh all TODOs

Access commands via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)

## Extension Settings

This extension works out of the box with no configuration required. It automatically:
- Scans all text files in your workspace
- Excludes `node_modules`, `.git`, `dist`, `build`, and other common directories
- Ignores binary files and files larger than 1MB

## Supported Comment Styles

| Language | Comment Style | Example |
|----------|--------------|---------|
| JavaScript/TypeScript | `//` or `/* */` | `// TODO: Add validation` |
| Python/Ruby/Shell | `#` | `# FIXME: Handle edge case` |
| HTML/XML | `<!-- -->` | `<!-- TODO: Update markup -->` |
| Lisp/Assembly | `;` | `; HACK: Temporary fix` |

## Priority Levels

Use square brackets to indicate priority:

- `[HIGH]` or `[URGENT]` - Shows alert icon (🔴)
- `[MEDIUM]` - Shows warning icon (🟡)  
- `[LOW]` - Shows info icon (🔵)

Example:
```typescript
// TODO [HIGH]: This needs immediate attention!
```

## Author Attribution

Tag team members using `@username`:

```typescript
// TODO @alice: Please review this logic
// FIXME [HIGH] @bob: Critical bug in authentication
```

Author names are automatically capitalized in the display.

## Known Limitations

- Files larger than 1MB are skipped to avoid performance issues
- Binary files are automatically excluded
- Multiline TODO comments are not currently supported (each line is treated separately)

## Tips

1. **Be Specific**: Write clear, actionable TODO comments
2. **Use Priorities**: Mark urgent items with `[HIGH]` for visibility
3. **Tag Team Members**: Use `@username` to assign TODOs
4. **Stay Organized**: Use different tags (TODO vs FIXME vs HACK) to categorize work

## Requirements

- Visual Studio Code 1.80.0 or higher

## Release Notes

### 1.0.0

Initial release of TODO Aggregator

**Features:**
- Workspace-wide TODO scanning
- Real-time file watching and auto-refresh
- Priority and author metadata support
- Tree view with tag grouping
- Click-to-navigate functionality
- Smart debouncing for performance

---

## Installation

Install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=grizak.todo-aggregator) or search for "Todo Aggregator" in the VSCode Extensions panel.

## Feedback & Contributions

Found a bug or have a feature request? Feel free to reach out, add an [issue](https://github.com/Grizak/todo-aggregator/issues) in the github repo or leave a review on the marketplace!

**Enjoy organizing your TODOs!** ✨
