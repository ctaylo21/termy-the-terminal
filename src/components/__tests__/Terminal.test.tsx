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

describe('pwd', (): void => {
  test('should correctly return current directory', async (): Promise<void> => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/');
  });

  test('should correctly return directory after cd', async (done): Promise<
    void
  > => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd home/user/test' } });
    fireEvent.submit(input);

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'pwd' } });
        fireEvent.submit(input);

        try {
          const history = await waitForElement(
            (): HTMLElement => getByLabelText('terminal-history'),
          );

          expect(history.innerHTML).toMatchSnapshot();
          expect(currentPath.innerHTML).toEqual('/home/user/test');
          done();
        } catch (e) {
          done.fail(e);
        }
      },
    );
  });
});

describe('ls', (): void => {
  test('should list all directories', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should correctly return ls for given path', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'ls home' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});
