import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History } from './History';
import Input from './Input';
import { cd, ls } from '../services';
import './Terminal.scss';

export class Terminal extends Component<TerminalProps, TerminalState> {
  public readonly state: TerminalState = {
    currentCommandId: 0,
    currentPath: '/',
    history: [],
    inputValue: '',
    promptChar: '$>',
  };

  private handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  private handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const { history, inputValue, currentPath, promptChar } = this.state;
    const commandArgs = inputValue.split(' ');

    let result = '';
    switch (commandArgs[0]) {
      case 'cd':
        try {
          const newPath = await cd(
            this.props.fileSystem,
            this.state.currentPath,
            commandArgs[1],
          );

          result = 'cd success';
          this.setState({
            currentPath: newPath,
          });
        } catch (cdException) {
          result = `cd: ${cdException}`;
        }
        break;
      case 'pwd':
        result = this.state.currentPath;
        break;
      case 'ls':
        try {
          const test = await ls(
            this.props.fileSystem,
            this.state.currentPath,
            commandArgs[1],
          );
          result = JSON.stringify(test);
        } catch (e) {
          result = e;
        }
        break;
      default:
        result = `termy: command not found: ${commandArgs[0]}`;
        break;
    }

    const updatedHistory = history.concat({
      input: (
        <Input
          currentPath={currentPath}
          inputValue={inputValue}
          promptChar={promptChar}
          readOnly={true}
        />
      ),
      id: this.state.currentCommandId,
      result,
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
      <div id="terminal-wrapper">
        <History history={history} />
        <Input
          currentPath={currentPath}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          inputValue={inputValue}
          promptChar={promptChar}
          readOnly={false}
        />
      </div>
    );
  }
}
