import * as vscode from "vscode";
import * as path from "path";
import { TodoItem } from "./types";

export class TodoTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly todoItem?: TodoItem
  ) {
    super(label, collapsibleState);

    if (todoItem) {
      const fileName = path.basename(todoItem.file);
      const lineNum = todoItem.line + 1;

      // Build description with priority and author if available
      let descParts = [`${fileName}:${lineNum}`];
      if (todoItem.priority) {
        descParts.unshift(`[${todoItem.priority}]`);
      }
      if (todoItem.author) {
        descParts.push(`@${todoItem.author}`);
      }

      this.description = descParts.join(" ");

      // Enhanced tooltip
      let tooltipText = `${todoItem.tag}: ${todoItem.text}\n\n`;
      tooltipText += `File: ${todoItem.file}\n`;
      tooltipText += `Line: ${lineNum}`;
      if (todoItem.priority) {
        tooltipText += `\nPriority: ${todoItem.priority}`;
      }
      if (todoItem.author) {
        tooltipText += `\nAuthor: ${todoItem.author}`;
      }

      this.tooltip = tooltipText;

      // Make it clickable
      this.command = {
        command: "todo-aggregator.openTodo",
        title: "Open TODO",
        arguments: [todoItem],
      };

      // Set icon based on priority if available, otherwise tag
      this.iconPath = new vscode.ThemeIcon(
        this.getIconForTodo(todoItem.tag, todoItem.priority)
      );
    }
  }

  private getIconForTodo(tag: string, priority?: string): string {
    // Priority takes precedence
    if (priority) {
      switch (priority.toUpperCase()) {
        case "HIGH":
        case "URGENT":
          return "alert";
        case "MEDIUM":
          return "warning";
        case "LOW":
          return "info";
      }
    }

    // Fall back to tag-based icons
    switch (tag.toUpperCase()) {
      case "TODO":
        return "checklist";
      case "FIXME":
        return "tools";
      case "HACK":
        return "warning";
      case "BUG":
        return "bug";
      case "NOTE":
        return "note";
      default:
        return "comment";
    }
  }
}

export class TodoTreeProvider implements vscode.TreeDataProvider<TodoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TodoTreeItem | undefined | null | void
  > = new vscode.EventEmitter<TodoTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TodoTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private todos: TodoItem[] = [];

  constructor() {}

  refresh(todos: TodoItem[]): void {
    this.todos = todos;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TodoTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TodoTreeItem): Thenable<TodoTreeItem[]> {
    if (!element) {
      // Root level - group by tag
      const groupedByTag = this.groupByTag(this.todos);

      // If there are no todos, return a single informative item
      if (Object.keys(groupedByTag).length === 0) {
        const emptyItem = new TodoTreeItem(
          "No todos right now",
          vscode.TreeItemCollapsibleState.None
        );
        // give it a subtle icon and context so it can be styled or ignored by commands
        emptyItem.iconPath = new vscode.ThemeIcon("info");
        emptyItem.contextValue = "noTodos";
        emptyItem.tooltip =
          "There are currently no TODOs found in the workspace.";

        return Promise.resolve([emptyItem]);
      }

      return Promise.resolve(
        Object.entries(groupedByTag).map(
          ([tag, items]) =>
            new TodoTreeItem(
              `${tag} (${items.length})`,
              vscode.TreeItemCollapsibleState.Expanded
            )
        )
      );
    } else {
      // Child level - show individual TODOs
      const tag = element.label.split(" ")[0]; // Extract tag from "TODO (5)"
      const items = this.todos.filter((todo) => todo.tag === tag);

      return Promise.resolve(
        items.map(
          (todo) =>
            new TodoTreeItem(
              todo.text,
              vscode.TreeItemCollapsibleState.None,
              todo
            )
        )
      );
    }
  }

  private groupByTag(todos: TodoItem[]): Record<string, TodoItem[]> {
    return todos.reduce((acc, todo) => {
      if (!acc[todo.tag]) {
        acc[todo.tag] = [];
      }
      acc[todo.tag].push(todo);
      return acc;
    }, {} as Record<string, TodoItem[]>);
  }
}
