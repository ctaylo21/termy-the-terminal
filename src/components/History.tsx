import React, { useEffect, useRef } from 'react';
import { HistoryItem } from '../index';

declare interface HistoryProps {
  history: HistoryItem[];
  updatePaddingOffset: (x: number) => void;
}

export const History: React.FC<HistoryProps> = (props): JSX.Element => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { history, updatePaddingOffset } = props;
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (targetRef.current) {
      updatePaddingOffset(targetRef.current.offsetHeight);
    }
  }, [history]);
  const commandList = history.map(
    (command): JSX.Element => (
      <li key={command.id}>
        {command.input}
        <span className="commandResult">{command.result}</span>
      </li>
    ),
  );

  return (
    <div id="history-container" ref={targetRef}>
      <ul aria-label="terminal-history">{commandList}</ul>
    </div>
  );
};

export default History;
