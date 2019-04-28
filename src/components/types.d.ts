declare interface TerminalFile {
  [key: string]: 'FILE';
  type: 'FILE';
}

declare interface TerminalFolder {
  [key: string]: 'FOLDER' | FileSystem | null;
  type: 'FOLDER';
  children: FileSystem | null;
}

declare interface FileSystem {
  [key: string]: TerminalFolder | TerminalFile;
}

declare interface TerminalState {
  currentCommandId: number;
  currentPath: string;
  history: HistoryItem[];
  inputValue: string;
  promptChar: string;
}

declare interface TerminalProps {
  fileSystem: FileSystem;
}

declare interface HistoryItem {
  id: number;
  result: string;
  value: string;
}

declare interface HistoryProps {
  history: HistoryItem[];
}

declare interface LsResultType {
  [index: string]: { type: 'FOLDER' | 'FILE' };
}
