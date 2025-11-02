import * as vscode from "vscode";
import { TodoItem } from "./types";

export class TodoParser {
  // Updated regex to handle various comment formats more flexibly
  private readonly todoPattern =
    /(?:\/\/|\/\*|#|<!--|;)\s*(TODO|FIXME|HACK|NOTE|BUG)(?:\s*\[(\w+)\])?\s*(?:@(\w+))?\s*:?\s*(.+?)(?:\*\/|-->)?$/gim;
  private capitalizeFirst(str: string | undefined): string | undefined {
    return str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : undefined;
  }

  async parseFile(uri: vscode.Uri): Promise<TodoItem[]> {
    const todos: TodoItem[] = [];

    try {
      const document = await vscode.workspace.openTextDocument(uri);
      const text = document.getText();
      const lines = text.split("\n");

      lines.forEach((line, lineIndex) => {
        // Reset regex state for each line
        this.todoPattern.lastIndex = 0;

        const match = this.todoPattern.exec(line);
        if (match) {
          todos.push({
            tag: match[1], // TODO, FIXME, etc.
            priority: match[2], // HIGH, MEDIUM, LOW (if present)
            author: this.capitalizeFirst(match[3]), // @username (if present) (First letter capitalized)
            text: match[4].trim(), // The actual comment text
            file: uri.fsPath,
            line: lineIndex,
          });
        }
      });
    } catch (error) {
      console.error(`Error parsing file ${uri.fsPath}:`, error);
    }

    return todos;
  }

  async parseWorkspace(): Promise<TodoItem[]> {
    // Find ALL files, excluding binary and generated directories
    const files = await vscode.workspace.findFiles(
      "**/*",
      "{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**,**/*.min.*,**/*.bundle.*,**/.next/**,**/.vscode/**,**/coverage/**,**/*.lock,**/package-lock.json,**/yarn.lock,**/pnpm-lock.yaml}"
    );

    const allTodos: TodoItem[] = [];

    // Filter to only text files by checking file size and attempting to read
    for (const file of files) {
      try {
        // Skip if file is too large (> 1MB) - likely binary
        const stats = await vscode.workspace.fs.stat(file);
        if (stats.size > 1024 * 1024) {
          continue;
        }

        // Try to parse - will fail gracefully for binary files
        const todos = await this.parseFile(file);
        allTodos.push(...todos);
      } catch (error) {
        // Skip files that can't be read as text
        continue;
      }
    }

    return allTodos;
  }
}
