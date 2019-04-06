import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { Terminal } from '../Terminal';
import exampleFileSystem from '../../data/exampleFileSystem';

afterEach(cleanup);

test('invalid command', (): void => {
  const { getByLabelText } = render(
    <Terminal fileSystem={exampleFileSystem} />,
  );
  const input = getByLabelText('terminal-input');

  fireEvent.change(input, { target: { value: 'invalid-command' } });
  fireEvent.submit(input);

  const history = getByLabelText('terminal-history');

  expect(history.innerHTML).toMatchSnapshot();
});

test('should cd one level', async (): Promise<void> => {
  const { getByLabelText, getByTestId } = render(
    <Terminal fileSystem={exampleFileSystem} />,
  );

  const input = getByLabelText('terminal-input');
  const currentPath = getByTestId('input-prompt-path');

  fireEvent.change(input, { target: { value: 'cd test' } });
  fireEvent.submit(input);

  const history = await getByLabelText('terminal-history');

  expect(history.innerHTML).toMatchSnapshot();
  expect(currentPath.innerHTML).toEqual('/');
});
