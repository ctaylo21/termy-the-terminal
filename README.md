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

The following commands are supported by Termy.

### `cd [DIRECTORY]`

Supports changing directory, including use `..` to move up a level

```bash
/home
$> cd user/test
/home/user/test

/home
$> cd /home/user/test
/home/user/test

/home
$> cd ..
/

/
$> cd /home/user/../user
/home/user
```

### `pwd`

Prints current directory to the console

```bash
/home/user
$> pwd
/home/user
```

### `ls [DIRECTORY]`

Lists information about files and directories within the file system. With no arguments,
it will use the current directory.

```bash
/home/user
$> ls
# Contents of /home/user

/home/user
$> ls /home
# Contents of /home

/home/user
$> ls ..
# Contents of /home
```

### `help`

Prints available commands for the terminal with descriptions.

```bash
/
$> help
cd - Changes the current working directory
pwd - Prints the current working directory
ls - Lists the contents of the given directory
help - Prints list of available commands
```
