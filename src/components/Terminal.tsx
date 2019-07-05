import React, { ChangeEvent, Component, FormEvent } from 'react';
import { History } from './History';
import Input from './Input';
import HelpMenu from './HelpMenu';
import services from '../services';
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
    const [commandName, commandArg] = inputValue.split(' ');

    let result: ServiceResponse['serviceResult'];
    switch (commandName) {
      case 'help':
        result = <HelpMenu />;
        break;
      case 'pwd':
        result = this.state.currentPath;
        break;
      case 'ls':
      case 'cat':
      case 'cd':
      case 'mkdir':
        try {
          const { serviceResult, updatedState } = await services[commandName](
            fileSystem,
            this.state.currentPath,
            commandArg,
          );
          result = serviceResult;

          if (updatedState) {
            this.setState(updatedState as TerminalState);
          }
        } catch (e) {
          result = `Error: ${e}`;
        }
        break;
      default:
        result = `command not found: ${commandName}`;
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
