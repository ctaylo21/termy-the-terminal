import get from 'lodash/get';
import has from 'lodash/has';
import { FileSystem } from '../components/Terminal';

/**
 * Takes a valid Unix path and converts it into a format
 * that matches the internal data structure. Including replacing "/"
 * with ".children" and removing leading slash
 *
 * usr/home/test becomes usr.children.home.children.test
 *
 * @param {string} pathStr - path string to convert
 * @returns {string} - converted string
 */
function convertPathToInternalFormat(pathStr: string): string {
  return pathStr
    .replace(/^\/+/g, '')
    .split('/')
    .map((elem, index, arr) => {
      if (elem !== '..' && index !== arr.length - 1) {
        elem += '.children';
      }
      return elem;
    })
    .join('.');
}

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
  return new Promise((resolve, reject) => {
    if (!pathToCd) {
      reject('Path can not be empty.');
    }

    // If current path is anything other than the root, add trailing slash
    const normalizedCurrentPath =
      currentPath === '/' ? currentPath : `${currentPath}/`;

    const internalCdPath = convertPathToInternalFormat(
      normalizedCurrentPath + pathToCd,
    );

    if (
      has(fileSystem, internalCdPath) &&
      get(fileSystem, internalCdPath).type !== 'FILE'
    ) {
      resolve(`${normalizedCurrentPath}${pathToCd}`);
    }

    reject('Path does not exist.');
  });
}
