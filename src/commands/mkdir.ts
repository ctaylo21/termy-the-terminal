import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import has from 'lodash/has';
import { getInternalPath } from './utilities/index';
import {
  AutoCompleteResponse,
  CommandResponse,
  FileSystem,
  ItemListType,
  TerminalFolder,
} from '../index';
import autoComplete from './autoComplete';

/**
 * Given a folder path, creates that folder for the given file system and
 * returns the new file system if valid. If not, rejects with error.
 *
 * @param fileSystem {object} - filesystem to mkdir upon
 * @param currentPath {string} - current path within filesystem
 * @param folderPath  {string} - folder path to create
 * @returns Promise<object> - resolves with new path created if successful, rejects if not
 */
function mkdir(
  fileSystem: FileSystem,
  currentPath: string,
  folderPath: string,
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    if (has(fileSystem, getInternalPath(currentPath, folderPath))) {
      reject('Path already exists');
    }

    const newFolder: TerminalFolder = {
      type: 'FOLDER',
      children: null,
    };

    const newFileSystem = cloneDeep(fileSystem);
    set(newFileSystem, getInternalPath(currentPath, folderPath), newFolder);

    resolve({
      commandResult: `Folder created: ${folderPath}`,
      updatedState: {
        fileSystem: newFileSystem,
      },
    });
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
function mkdirAutoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target: string,
): Promise<AutoCompleteResponse> {
  const filterNonFilesFn = (item: ItemListType): boolean =>
    item[Object.keys(item)[0]].type === 'FOLDER';

  return autoComplete(fileSystem, currentPath, target, filterNonFilesFn);
}

export default {
  handler: mkdir,
  autoCompleteHandler: mkdirAutoComplete,
};
