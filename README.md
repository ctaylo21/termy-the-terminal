<div align="center">
  <!-- Commitizen -->
  <a href="http://commitizen.github.io/cz-cli/v" title="Commitizen">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg"/>
  </a>

  <!-- Prettier -->
  <a href="https://github.com/prettier/prettie" title="Prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"/>
  </a>

  <!-- Coveralls -->
  <a href='https://coveralls.io/github/ctaylo21/termy-the-terminal?branch=master'>
    <img src='https://coveralls.io/repos/github/ctaylo21/termy-the-terminal/badge.svg?branch=master' alt='Coverage Status' />
  </a>

  <!-- Travis -->
  <a href='https://travis-ci.com/ctaylo21/termy-the-terminal/'>
    <img src='https://travis-ci.com/ctaylo21/termy-the-terminal.svg?branch=master' alt='Build Status' />
  </a>
</div>

# Termy the Terminal

A web-based terminal powered by React. Check out the [demo](https://ctaylo21.github.io/termy-the-terminal/).

## Table of Contents

- [Termy the Terminal](#Termy-the-Terminal)
  - [Table of Contents](#Table-of-Contents)
  - [Usage](#Usage)
  - [Commands](#Commands)
    - [`cd [DIRECTORY]`](#cd-DIRECTORY)
    - [`pwd`](#pwd)
    - [`ls [DIRECTORY]`](#ls-DIRECTORY)
    - [`mkdir [DIRECTORY]`](#mkdir-DIRECTORY)
    - [`cat [FILE]`](#cat-FILE)
    - [`help`](#help)

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from 'termy-the-terminal';
import 'termy-the-terminal/dist/Terminal.css';
import exampleFileSystem from './data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} />,
  document.getElementById('terminal-container'),
);
```

The file system needs to be a particular format:

```javascript
const exampleFileSystem = {
  home: {
    type: 'FOLDER',
    children: {
      user: {
        type: 'FOLDER',
        children: null,
      },
      file1: {
        type: 'FILE',
        content: 'Contents of file 1',
        extension: 'txt',
      },
    },
  },
  docs: {
    type: 'FOLDER',
    children: null,
  },
};
```

Since the code is written in Typescript, you can also look at the [project types](src/types.d.ts) or
look at the [example filesystem](src/data/exampleFileSystem.ts).

## Commands

The following commands are supported by Termy.

### `cd [DIRECTORY]`

Supports changing directory, including use `..` to move up a level

```bash
# cd with relative path
/home $> cd user/test

/home/user/test $> cd user/test

# cd from absolute path
/ $> cd /home/user/test

/home/user/test $>

# cd using ".."
/home $> cd ..

/ $>

# cd using nested path with ".."
/ $> cd /home/user/../user

/home/user $>
```

### `pwd`

Prints current directory to the console

```bash
/home/user $> pwd
/home/user
```

### `ls [DIRECTORY]`

Lists information about files and directories within the file system. With no arguments,
it will use the current directory.

```bash
/home/user $> ls
# Contents of /home/user

/home/user $> ls /home
# Contents of /home

/home/user $> ls ..
# Contents of /home
```

### `mkdir [DIRECTORY]`

Creates a folder for a given path in the filesystem

```bash
# mkdir with relative path
/ $> mkdir test
Folder created: test

# mkdir with absolute path
/ $> mkdir /home/banana
Folder created: /home/banana

# mkdir with ".." path
/home/user $> mkdir ../test2
Folder created: ../test2 #/home/test2
```

### `cat [FILE]`

Shows the contents of a file

```bash
/home $> cat file1.txt
# Contents of file1.txt

/home $> cat videos/file2.txt
# Contents of file2.txt
```

### `help`

Prints available commands for the terminal with descriptions.

```bash
/ $> help
cd - Changes the current working directory
pwd - Prints the current working directory
ls - Lists the contents of the given directory
mkdir - Creates a folder for a given path in the filesystem
cat - Shows the contents of a file
help - Prints list of available commands
```
