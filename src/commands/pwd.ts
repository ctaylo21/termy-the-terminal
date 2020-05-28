import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';

/**
 * Returns current directory
 *
 * @returns Promise<object> - resolves with current directory
 */
function pwd(_f: FileSystem, currentPath: string): Promise<CommandResponse> {
  return new Promise((resolve): void => {
    resolve({
      commandResult: currentPath,
    });
  });
}

/**
 * Do nothing for pwd autocomplete
 */
function pwdAutoComplete(
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
  handler: pwd,
  autoCompleteHandler: pwdAutoComplete,
};
