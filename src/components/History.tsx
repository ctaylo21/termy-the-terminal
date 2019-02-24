import React from 'react';

export interface IHistoryItem {
  id: number;
  result: string;
  value: string;
}

interface IProps {
  history: IHistoryItem[];
}

export const History: React.FC<IProps> = props => {
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
