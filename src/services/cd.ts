import get from 'lodash/get';
import has from 'lodash/has';
import { FileSystem } from '../components/Terminal';

/**
 * Takes a valid Unix path and converts it into a format
 * that matches the internal data structure. Doesn't handle
 * leading "/" on path. Leaves ".." path piece alone.
 *
 * usr/home/test becomes usr/_children/_home/_children/test
 * usr/home/../.. becomes usr/_children/_home/_children/../..
 *
 * @param {string} pathStr - path string to convert
 * @returns {string} - converted string
 */
function convertPath(pathStr: string): string {
  return pathStr
    .split('/')
    .map((elem, index, arr) => {
      if (elem !== '..' && index !== arr.length - 1) {
        elem += '.children';
      }
      return elem;
    })
    .join('.');
}

export default function cd(
  fileSystem: FileSystem,
  currentPath: string,
  path: string,
): boolean {
  if (!path) {
    return false;
  }

  const formattedPath = convertPath(path);

  // Check if path exists in file system AND final item in path isn't a file
  if (
    has(fileSystem, formattedPath) &&
    get(fileSystem, formattedPath).type !== 'FILE'
  ) {
    return true;
  }

  return false;
}
