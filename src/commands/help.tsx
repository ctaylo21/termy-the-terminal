import React from 'react';
import HelpMenu from '../components/HelpMenu';

/**
 * Returns help menu for system commands
 *
 * @returns Promise<object> - resolves with list of system commands
 */
export default function help(): Promise<CommandResponse> {
  return new Promise(
    (resolve): void => {
      resolve({
        commandResult: <HelpMenu />,
      });
    },
  );
}
