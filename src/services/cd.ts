import get from 'lodash/get';
import has from 'lodash/has';
import {
  convertInternalPathToExternal,
  handleDotDotInPath,
  convertPathToInternalFormat,
} from './utilities/index';

/**
 * Given a fileysystem, validates if changing directories from a given path
 * to a new path is possible, and returns the new path if so.
 *
 * @param fileSystem {object} - filesystem to cd upon
 * @param currentPath {string} - current path within filesystem
 * @param pathToCd  {string} - path to change to
 * @returns Promise<string> - resolves with new path if successful, rejects if not
 */
export default function cd(
  fileSystem: FileSystem,
  currentPath: string,
  pathToCd: string,
): Promise<string> {
  return new Promise(
    (resolve, reject): void => {
      if (!pathToCd) {
        reject('path can not be empty.');
      }

      // If current path is anything other than the root, add trailing slash
      const normalizedCurrentPath =
        currentPath === '/' ? currentPath : `${currentPath}/`;

      let internalCdPath = convertPathToInternalFormat(
        handleDotDotInPath(normalizedCurrentPath + pathToCd),
      );

      if (!internalCdPath) {
        resolve('/');
      }

      if (
        has(fileSystem, internalCdPath) &&
        get(fileSystem, internalCdPath).type !== 'FILE'
      ) {
        resolve(convertInternalPathToExternal(internalCdPath));
      }

      reject('path does not exist.');
    },
  );
}
