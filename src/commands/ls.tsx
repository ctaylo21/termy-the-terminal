import React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { getInternalPath } from './utilities/index';
import AutoCompleteList from '../components/AutoCompleteList';
import LsResult from '../components/LsResult';
import { CommandResponse, FileSystem, TerminalFolder } from '../index';

export interface LsResultType {
  [index: string]: {
    type: 'FOLDER' | 'FILE';
  };
}

function getTargetFolder(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): FileSystem {
  const internalPath = getInternalPath(currentPath, targetPath);

  if (internalPath === '/' || !internalPath) {
    return fileSystem;
  } else if (has(fileSystem, internalPath)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (get(fileSystem, internalPath) as TerminalFolder).children!;
  }

  throw new Error('Target folder does not exist');
}

/**
 * Takes an internally formatted directory and formats it into the
 * expected format for an ls command. Optionally takes a function to apply
 * to the intiial result to filter out certain items.
 *
 * @param directory {object} - internally formatted directory
 * @param filterFn {function} - optional fn to filter certain items
 */
function buildLsFormatDirectory(
  directory: FileSystem,
  filterFn: (item: LsResultType) => boolean = (): boolean => true,
): LsResultType {
  return Object.assign(
    {},
    ...Object.keys(directory)
      .map((item) => ({
        [directory[item].type === 'FILE'
          ? `${item}.${directory[item].extension}`
          : item]: {
          type: directory[item].type,
        },
      }))
      .filter(filterFn),
  );
}

/**
 * Given a fileysystem, lists all items for a given directory
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath {string} - path to list contents within
 * @returns Promise<object> - resolves with contents of given path
 */
export default function ls(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath = '',
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    let targetFolderContents;
    try {
      targetFolderContents = getTargetFolder(
        fileSystem,
        currentPath,
        targetPath,
      );
    } catch (e) {
      return reject(e.message);
    }

    resolve({
      commandResult: (
        <LsResult lsResult={buildLsFormatDirectory(targetFolderContents)} />
      ),
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
function lsAutoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target = '',
): Promise<CommandResponse> {
  return new Promise((resolve): void => {
    // Default to searching in currenty directory with simple target
    // that contains no path
    let autoCompleteMatch = target;
    let targetPath = '';

    // Handle case where target is a nested path and
    // we need to pull off last part of path to match against
    const pathParts = target.split('/');
    if (pathParts.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      autoCompleteMatch = pathParts.pop()!;
      targetPath = pathParts.join('/');
    }

    let targetFolderContents;
    try {
      targetFolderContents = getTargetFolder(
        fileSystem,
        currentPath,
        targetPath,
      );
    } catch (e) {
      return resolve({ commandResult: '' });
    }

    const matchFilterFn = (item: LsResultType): boolean =>
      Object.keys(item)[0].startsWith(autoCompleteMatch);

    resolve({
      commandResult: (
        <AutoCompleteList
          items={buildLsFormatDirectory(targetFolderContents, matchFilterFn)}
        />
      ),
    });
  });
}

export { ls, lsAutoComplete };
