import { Component } from 'react';
import './styles/Terminal.scss';
export interface TerminalState {
    currentCommandId: number;
    currentPath: string;
    history: HistoryItem[];
    inputValue: string;
    promptChar: string;
    fileSystem: FileSystem;
}
export interface HistoryItem {
    input: JSX.Element;
    id: number;
    result: CommandResponse['commandResult'];
    value: string;
}
export interface TerminalProps {
    fileSystem: FileSystem;
}
export interface FileSystem {
    [key: string]: TerminalFolder | TerminalFile;
}
export interface TerminalFile {
    [key: string]: 'FILE' | string;
    type: 'FILE';
    content: string;
    extension: 'txt';
}
export interface TerminalFolder {
    [key: string]: 'FOLDER' | FileSystem | null;
    type: 'FOLDER';
    children: FileSystem | null;
}
export declare type CommandResponse = {
    updatedState?: Partial<TerminalState>;
    commandResult?: JSX.Element | string;
};
export declare class Terminal extends Component<TerminalProps, TerminalState> {
    readonly state: TerminalState;
    private inputWrapper;
    componentDidUpdate(): void;
    private handleChange;
    private handleSubmit;
    render(): JSX.Element;
}
