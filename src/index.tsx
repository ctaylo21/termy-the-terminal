import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from './components/Terminal';
import exampleFileSystem from './data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} />,
  document.getElementById('terminal-container'),
);
