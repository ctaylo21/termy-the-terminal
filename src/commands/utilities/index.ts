import { FileSystem, ItemListType } from '../../index';
import get from 'lodash/get';
import has from 'lodash/has';

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
export function convertPathToInternalFormat(pathStr: string): string {
  return pathStr
    .replace(/^\/+/g, '')
    .split('/')
    .map((elem, index, arr): string => {
      if (elem !== '..' && index !== arr.length - 1) {
        elem += '.children';
      }
      return elem;
    })
    .join('.');
}

/**
 * Takes a unix path that may contain ".." and return a new
 * string that respects the ".." path segments i.e.
 * /home/user/.. => /home
 *
 * @param pathStr {string} - unix-formatted path
 * @returns {string} - new path after taking ".." into account
 */
export function handleDotDotInPath(pathStr: string): string {
  let currentDotDots = 0;
  const pathArr = pathStr.split('/').filter((path): boolean => path.length > 0);
  for (let i = pathArr.length - 1; i >= 0; i--) {
    if (pathArr[i] === '..') {
      currentDotDots++;
    } else {
      if (currentDotDots > 0) {
        pathArr.splice(i, 1);
        currentDotDots--;
      }
    }
  }

  return pathArr.filter((path): boolean => path !== '..').join('/');
}

/**
 * Takes an path formatted for internal use and converts it to an
 * external format. i.e.
 * home.children.user => /home/user
 *
 * @param pathStr {string} - internally formatted path
 * @returns {string} - path string formatted for terminal use
 */
export function convertInternalPathToExternal(pathStr: string): string {
  return (
    '/' +
    pathStr
      .split('.')
      .filter((path): boolean => path !== 'children')
      .join('/')
  );
}

/**
 * Takes a file path (externally formatted) and trims the file extension from it i.e.
 * /path/to/file.txt => /path/to/file
 * file.txt => file
 *
 * @param filePath {string} - filePath to trim extension from
 * @returns {string} - file path without file extension
 */
export function stripFileExtension(filePath: string): string {
  return filePath.replace(/\.[^/.]+$/, '');
}

/**
 * Takes a current path and a target path, and calculates the combined path and
 * returns it in internal format. If target path is absolute, currentPath is ignored.
 *
 * @param currentPath {string} - current path in system
 * @param targetPath {string} - target path in system
 */
export function getInternalPath(
  currentPath: string,
  targetPath: string,
): string {
  if (!targetPath) {
    return convertPathToInternalFormat(currentPath.replace(/^\/+/g, ''));
  }

  const normalizedPath = targetPath.startsWith('/')
    ? targetPath
    : currentPath === '/'
    ? `/${targetPath}` // eslint-disable-line indent
    : `${currentPath}/${targetPath}`; // eslint-disable-line indent

  return convertPathToInternalFormat(
    handleDotDotInPath(stripFileExtension(normalizedPath)),
  );
}

/**
 * Checks if a file extension is a valid image file extension
 *
 * @param extension {string} - file extension to check
 * @returns {boolean} - whether or not file is image extension
 */
export function isImageExtension(extension: string): boolean {
  const imageExtensions = ['png', 'jpg', 'gif'];

  return imageExtensions.includes(extension);
}

type ParsedCommand = {
  commandName: string;
  commandOptions: string[];
  commandTargets: string[];
};

/**
 * Parses a given string into the command name, the options (specified with leading "-"),
 * and the command targets
 *
 * @param command - input string to parse
 * @returns {object} - the parsed command
 */
export function parseCommand(command: string): ParsedCommand {
  const [commandName, ...args] = command.split(' ');
  const commandOptions = args.filter((arg: string) => arg.startsWith('-'));
  const commandTargets = args.filter((arg: string) => !arg.startsWith('-'));

  return {
    commandName,
    commandOptions,
    commandTargets,
  };
}

/**
 * Given a filesystem and current path, return the target item from the
 * filesystem for a given garget path if it exists, or throw an error if
 * it doesn't.
 *
 * @param fileSystem {object} - Filesystem to search
 * @param currentPath {string} - Curernt path in filesystem
 * @param targetPath {string} - Path to target
 * @return {object} - Internal formatted filesystem from target
 */
export function getTarget(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): FileSystem {
  const internalPath = getInternalPath(currentPath, targetPath);

  if (internalPath === '/' || !internalPath) {
    return fileSystem;
  } else if (has(fileSystem, internalPath)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = get(fileSystem, internalPath);
    if (target.type === 'FILE') {
      const [fileName] = internalPath.split('.').slice(-1);
      return { [fileName]: target };
    } else {
      if (target.children) {
        return target.children;
      } else {
        throw new Error('Nothing to show here');
      }
    }
  }

  throw new Error('Target folder does not exist');
}

/**
 * Takes an internally formatted filesystem and formats it into an
 * an item list.
 *
 * @param directory {object} - internally formatted filesystem
 * @returns {object} - fomratted list of files/folders
 */
export function buildItemList(fileSystem: FileSystem): ItemListType {
  return Object.assign(
    {},
    ...Object.keys(fileSystem).map((item) => ({
      [fileSystem[item].type === 'FILE'
        ? `${item}.${fileSystem[item].extension}`
        : item]: {
        type: fileSystem[item].type,
      },
    })),
  );
}
