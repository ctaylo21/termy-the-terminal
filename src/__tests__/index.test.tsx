import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from '@testing-library/react';
import { Terminal } from '..';
import exampleFileSystem from '../data/exampleFileSystem';

beforeAll((): void => {
  Element.prototype.scrollIntoView = jest.fn();
});

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

  test('should support cd with absolute path from nested path', async (done): Promise<
    void
  > => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, {
      target: { value: 'cd /home/user' },
    });
    fireEvent.submit(input);

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cd /home' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        expect(currentPath.innerHTML).toEqual('/home');
        done();
      },
    );

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/user');
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
  test('should list all content from current directory', async (): Promise<
    void
  > => {
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

  test('should correctly return contents for given relative directory from root', async (): Promise<
    void
  > => {
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

  test('should correctly return contents for given relative directory from nested path', async (done): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    let input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    input = await getByLabelText('terminal-input');

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'ls user' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        done();
      },
    );
  });

  test('should correctly return contents for absolute path from nested path', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    fireEvent.change(input, { target: { value: 'ls /home/user' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should handle invalid directory for ls', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'ls invalid' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('help', (): void => {
  test('should print help menu', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('mkdir', (): void => {
  test('should create new directory from root', async (done): Promise<void> => {
    const { getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'mkdir banana' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cd banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        expect(currentPath.innerHTML).toEqual('/banana');
        done();
      },
    );
  });

  test('should create new directory from nested path', async (done): Promise<
    void
  > => {
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

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'mkdir banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );
        expect(history.innerHTML).toMatchSnapshot();

        process.nextTick(
          async (): Promise<void> => {
            fireEvent.change(input, { target: { value: 'cd /home/banana' } });
            fireEvent.submit(input);

            const history = await waitForElement(
              (): HTMLElement => getByLabelText('terminal-history'),
            );

            expect(history.innerHTML).toMatchSnapshot();
            expect(currentPath.innerHTML).toEqual('/home/banana');
            done();
          },
        );
      },
    );
  });

  test('should handle invalid mkdir command', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'mkdir home' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('rm', (): void => {
  test('should remove file from root', async (done): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'rm file3.txt' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cat file3.txt' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        expect(history.innerHTML).not.toContain('Contents of file 3');
        done();
      },
    );
  });

  test('should remove folder from root', async (done): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'rm -r home' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cd home' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        expect(history.innerHTML).toContain('path does not exist: home');
        done();
      },
    );
  });

  test('should remove folder from parent path', async (done): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home/user' } });
    fireEvent.submit(input);

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'rm -r ../../docs' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchSnapshot();
        done();
      },
    );
  });
});

describe('cat', (): void => {
  test('should list contents of file with path', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat home/file1.txt' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toContain('Contents of file 1');
    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should show error when cat on non file', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat home' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should show error when cat on invalid path', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat invalid.txt' } });
    fireEvent.submit(input);

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchSnapshot();
  });
});
