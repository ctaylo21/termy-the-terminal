import get from 'lodash/get';
import has from 'lodash/has';
import {
  AutoCompleteResponse,
  CommandResponse,
  FileSystem,
  ItemListType,
} from '../index';
import {
  convertInternalPathToExternal,
  getInternalPath,
} from './utilities/index';
import autoComplete from './autoComplete';

/**
 * Given a file system, validates if changing directories from a given path
 * to a new path is possible, and returns the new path if so.
 *
 * @param fileSystem {object} - filesystem to cd upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path to change to
 * @returns Promise<object> - resolves with new path if successful, rejects if not
 */
function cd(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    if (!targetPath) {
      reject('path can not be empty.');
    }
    const internalCdPath = getInternalPath(currentPath, targetPath);

    if (!internalCdPath) {
      resolve({
        updatedState: {
          currentPath: '/',
        },
      });
    }

    if (
      has(fileSystem, internalCdPath) &&
      get(fileSystem, internalCdPath).type !== 'FILE'
    ) {
      resolve({
        updatedState: {
          currentPath: convertInternalPathToExternal(internalCdPath),
        },
      });
    }

    reject(`path does not exist: ${targetPath}`);
  });
}

/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
function cdAutoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target: string,
): Promise<AutoCompleteResponse> {
  const filterNonFilesFn = (item: ItemListType): boolean =>
    item[Object.keys(item)[0]].type === 'FOLDER';

  return autoComplete(fileSystem, currentPath, target, filterNonFilesFn);
}

export default {
  handler: cd,
  autoCompleteHandler: cdAutoComplete,
};
