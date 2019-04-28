import get from 'lodash/get';
import { convertPathToInternalFormat } from './utilities/index';

function getTargetFolder(
  fileSystem: FileSystem,
  targetPath: string,
): FileSystem | null {
  const internalPath = convertPathToInternalFormat(targetPath);
  return targetPath === '/'
    ? fileSystem
    : (get(fileSystem, internalPath) as TerminalFolder).children;
}

/**
 * Given a fileysystem, lists all items for a given directory
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param targetPath {string} - path to list contents within
 * @returns Promise<string> - resolves with contents of given path
 */
export default function ls(
  fileSystem: FileSystem,
  targetPath: string,
): Promise<LsResultType> {
  return new Promise(
    (resolve): void => {
      const externalFormatDir: LsResultType = {};
      const targetFolderContents = getTargetFolder(fileSystem, targetPath);

      for (let key in targetFolderContents) {
        externalFormatDir[key] = {
          type: targetFolderContents[key].type,
        };
      }
      resolve(externalFormatDir as LsResultType);
    },
  );
}
