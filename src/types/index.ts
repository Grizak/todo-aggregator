export interface TodoItem {
  text: string; // The actual TODO text
  tag: string; // TODO, FIXME, HACK, etc.
  file: string; // File path
  line: number; // Line number
  priority?: string; // High, Medium, Low
  author?: string; // @username if present
}
