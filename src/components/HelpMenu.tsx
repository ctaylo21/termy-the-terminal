import React from 'react';
import TerminalContext from '../context/TerminalContext';

export const HelpMenu: React.FC<{}> = (): JSX.Element => {
  return (
    <TerminalContext.Consumer>
      {(commands): JSX.Element => (
        <div id="help-container">
          <ul aria-label="help-menu">
            {Object.keys(commands)
              .filter((command) => commands[command].description)
              .map(
                (command): JSX.Element => (
                  <li key={command}>
                    <span className="help-command-name">{command}</span> -{' '}
                    <span>{commands[command].description}</span>
                  </li>
                ),
              )}
          </ul>
        </div>
      )}
    </TerminalContext.Consumer>
  );
};

export default HelpMenu;
