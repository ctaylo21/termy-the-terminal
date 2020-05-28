import React from 'react';
import ReactDOM from 'react-dom';
import get from 'lodash/get';
import {
  autoComplete,
  CommandResponse,
  FileSystem,
  Terminal,
  utilities,
} from './';
import exampleFileSystem from './data/exampleFileSystem';

const { getInternalPath, stripFileExtension } = utilities;

const hello = {
  hello: {
    handler: function hello(): Promise<CommandResponse> {
      return new Promise((resolve): void => {
        resolve({
          commandResult: 'world',
        });
      });
    },
  },
  length: {
    handler: function length(
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

        if (file.extension !== 'txt') {
          reject('Target is not a .txt file');
        }

        let fileLength = 'Unknown length';
        if (typeof file.content === 'string') {
          fileLength = '' + file.content.length;
        }

        resolve({
          commandResult: fileLength,
        });
      });
    },
    autoCompleteHandler: autoComplete,
  },
};

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} customCommands={hello} />,
  document.getElementById('terminal-container'),
);
