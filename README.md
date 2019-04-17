# Termy the Terminal

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Table of Contents

- [Usage](#usage)
- [Commands](#commands)

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from './components/Terminal';
import exampleFileSystem from './data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} />,
  document.getElementById('terminal-container'),
);
```

## Commands

### CD

`cd` - Supports changing directory, including use `..` to move up a level
