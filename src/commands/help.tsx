import React from 'react';
import HelpMenu from '../components/HelpMenu';
import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';

/**
 * Returns help menu for system commands
 *
 * @returns Promise<object> - resolves with list of system commands
 */
function help(): Promise<CommandResponse> {
  return new Promise((resolve): void => {
    resolve({
      commandResult: <HelpMenu />,
    });
  });
}

/**
 * Do nothing for pwd autocomplete
 */
function helpAutoComplete(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  _fileSystem: FileSystem,
  _currentPath: string,
  _target: string,
  /* eslint-enable @typescript-eslint/no-unused-vars */
): Promise<AutoCompleteResponse> {
  return new Promise((resolve): void => {
    resolve({
      commandResult: null,
    });
  });
}

export default {
  autoCompleteHandler: helpAutoComplete,
  description: 'Prints list of available commands',
  handler: help,
};
