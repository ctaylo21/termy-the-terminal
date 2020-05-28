import cd from './cd';
import ls from './ls';
import mkdir from './mkdir';
import cat from './cat';
import help from './help';
import pwd from './pwd';
import rm from './rm';
import { Command } from '..';

const commands: {
  [key: string]: Command;
} = {
  cat,
  cd,
  help,
  ls,
  mkdir,
  pwd,
  rm,
};

export default commands;
