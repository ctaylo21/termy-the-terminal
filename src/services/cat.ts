import { getInternalPath, stripFileExtension } from './utilities';
import get from 'lodash/get';

/**
 * Given a file system, returns contents for a given file
 *
 * @param fileSystem {object} - filesystem to cat upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path of file to cat
 * @returns Promise<object> - resolves with contents of file
 */
export default function cat(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): Promise<ServiceResponse> {
  return new Promise(
    (resolve, reject): void => {
      const pathWithoutExtension = stripFileExtension(targetPath);
      const file = get(
        fileSystem,
        getInternalPath(currentPath, pathWithoutExtension),
      );

      if (!file) {
        reject('Invalid target path');
      }

      if (file.type === 'FILE') {
        resolve({
          serviceResult: file.content,
        });
      }

      reject('Target is not a file');
    },
  );
}
