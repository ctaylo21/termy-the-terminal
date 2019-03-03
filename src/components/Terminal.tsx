import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History, HistoryItem } from './History';
import Input from './Input';
import cd from './services/cd';

export interface File {
  type: 'FILE';
  children: null;
}

export interface Folder {
  type: 'FOLDER';
  children?: FileSystem | null;
}

export interface FileSystem {
  [key: string]: Folder | File;
}

interface TerminalState {
  currentCommandId: number;
  currentPath: string;
  history: HistoryItem[];
  inputValue: string;
  promptChar: string;
}

export default class Terminal extends Component<object, TerminalState> {
  public readonly state: TerminalState = {
    currentCommandId: 0,
    currentPath: '/home/user',
    history: [],
    inputValue: '',
    promptChar: '→',
  };

  private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const commands = event.target; //.value.split(' ');
    console.log(event.target);

    const { history, inputValue } = this.state;

    let result = '';
    /* switch (commands[0]) {
      default:
        result = 'Invalid command';
        break;
    }*/

    const updatedHistory = history.concat({
      id: this.state.currentCommandId,
      result: result,
      value: inputValue,
    });

    this.setState({
      currentCommandId: this.state.currentCommandId + 1,
      history: updatedHistory,
      inputValue: '',
    });
  };

  public render(): JSX.Element {
    const { currentPath, history, inputValue, promptChar } = this.state;
    return (
      <>
        <History history={history} />
        <Input
          currentPath={currentPath}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          inputValue={inputValue}
          promptChar={promptChar}
        />
      </>
    );
  }
}
