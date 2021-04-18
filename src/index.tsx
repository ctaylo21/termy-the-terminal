import React, { ChangeEvent, Component, FormEvent, KeyboardEvent } from 'react';
import AutoCompleteList from './components/AutoCompleteList';
import History from './components/History';
import Input from './components/Input';
import commands from './commands';
import './styles/Terminal.scss';
import { parseCommand } from './commands/utilities';
import {
  formatItem,
  getTargetPath,
  getUpdatedInputValueFromTarget,
} from './helpers/autoComplete';
import TerminalContext from './context/TerminalContext';

let commandList = commands;

// Export utility methods for external use
export * as utilities from './commands/utilities';

// Export default autoComplete function for external use
export { default as autoComplete } from './commands/autoComplete';

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
  autoCompleteItems?: ItemListType;
  paddingOffset: number;
  lastHistoryDivOffset: number;
}

export interface HistoryItem {
  input: JSX.Element;
  id: number;
  result: CommandResponse['commandResult'];
  value: string;
}

export interface CommandHandler {
  (
    fileSystem?: FileSystem,
    currentPath?: string,
    targetPath?: string,
    options?: string,
  ): Promise<CommandResponse>;
}

export interface CommandAutoCompleteHandler {
  (
    fileSystem: FileSystem,
    currentPath: string,
    target: string,
  ): Promise<AutoCompleteResponse>;
}

export interface Command {
  autoCompleteHandler?: CommandAutoCompleteHandler;
  description?: string;
  handler: CommandHandler;
}

export interface TerminalProps {
  fileSystem: FileSystem;
  inputPrompt?: string;
  customCommands?: {
    [key: string]: Command;
  };
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

export type CommandResponse = {
  updatedState?: Partial<TerminalState>;
  commandResult?: JSX.Element | string;
};

export interface ItemListType {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}

export type AutoCompleteResponse = {
  commandResult?: ItemListType | null;
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
    paddingOffset: 0,
    lastHistoryDivOffset: 0,
  };

  private inputWrapper = React.createRef<HTMLDivElement>();

  private terminalInput = React.createRef<HTMLInputElement>();

  public constructor(props: TerminalProps) {
    super(props);

    this.updatePaddingOffset = this.updatePaddingOffset.bind(this);
  }

  public componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.terminalInput.current!.focus();

    // Add custom user commands to command list
    const { customCommands = {} } = this.props;
    commandList = Object.assign({}, commandList, customCommands);
    console.log('componentDidMountcalled');
  }

  /*
   * Handles updating the "padding" div used to simulate screen clearing using the
   * clear command.
   **/
  private updatePaddingOffset(historyDivOffset: number): void {
    const { paddingOffset, lastHistoryDivOffset } = this.state;

    if (paddingOffset <= 0) {
      return;
    }

    this.setState({
      paddingOffset: Math.max(
        paddingOffset - (historyDivOffset - lastHistoryDivOffset),
        0,
      ),
      lastHistoryDivOffset: historyDivOffset,
    });
  }

  public clear(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentHistoryDivOffset = document.getElementById(
      'history-container',
    )!.offsetHeight;

    this.setState({
      inputValue: '',
      lastHistoryDivOffset: currentHistoryDivOffset,
      paddingOffset:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('terminal-wrapper')!.offsetHeight -
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.inputWrapper.current!.offsetHeight,
    });
    document
      .querySelector('#terminal-wrapper')
      ?.scrollTo(0, currentHistoryDivOffset);
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

      // Tab pressed before a target is available so just return
      if (commandTargets.length < 1) {
        return;
      }

      const cycleThroughAutoCompleteItems = (itemList: ItemListType): void => {
        let newAutoCompleteActiveItemIndex = 0;
        if (autoCompleteActiveItem < Object.keys(itemList).length - 1) {
          newAutoCompleteActiveItemIndex = autoCompleteActiveItem + 1;
        }

        // If the current target isn't in AC list and ends with a "/",
        // it must be part of the base path and thus we append to it
        // instead of replacing it
        let targetPathToUpdate = getTargetPath(commandTargets[0]);
        if (
          targetPathToUpdate !==
            Object.keys(itemList)[autoCompleteActiveItem] &&
          commandTargets[0].endsWith('/')
        ) {
          targetPathToUpdate = '';
        }

        const updatedInputValue = getUpdatedInputValueFromTarget(
          inputValue,
          commandTargets[0],
          formatItem(itemList, newAutoCompleteActiveItemIndex),
          targetPathToUpdate,
        );

        this.setState(
          Object.assign({
            autoCompleteActiveItem: newAutoCompleteActiveItemIndex,
            inputValue: updatedInputValue,
          }),
        );
      };

      const generateAutoCompleteList = async (): Promise<void> => {
        let commandResult: AutoCompleteResponse['commandResult'];
        const autoCompleteHandler =
          commandList[commandName]?.autoCompleteHandler;

        if (autoCompleteHandler) {
          ({ commandResult } = await autoCompleteHandler(
            fileSystem,
            currentPath,
            commandTargets[0],
          ));
        } else {
          // Do nothing if tab is not supported
          return;
        }

        if (commandResult) {
          // If only one autocomplete option is available, just use it
          if (Object.keys(commandResult).length === 1) {
            // If the last part of current target path is a folder,
            // set target path to empty
            let targetPathToUpdate = getTargetPath(commandTargets[0]);
            if (commandTargets[0].endsWith('/')) {
              targetPathToUpdate = '';
            }
            const updatedInputValue = getUpdatedInputValueFromTarget(
              inputValue,
              commandTargets[0],
              formatItem(commandResult, 0),
              targetPathToUpdate,
            );

            this.setState(
              Object.assign({
                inputValue: updatedInputValue,
              }),
            );
          } else {
            // Else show all autocomplete options
            this.setState(
              Object.assign({
                autoCompleteIsActive: true,
                autoCompleteItems: commandResult,
              }),
            );
          }
        }
      };

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

    if (commandName == 'clear') {
      this.clear();
      return;
    }

    let commandResult: CommandResponse['commandResult'];
    let updatedState: CommandResponse['updatedState'] = {};

    if (commandName in commandList) {
      try {
        ({ commandResult, updatedState = {} } = await commandList[
          commandName
        ].handler(
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
      paddingOffset,
    } = this.state;

    return (
      <TerminalContext.Provider value={commandList}>
        <div id="terminal-wrapper">
          <History
            history={history}
            updatePaddingOffset={this.updatePaddingOffset}
          />
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
          <div
            aria-label="autocomplete-preview"
            className="tab-complete-result"
          >
            {autoCompleteItems && (
              <AutoCompleteList
                items={autoCompleteItems}
                activeItemIndex={autoCompleteActiveItem}
              />
            )}
          </div>
          <div id="padding" style={{ height: paddingOffset }}>
            &nbsp;
          </div>
        </div>
      </TerminalContext.Provider>
    );
  }
}
