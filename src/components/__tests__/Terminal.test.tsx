import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import Terminal from '../Terminal';

afterEach(cleanup);

test('invalid command', () => {
  const { getByLabelText } = render(<Terminal />);
  const input = getByLabelText('terminal-input');
  fireEvent.change(input, { target: { value: 'invalid-command' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 13 });

  const history = getByLabelText('terminal-history');
  debugger;

  expect(history.innerHTML).toContain('Invalid command');
});
