import React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { getInternalPath } from './utilities/index';
import LsResult from '../components/LsResult';

function getTargetFolder(
  fileSystem: FileSystem,
  currentPath: string,
  targetPath: string,
): FileSystem | null {
  const internalPath = getInternalPath(currentPath, targetPath);

  if (internalPath === '/' || !internalPath) {
    return fileSystem;
  } else if (has(fileSystem, internalPath)) {
    return (get(fileSystem, internalPath) as TerminalFolder).children;
  }

  throw new Error('Target folder does not exist');
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
  targetPath: string = '',
): Promise<ServiceResponse> {
  return new Promise(
    (resolve, reject): void => {
      const externalFormatDir: LsResultType = {};

      let targetFolderContents;
      try {
        targetFolderContents = getTargetFolder(
          fileSystem,
          currentPath,
          targetPath,
        );
      } catch (e) {
        reject(e.message);
      }

      for (let key in targetFolderContents) {
        const lsKey =
          targetFolderContents[key].type === 'FILE'
            ? `${key}.${targetFolderContents[key].extension}`
            : key;

        externalFormatDir[lsKey] = {
          type: targetFolderContents[key].type,
        };
      }
      resolve({
        serviceResult: <LsResult lsResult={externalFormatDir} />,
      });
    },
  );
}
