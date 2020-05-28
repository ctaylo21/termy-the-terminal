import React from 'react';
import { Command } from '..';

type CommandList = {
  [key: string]: Command;
};

const TerminalContext = React.createContext<CommandList>({});

export default TerminalContext;
