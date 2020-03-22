import React from 'react';
import {
  getInternalPath,
  stripFileExtension,
  isImageExtension,
} from './utilities';
import get from 'lodash/get';
import { CommandResponse, FileSystem, TerminalImageFile } from '../index';
import TerminalImage from '../components/TerminalImage';
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
): Promise<CommandResponse> {
  return new Promise((resolve, reject): void => {
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
