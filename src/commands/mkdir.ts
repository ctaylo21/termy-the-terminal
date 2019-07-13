import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import has from 'lodash/has';
import { getInternalPath } from './utilities/index';

/**
 * Given a folder path, creates that folder for the given file system and
 * returns the new file system if valid. If not, rejects with error.
 *
 * @param fileSystem {object} - filesystem to mkdir upon
 * @param currentPath {string} - current path within filesystem
 * @param folderPath  {string} - folder path to create
 * @returns Promise<object> - resolves with new path created if successful, rejects if not
 */
export default function mkdir(
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
