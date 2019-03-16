import React from 'react';
import './App.scss';
import { Terminal } from './components/Terminal';
import exampleFileSystem from './data/exampleFileSystem';

function App(): JSX.Element {
  return <Terminal fileSystem={exampleFileSystem} />;
}

export default App;
