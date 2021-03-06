import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import unset from 'lodash/unset';
import { getInternalPath } from './utilities/index';
import autoComplete from './autoComplete';

/**
 * Deletes path from given filesystem and returns updatd filesystem
 * without modifying original arg.
 *
 * @param fileSystem {object} - filesystem to act upon
 * @param pathToDelete {string} - internally-formatted path to delete
 */
function handleDelete(
  fileSystem: FileSystem,
  pathToDelete: string,
): CommandResponse {
  const newFileSystem = cloneDeep(fileSystem);
  unset(newFileSystem, pathToDelete);
  return {
    updatedState: {
      fileSystem: newFileSystem,
    },
  };
}

/**
 * Given a path, removes the object at that location if possible. Rejects if
 * the parameters aren't correct for the given item
 *
 * @param fileSystem {object} - filesystem to act upon
 * @param currentPath {string} - current path within filesystem
 * @param folderPath  {string} - path of object to remove
 * @returns Promise<object> - resolves if rm was successful, rejects if not
 */
function rm(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
  options?: string,
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    if (!targetPath) {
      reject('Missing argument to rm');
    }

    const internalCdPath = getInternalPath(currentPath, targetPath);

    if (has(fileSystem, internalCdPath)) {
      if (get(fileSystem, internalCdPath).type === 'FOLDER') {
        if (options === '-r') {
          resolve(handleDelete(fileSystem, internalCdPath));
        } else {
          reject(`Can't remove ${targetPath}. It is a directory.`);
        }
      }

      if (get(fileSystem, internalCdPath).type === 'FILE') {
        resolve(handleDelete(fileSystem, internalCdPath));
      }
    }

    reject(`Can't remove ${targetPath}. No such file or directory.`);
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
function rmAutoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target: string,
): Promise<AutoCompleteResponse> {
  return autoComplete(fileSystem, currentPath, target);
}

export default {
  autoCompleteHandler: rmAutoComplete,
  description: 'Removes a file or directory',
  handler: rm,
};
