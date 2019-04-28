import React from 'react';

export const History: React.FC<HistoryProps> = (props): JSX.Element => {
  const { history } = props;
  const commandList = history.map(
    (command): JSX.Element => (
      <li key={command.id}>
        {command.value}: {command.result}
      </li>
    ),
  );

  return (
    <div id="history-container">
      <ul aria-label="terminal-history">{commandList}</ul>
    </div>
  );
};
