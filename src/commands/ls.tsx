import React from 'react';
import LsResult from '../components/LsResult';
import { getTarget, buildItemList } from './utilities';
import { CommandResponse, FileSystem, AutoCompleteResponse } from '../index';
import autoComplete from './autoComplete';

/**
 * Given a fileysystem, lists all items for a given directory
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath {string} - path to list contents within
 * @returns Promise<object> - resolves with contents of given path
 */
function ls(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath = '',
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    let targetFolderContents;
    try {
      targetFolderContents = getTarget(fileSystem, currentPath, targetPath);
    } catch (e) {
      return reject(e.message);
    }

    resolve({
      commandResult: (
        <LsResult lsResult={buildItemList(targetFolderContents)} />
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
  target: string,
): Promise<AutoCompleteResponse> {
  return autoComplete(fileSystem, currentPath, target);
}

export default {
  autoCompleteHandler: lsAutoComplete,
  description: 'Lists the contents of the given directory',
  handler: ls,
};
