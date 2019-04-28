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
    promptChar: '→',
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

    const commandArgs = this.state.inputValue.split(' ');

    const { history, inputValue } = this.state;

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
          result = cdException;
        }
        break;
      case 'pwd':
        result = this.state.currentPath;
        break;
      case 'ls':
        const pathToLs = commandArgs[1]
          ? commandArgs[1].startsWith('/')
            ? commandArgs[1]
            : `${this.state.currentPath}/${commandArgs[1]}`
          : this.state.currentPath;

        try {
          const test = await ls(this.props.fileSystem, pathToLs);
          result = JSON.stringify(test);
        } catch (e) {
          result = e;
        }
        break;
      default:
        result = 'Invalid command';
        break;
    }

    const updatedHistory = history.concat({
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
