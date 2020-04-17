import React, { ChangeEvent, Component, FormEvent, KeyboardEvent } from 'react';
import AutoCompleteList from './components/AutoCompleteList';
import History from './components/History';
import Input from './components/Input';
import commands from './commands';
import './styles/Terminal.scss';
import { parseCommand } from './commands/utilities/index';

export interface TerminalState {
  autoCompleteIsActive: boolean;
  autoCompleteActiveItem: number;
  currentCommandId: number;
  currentHistoryId: number;
  currentPath: string;
  fileSystem: FileSystem;
  history: HistoryItem[];
  inputPrompt: string;
  inputValue: string;
  autoCompleteItems?: AutoCompleteListData;
}

export interface HistoryItem {
  input: JSX.Element;
  id: number;
  result: CommandResponse['commandResult'];
  value: string;
}

export interface TerminalProps {
  fileSystem: FileSystem;
  inputPrompt?: string;
}

export interface FileSystem {
  [key: string]: TerminalFolder | TerminalFile;
}

export type TerminalFile = TerminalTextFile | TerminalImageFile;

export interface TerminalTextFile {
  [key: string]: 'FILE' | string | JSX.Element;
  type: 'FILE';
  content: string | JSX.Element;
  extension: 'txt';
}

export interface TerminalImageFile {
  [key: string]: 'FILE' | string;
  type: 'FILE';
  content: string;
  extension: 'jpg' | 'png' | 'gif';
}

export interface TerminalFolder {
  [key: string]: 'FOLDER' | FileSystem | null;
  type: 'FOLDER';
  children: FileSystem | null;
}

export interface AutoCompleteListData {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}

export type CommandResponse = {
  updatedState?: Partial<TerminalState>;
  commandResult?: JSX.Element | string;
};

export type AutoCompleteResponse = {
  commandResult?: AutoCompleteListData | null;
};

export class Terminal extends Component<TerminalProps, TerminalState> {
  public readonly state: TerminalState = {
    autoCompleteIsActive: false,
    autoCompleteActiveItem: -1,
    currentCommandId: 0,
    currentPath: '/',
    currentHistoryId: -1,
    fileSystem: this.props.fileSystem,
    history: [],
    inputPrompt: this.props.inputPrompt || '$>',
    inputValue: '',
  };

  private inputWrapper = React.createRef<HTMLDivElement>();

  private terminalInput = React.createRef<HTMLInputElement>();

  public componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.terminalInput.current!.focus();
  }

  public componentDidUpdate(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.inputWrapper.current!.scrollIntoView({ behavior: 'smooth' });
  }

  private handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  private handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    // Prevent behavior of up arrow moving cursor to beginning of line in Chrome (and possibly others)
    if (
      event.keyCode == 38 ||
      event.key === 'ArrowUp' ||
      event.keyCode == 9 ||
      event.key === 'Tab'
    ) {
      event.preventDefault();
    }

    const handleUpArrowKeyPress = (): void => {
      // Handle no history item to show
      if (this.state.currentHistoryId < 0) {
        return;
      }

      // Handle showing very first item from history
      if (this.state.currentHistoryId === 0) {
        this.setState({
          inputValue: this.state.history[this.state.currentHistoryId].value,
        });
      }

      // Handle show previous history item
      if (this.state.currentHistoryId > 0) {
        this.setState({
          currentHistoryId: this.state.currentHistoryId - 1,
          inputValue: this.state.history[this.state.currentHistoryId].value,
        });
      }
    };

    const handleDownArrowKeyPress = (): void => {
      // Handle showing next history item
      if (this.state.currentHistoryId + 1 < this.state.currentCommandId) {
        this.setState({
          currentHistoryId: this.state.currentHistoryId + 1,
          inputValue: this.state.history[this.state.currentHistoryId + 1].value,
        });
      }

      // Handle when no next history item exists
      if (this.state.currentHistoryId + 1 >= this.state.currentCommandId) {
        this.setState({
          inputValue: '',
        });
      }
    };

    const handleTabPress = async (): Promise<void> => {
      const {
        autoCompleteActiveItem,
        autoCompleteIsActive,
        autoCompleteItems,
        inputValue,
        currentPath,
        fileSystem,
      } = this.state;
      const { commandName, commandTargets } = parseCommand(inputValue);

      const formatItemForAutoComplete = (
        fileSystem: AutoCompleteListData,
        itemKey: number,
      ): string => {
        const targetRawName = Object.keys(fileSystem)[itemKey];
        return fileSystem[targetRawName].type === 'FOLDER'
          ? `${targetRawName}/`
          : targetRawName;
      };

      const cycleThroughAutoCompleteItems = (
        itemList: AutoCompleteListData,
      ): void => {
        const previewItemCount = Object.keys(itemList).length;

        let newAutoCompleteActiveItemIndex = 0;
        if (autoCompleteActiveItem < previewItemCount - 1) {
          newAutoCompleteActiveItemIndex = autoCompleteActiveItem + 1;
        }

        const targetFormattedName = formatItemForAutoComplete(
          itemList,
          newAutoCompleteActiveItemIndex,
        );

        let targetPathToUpdate = commandTargets[0]
          .replace(/\/$/, '')
          .split('/')
          .slice(-1)
          .pop();

        if (
          targetPathToUpdate !==
            Object.keys(itemList)[autoCompleteActiveItem] &&
          commandTargets[0].endsWith('/')
        ) {
          targetPathToUpdate = '';
        }

        // Cases:
        // 1) Matching a partial like "fi" when "file1.txt" is an option
        // 2) Replacing last value full file path like /home/user/ when user/ is AC option
        // 3) Appending onto path like "home/" when "home" isn't in AC and is part of base path
        let updatedInputValue = inputValue + targetFormattedName;
        if (targetPathToUpdate) {
          const isCurrentItemFolder = commandTargets[0].endsWith('/');
          updatedInputValue = inputValue.replace(
            new RegExp(
              isCurrentItemFolder
                ? `${targetPathToUpdate}\/$`
                : `${targetPathToUpdate}$`,
            ),
            targetFormattedName,
          );
        }

        this.setState(
          Object.assign({
            autoCompleteActiveItem: newAutoCompleteActiveItemIndex,
            inputValue: updatedInputValue,
          }),
        );
      };

      const generateAutoCompleteList = async (): Promise<void> => {
        let commandResult: AutoCompleteResponse['commandResult'];
        if (commands[`${commandName}AutoComplete`]) {
          ({ commandResult } = await commands[`${commandName}AutoComplete`](
            fileSystem,
            currentPath,
            commandTargets[0],
          ));
        } else {
          // Do nothing if tab is not supported
          return;
        }

        if (commandResult) {
          if (Object.keys(commandResult).length === 1) {
            const targetPathToUpdate = commandTargets[0]
              .split('/')
              .slice(-1)
              .pop() as string;

            const targetFormattedName = formatItemForAutoComplete(
              commandResult,
              0,
            );

            let updatedInputValue = inputValue + targetFormattedName;
            if (targetPathToUpdate) {
              const isCurrentItemFolder = commandTargets[0].endsWith('/');
              updatedInputValue = inputValue.replace(
                new RegExp(
                  isCurrentItemFolder
                    ? `${targetPathToUpdate}\/$`
                    : `${targetPathToUpdate}$`,
                ),
                targetFormattedName,
              );
            }

            this.setState(
              Object.assign({
                inputValue: updatedInputValue,
              }),
            );
          } else {
            this.setState(
              Object.assign({
                autoCompleteIsActive: true,
                autoCompleteItems: commandResult,
              }),
            );
          }
        }
      };

      // Autocomplete menu is visible, handle tabbing through options
      if (autoCompleteIsActive && autoCompleteItems) {
        cycleThroughAutoCompleteItems(autoCompleteItems);
      } else {
        generateAutoCompleteList();
      }
    };

    // If we do anything other than tab, clear autocomplete state
    if (!(event.keyCode == 9 || event.key === 'Tab')) {
      this.setState(
        Object.assign({
          autoCompleteActiveItem: -1,
          autoCompleteIsActive: false,
          autoCompleteItems: undefined,
        }),
      );
    }

    if (event.keyCode == 38 || event.key === 'ArrowUp') {
      handleUpArrowKeyPress();
    }

    if (event.keyCode == 40 || event.key === 'ArrowDown') {
      handleDownArrowKeyPress();
    }

    if (event.keyCode == 9 || event.key === 'Tab') {
      handleTabPress();
    }
  };

  private handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const {
      history,
      inputValue,
      currentPath,
      inputPrompt,
      fileSystem,
    } = this.state;
    const { commandName, commandOptions, commandTargets } = parseCommand(
      inputValue,
    );

    let commandResult: CommandResponse['commandResult'];
    let updatedState: CommandResponse['updatedState'] = {};
    if (commandName in commands) {
      try {
        ({ commandResult, updatedState = {} } = await commands[commandName](
          fileSystem,
          currentPath,
          commandTargets[0],
          ...commandOptions,
        ));
      } catch (e) {
        commandResult = `Error: ${e}`;
      }
    } else {
      commandResult = `command not found: ${commandName}`;
    }

    const updatedHistory = history.concat({
      input: (
        <Input
          currentPath={currentPath}
          inputValue={inputValue}
          inputPrompt={inputPrompt}
          readOnly={true}
        />
      ),
      id: this.state.currentCommandId,
      result: commandResult,
      value: inputValue,
    });

    this.setState(
      Object.assign(
        {
          autoCompleteIsActive: false,
          currentCommandId: this.state.currentCommandId + 1,
          currentHistoryId: this.state.currentCommandId,
          history: updatedHistory,
          inputValue: '',
          autoCompleteItems: undefined,
        },
        updatedState,
      ) as TerminalState,
    );
  };

  public render(): JSX.Element {
    const {
      autoCompleteActiveItem,
      currentPath,
      history,
      inputPrompt,
      inputValue,
      autoCompleteItems,
    } = this.state;

    return (
      <div id="terminal-wrapper">
        <History history={history} />
        <div ref={this.inputWrapper}>
          <Input
            currentPath={currentPath}
            handleChange={this.handleChange}
            handleKeyDown={this.handleKeyDown}
            handleSubmit={this.handleSubmit}
            inputValue={inputValue}
            inputPrompt={inputPrompt}
            ref={this.terminalInput}
            readOnly={false}
          />
        </div>
        <div aria-label="autocomplete-preview" className="tab-complete-result">
          {autoCompleteItems && (
            <AutoCompleteList
              items={autoCompleteItems}
              activeItemIndex={autoCompleteActiveItem}
            />
          )}
        </div>
      </div>
    );
  }
}
