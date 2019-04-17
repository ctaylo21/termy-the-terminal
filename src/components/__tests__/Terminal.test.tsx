import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from 'react-testing-library';
import { Terminal } from '../Terminal';
import exampleFileSystem from '../../data/exampleFileSystem';

afterEach(cleanup);

describe('general', (): void => {
  test('invalid command', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'invalid-command' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('cd', (): void => {
  test('should handle invalid cd', async (): Promise<void> => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd invalid' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/');
  });

  test('should cd one level', async (): Promise<void> => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home');
  });

  test('should multiple levels with ..', async (): Promise<void> => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, {
      target: { value: 'cd home/../home/user/../user/test' },
    });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/user/test');
  });
});
