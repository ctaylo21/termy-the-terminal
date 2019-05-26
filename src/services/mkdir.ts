import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { getInternalPath } from './utilities/index';
import has from 'lodash/has';

export default function mkdir(
  fileSystem: FileSystem,
  currentPath: string,
  folderName: string,
): Promise<FileSystem> {
  return new Promise(
    (resolve, reject): void => {
      if (has(fileSystem, getInternalPath(currentPath, folderName))) {
        reject('Path already exists');
      }

      const newFolder: TerminalFolder = {
        type: 'FOLDER',
        children: null,
      };

      const newFileSystem = cloneDeep(fileSystem);
      set(newFileSystem, getInternalPath(currentPath, folderName), newFolder);

      resolve(newFileSystem);
    },
  );
}
