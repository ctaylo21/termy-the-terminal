<div align="center">
  <!-- Commitizen -->
  <a href="http://commitizen.github.io/cz-cli/v" title="Commitizen">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg"/>
  </a>

  <!-- Prettier -->
  <a href="https://github.com/prettier/prettie" title="Prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"/>
  </a>
</div>

# Termy the Terminal

A web-based terminal powered by React. Check out the [demo](https://clever-poitras-e72340.netlify.com/).

## Table of Contents

- [Termy the Terminal](#termy-the-terminal)
  - [Table of Contents](#table-of-contents)
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

- `cd directory` - Supports changing directory, including use `..` to move up a level

  To switch the current working directory based upon your current directory

  ```
  cd user/test
  ```

  To switch directories using an absolute path, just prefix directory path with `/`

  ```
  cd /home/user/test
  ```

  Supports `..` in path, and anything path "above" root just defaults to root

  (from root)

  ```
  cd ..  // -> /
  cd /home/user/../user // -> /home/user
  ```

- `pwd` - Prints current directory to the console

- `ls [DIRECTORY]` - Lists information about files and directories within the file system

  When used with no arguments, the ls command will list all contents of current working directory

  ```
  ls
  ```

  To list files in a specific directory, pass the path to the directory to the ls command

  ```
  ls /home
  ```

  Supports `..` in path, and anything path "above" root just defaults to root

  (from root)

  ```
  ls ..  // -> contents of /
  cd /home/user/../user // -> contents of /home/user
  ```
