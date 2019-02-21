import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History, IHistoryItem } from './History';
import Input from './Input';

interface IState {
  currentCommandId: number;
  currentPath: string;
  history: IHistoryItem[];
  inputValue: string;
  promptChar: string;
}

export default class Terminal extends Component<object, IState> {
  readonly state: IState = {
    currentCommandId: 0,
    currentPath: '/home/user',
    history: [],
    inputValue: '',
    promptChar: '→',
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debugger;
    this.setState({
      inputValue: event.target.value,
    });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { history, inputValue } = this.state;

    const updatedHistory = history.concat({
      id: this.state.currentCommandId,
      result: 'Incmmand',
      value: inputValue,
    });

    debugger;

    this.setState({
      currentCommandId: this.state.currentCommandId++,
      history: updatedHistory,
      inputValue: '',
    });
  };

  render() {
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
