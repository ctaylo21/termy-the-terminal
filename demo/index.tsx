import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from '../src/Terminal';
import exampleFileSystem from '../src/data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} />,
  document.getElementById('terminal-container'),
);

export default {};
