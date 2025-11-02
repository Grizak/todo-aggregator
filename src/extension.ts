import * as vscode from "vscode";
import { TodoParser } from "./parser";
import { TodoTreeProvider } from "./todoTreeProvider";
import { TodoItem } from "./types";

export function activate(context: vscode.ExtensionContext) {
  console.log("TODO Aggregator is now active!");

  const parser = new TodoParser();
  const treeProvider = new TodoTreeProvider();

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = `$(checklist) TODOs: 0`;
  statusBarItem.command = "todo-aggregator.scan";
  statusBarItem.show();

  // Register the tree view
  const treeView = vscode.window.createTreeView("todoAggregator", {
    treeDataProvider: treeProvider,
  });

  // Function to scan and refresh
  async function scanAndRefresh() {
    statusBarItem.text = "$(sync~spin) Scanning...";
    const todos = await parser.parseWorkspace();
    treeProvider.refresh(todos);
    statusBarItem.text = `$(checklist) TODOs: ${todos.length}`;
  }

  // Command to manually scan for TODOs
  let scanCommand = vscode.commands.registerCommand(
    "todo-aggregator.scan",
    async () => {
      vscode.window.showInformationMessage("Scanning for TODOs...");
      await scanAndRefresh();
      vscode.window.showInformationMessage(`Scan complete!`);
    }
  );

  // Command to open a TODO location
  let openTodoCommand = vscode.commands.registerCommand(
    "todo-aggregator.openTodo",
    async (todoItem: TodoItem) => {
      const document = await vscode.workspace.openTextDocument(todoItem.file);
      const editor = await vscode.window.showTextDocument(document);

      const position = new vscode.Position(todoItem.line, 0);
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(
        new vscode.Range(position, position),
        vscode.TextEditorRevealType.Default
      );
    }
  );

  // Watch for file changes
  const fileWatcher = vscode.workspace.createFileSystemWatcher("**/*");

  // Debounce function to avoid to many scans
  let debounceTimer: NodeJS.Timeout | undefined;
  const debouncedScan = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      await scanAndRefresh();
    }, 500); // Wait 500ms after the last change
  };

  // Watch for file creation, changes and deletion
  fileWatcher.onDidCreate(debouncedScan);
  fileWatcher.onDidChange(debouncedScan);
  fileWatcher.onDidDelete(debouncedScan);

  // Also watch for active changes (when you type)
  vscode.workspace.onDidChangeTextDocument((event) => {
    // Only scan if the document is saved or after typing stops
    debouncedScan();
  });

  // Auto-scan on activation
  scanAndRefresh();

  context.subscriptions.push(
    scanCommand,
    openTodoCommand,
    treeView,
    fileWatcher,
    statusBarItem
  );
}

export function deactivate() {}
