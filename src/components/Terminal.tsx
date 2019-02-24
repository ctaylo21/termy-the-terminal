import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History, HistoryItem } from './History';
import Input from './Input';

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

    const { history, inputValue } = this.state;

    const updatedHistory = history.concat({
      id: this.state.currentCommandId,
      result: 'Invalid command',
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
