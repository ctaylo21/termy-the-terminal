import React from 'react';

export interface HistoryItem {
  id: number;
  result: string;
  value: string;
}

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = (props): JSX.Element => {
  const { history } = props;
  const commandList = history.map(command => (
    <li key={command.id}>
      {command.value} : {command.result}
    </li>
  ));

  return (
    <div id="history-container">
      <ul aria-label="terminal-history">{commandList}</ul>
    </div>
  );
};
