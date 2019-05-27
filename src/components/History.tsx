import React from 'react';

export const History: React.FC<HistoryProps> = (props): JSX.Element => {
  const { history } = props;
  const commandList = history.map(
    (command): JSX.Element => (
      <li key={command.id}>
        {command.input}
        <span className="commandResult">{command.result}</span>
      </li>
    ),
  );

  return (
    <div id="history-container">
      <ul aria-label="terminal-history">{commandList}</ul>
    </div>
  );
};
