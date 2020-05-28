import React from 'react';
import {
  getInternalPath,
  stripFileExtension,
  isImageExtension,
} from './utilities';
import get from 'lodash/get';
import {
  AutoCompleteResponse,
  CommandResponse,
  FileSystem,
  TerminalImageFile,
} from '../index';
import TerminalImage from '../components/TerminalImage';
import autoComplete from './autoComplete';

/**
 * Given a file system, returns contents for a given file
 *
 * @param fileSystem {object} - filesystem to cat upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path of file to cat
 * @returns Promise<object> - resolves with contents of file
 */
function cat(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
    if (!targetPath) {
      reject('Invalid target path');
    }

    const pathWithoutExtension = stripFileExtension(targetPath);
    const file = get(
      fileSystem,
      getInternalPath(currentPath, pathWithoutExtension),
    );

    if (!file) {
      reject('Invalid target path');
    }

    if (file.type === 'FILE') {
      if (isImageExtension(file.extension)) {
        resolve({
          commandResult: (
            <TerminalImage src={(file as TerminalImageFile).content} />
          ),
        });
      } else {
        resolve({
          commandResult: file.content,
        });
      }
    }

    reject('Target is not a file');
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
function catAutoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target: string,
): Promise<AutoCompleteResponse> {
  return autoComplete(fileSystem, currentPath, target);
}

export default {
  handler: cat,
  autoCompleteHandler: catAutoComplete,
};
