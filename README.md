<div align="center">
  <img src="./TermyLogo.png" width="300px"/>
</div>

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

- [Termy the Terminal](#termy-the-terminal)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [Commands](#commands)
    - [`cd [DIRECTORY]`](#cd-directory)
    - [`pwd`](#pwd)
    - [`ls [DIRECTORY]`](#ls-directory)
    - [`mkdir [DIRECTORY]`](#mkdir-directory)
    - [`cat [FILE]`](#cat-file)
    - [`rm [OPTIONS] [FILE]`](#rm-options-file)
    - [`help`](#help)

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from 'termy-the-terminal';
import 'termy-the-terminal/dist/index.css';
import exampleFileSystem from './data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} />,
  document.getElementById('terminal-container'),
);
```

The file system needs to be a particular format ([code example](src/data/exampleFileSystem.ts)):

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

### `rm [OPTIONS] [FILE]`

Remove a file or directory from the filesystem

**Options**

- `-r` - remove directories and their contents recursively

```bash
/ $> rm -r home
# home directory deleted

/home $> rm videos/file2.txt
# file2.txt deleted
```

### `help`

Prints available commands for the terminal with descriptions.

```
/ $> help
cd - Changes the current working directory
pwd - Prints the current working directory
ls - Lists the contents of the given directory
mkdir - Creates a folder for a given path in the filesystem
cat - Shows the contents of a file
rm - Removes a file or directory
help - Prints list of available commands
```
