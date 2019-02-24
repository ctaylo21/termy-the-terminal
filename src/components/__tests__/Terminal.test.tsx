import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import Terminal from '../Terminal';

afterEach(cleanup);

test('invalid command', () => {
  const { getByLabelText } = render(<Terminal />);
  const input = getByLabelText('terminal-input');

  fireEvent.change(input, { target: { value: 'invalid-command' } });
  fireEvent.submit(input);

  const history = getByLabelText('terminal-history');

  expect(history.innerHTML).toMatchSnapshot();
});
