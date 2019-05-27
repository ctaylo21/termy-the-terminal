import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History } from './History';
import Input from './Input';
import HelpMenu from './HelpMenu';
import LsResult from './LsResult';
import { cd, ls, mkdir } from '../services';
import './Terminal.scss';

export class Terminal extends Component<TerminalProps, TerminalState> {
  public readonly state: TerminalState = {
    currentCommandId: 0,
    currentPath: '/',
    history: [],
    inputValue: '',
    promptChar: '$>',
    fileSystem: this.props.fileSystem,
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

    const {
      history,
      inputValue,
      currentPath,
      promptChar,
      fileSystem,
    } = this.state;
    const commandArgs = inputValue.split(' ');

    let result: string | JSX.Element = '';
    switch (commandArgs[0]) {
      case 'cd':
        try {
          const newPath = await cd(
            fileSystem,
            this.state.currentPath,
            commandArgs[1],
          );

          this.setState({
            currentPath: newPath,
          });
        } catch (cdException) {
          result = `cd: ${cdException}`;
        }
        break;
      case 'help':
        result = <HelpMenu />;
        break;
      case 'pwd':
        result = this.state.currentPath;
        break;
      case 'mkdir':
        try {
          const newFileSystem = await mkdir(
            fileSystem,
            this.state.currentPath,
            commandArgs[1],
          );
          this.setState({
            fileSystem: newFileSystem,
          });
          result = `Folder created: ${commandArgs[1]}`;
          break;
        } catch (e) {
          result = `Error: ${e}`;
        }
        break;
      case 'ls':
        try {
          const lsResult = await ls(
            fileSystem,
            this.state.currentPath,
            commandArgs[1],
          );
          result = <LsResult lsResult={lsResult} />;
        } catch (e) {
          result = e;
        }
        break;
      default:
        result = `command not found: ${commandArgs[0]}`;
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
