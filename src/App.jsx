import React from 'react';
import Terminal from './components/Terminal';
import './App.scss';

function App() {
  return <Terminal inputPrompt={['/home/user ', <span id="inputPromptChar">→</span>]} />;
}

export default App;
