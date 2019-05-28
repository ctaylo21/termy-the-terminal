declare interface TerminalFile {
  [key: string]: 'FILE' | string;
  type: 'FILE';
  content: string;
  extension: 'txt';
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
  fileSystem: FileSystem;
}

declare interface TerminalProps {
  fileSystem: FileSystem;
}

declare interface HistoryItem {
  input: JSX.Element;
  id: number;
  result: string | JSX.Element;
  value: string;
}

declare interface HistoryProps {
  history: HistoryItem[];
}

declare interface LsResultType {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}
