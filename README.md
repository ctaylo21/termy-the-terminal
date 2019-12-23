<table>
 <tr>
   <td><div align="center"><img src="./TermyLogo.png" width="230px"/></div></td>
 </tr>
 <tr>
    <td> <!-- Commitizen -->
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

  <!-- Build Size -->
  <a href='https://bundlephobia.com/result?p=termy-the-terminal@1.0.0'/>
    <img src='https://img.shields.io/bundlephobia/minzip/termy-the-terminal' alt='bundle size' />
  </a>

  <!-- NPM Version -->
  <a href='https://www.npmjs.com/package/termy-the-terminal'/>
    <img src='https://img.shields.io/npm/v/termy-the-terminal' alt='NPM Version' />
  </a>
 </td>
 </tr>
</table>

# Termy the Terminal

A web-based terminal powered by React. Check out the [demo](https://ctaylo21.github.io/termy-the-terminal/).

## Table of Contents

- [Termy the Terminal](#termy-the-terminal)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Terminal Props](#terminal-props)
  - [General](#general)
    - [Command History](#command-history)
  - [Commands](#commands)
    - [cd [DIRECTORY]](#cd-directory)
    - [pwd](#pwd)
    - [ls [DIRECTORY]](#ls-directory)
    - [mkdir [DIRECTORY]](#mkdir-directory)
    - [cat [FILE]](#cat-file)
    - [rm [OPTIONS] [FILE]](#rm-options-file)
    - [help](#help)

## Installation

The package can be installed via NPM:

    npm i termy-the-terminal

You will need to install the React and ReactDOM packages separately as they aren't included in this package.

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Terminal } from 'termy-the-terminal';
import 'termy-the-terminal/dist/index.css';
import exampleFileSystem from './data/exampleFileSystem';

ReactDOM.render(
  <Terminal fileSystem={exampleFileSystem} inputPrompt="$>" />,
  document.getElementById('terminal-container'),
);
```

### Terminal Props

| Prop Name   | Description                                                              | Required |
| ----------- | ------------------------------------------------------------------------ | -------- |
| fileSystem  | A properly formatted (see below) JSON object representing the filesystem | Yes      |
| inputPrompt | String to use as input prompt (default is `$>`)                          | No       |

The `fileSystem` prop needs to be a particular format ([code example](src/data/exampleFileSystem.ts)):

```javascript
import dogImg from '../../src/images/dog.png';

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
      dog: {
        type: 'FILE',
        content: dogImg,
        extension: 'png',
      },
    },
  },
  docs: {
    type: 'FOLDER',
    children: null,
  },
};
```

**Important**: To support using `cat` to display images from your filesystem, you need to pass a valid image location and valid extension (`'jpg'`, `'png'`, or `'gif'`). To follow the example above, you will need to make sure your bundler (webpack, rollup, etc..) supports importing images. For an example of this in webpack, see the [weback docs](https://webpack.js.org/guides/asset-management/#loading-images), and for rollup, check out [@rollup/plugin-image](https://github.com/rollup/plugins/tree/master/packages/image).

## General

The following sections include general features that Termy supports outside of the terminal commands.

### Command History

Termy supports using the arrow keys (up and down) to move through the command history.

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

Shows the contents of a file. Both basic text files and images are supported (with some dependencies, see the [Usage](#usage)
section).

```bash
/home $> cat file1.txt
# Contents of file1.txt

/home $> cat videos/file2.txt
# Contents of file2.txt

/home $> cat home/dog.png
   / \__
  (    @\___
  /         O
 /   (_____/
/_____/   U
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
