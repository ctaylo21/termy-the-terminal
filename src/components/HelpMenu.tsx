import React from 'react';

const commands: { [index: string]: string } = {
  cd: 'Changes the current working directory',
  pwd: 'Prints the current working directory',
  ls: 'Lists the contents of the given directory',
  mkdir: 'Creates a folder for a given path in the filesystem',
  cat: 'Shows the contents of a file',
  help: 'Prints list of available commands',
};

export const HelpMenu: React.FC<{}> = (): JSX.Element => {
  const commandList = Object.keys(commands).map(
    (command): JSX.Element => (
      <li key={commands[command]}>
        {command} - {commands[command]}
      </li>
    ),
  );

  return (
    <div id="help-container">
      <ul aria-label="help-menu">{commandList}</ul>
    </div>
  );
};

export default HelpMenu;
