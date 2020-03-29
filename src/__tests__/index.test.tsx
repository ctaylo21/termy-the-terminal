import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  wait,
  findByLabelText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Terminal } from '..';
import exampleFileSystem from '../data/exampleFileSystem';
jest.mock('../../images/dog.png', () => 'abc/dog.png');

beforeAll((): void => {
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(cleanup);

afterAll(() => {
  jest.clearAllMocks();
});

describe('initialization', (): void => {
  test('custom input prompt', async (): Promise<void> => {
    const { getByText } = render(
      <Terminal
        fileSystem={exampleFileSystem}
        inputPrompt={'custom prompt >'}
      />,
    );
    const inputPrompt = getByText('custom prompt >');

    expect(inputPrompt).not.toBeNull();
  });

  test('default input prompt should be $>', async (): Promise<void> => {
    const { getByText } = render(<Terminal fileSystem={exampleFileSystem} />);
    const inputPrompt = getByText('$>');

    expect(inputPrompt).not.toBeNull();
  });

  test('should focus terminal input on page load', async (): Promise<void> => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input');

    expect(document.activeElement).toEqual(input);
  });
});

describe('general', (): void => {
  test('invalid command', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'invalid-command' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('autocomplete with tab', (): void => {
  describe('ls', (): void => {
    test('ls tab with no argument', async (): Promise<void> => {
      const { container, getByLabelText } = render(
        <Terminal fileSystem={exampleFileSystem} />,
      );

      const input = getByLabelText('terminal-input') as HTMLInputElement;
      await userEvent.type(input, 'ls ');

      const tabEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        code: '9',
        key: 'Tab',
      });
      fireEvent(input, tabEvent);

      const autoCopmleteContent = await findByLabelText(
        container,
        'autocomplete-preview',
      );

      Object.keys(exampleFileSystem).forEach((item) => {
        expect(autoCopmleteContent.innerHTML).toContain(item);
      });
      expect(autoCopmleteContent.innerHTML).toMatchSnapshot();
      expect(input.value).toBe('ls ');
    });

    test('ls tab with argument and relative nested path', async (): Promise<
      void
    > => {
      const { container, getByLabelText } = render(
        <Terminal fileSystem={exampleFileSystem} />,
      );

      const input = getByLabelText('terminal-input') as HTMLInputElement;
      await userEvent.type(input, 'ls home/fi');

      const tabEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        code: '9',
        key: 'Tab',
      });
      fireEvent(input, tabEvent);

      const autoCopmleteContent = await findByLabelText(
        container,
        'autocomplete-preview',
      );

      expect(autoCopmleteContent.innerHTML).toContain('file1.txt');
      expect(autoCopmleteContent.innerHTML).toContain('file5.txt');
      expect(autoCopmleteContent.innerHTML).toMatchSnapshot();
      expect(input.value).toBe('ls home/fi');
    });
  });

  describe('general', (): void => {
    test('should call "e.preventDefault" on tab key press', async (): Promise<
      void
    > => {
      const { getByLabelText } = render(
        <Terminal fileSystem={exampleFileSystem} />,
      );
      const input = getByLabelText('terminal-input') as HTMLInputElement;

      const keyDownEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        code: '9',
        key: 'Tab',
      });
      Object.assign(keyDownEvent, { preventDefault: jest.fn() });

      fireEvent(input, keyDownEvent);

      await wait(() => {
        expect(keyDownEvent.preventDefault).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('cd', (): void => {
  test('should handle invalid cd', async (): Promise<void> => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd invalid' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/');
  });

  test('should cd one level', async (): Promise<void> => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home');
  });

  test('should multiple levels with ..', async (): Promise<void> => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, {
      target: { value: 'cd home/../home/user/../user/test' },
    });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/user/test');
  });

  test('should support cd with absolute path from nested path', async (): Promise<
    void
  > => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, {
      target: { value: 'cd /home/user' },
    });
    fireEvent.submit(input);

    let history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/user');

    fireEvent.change(input, { target: { value: 'cd /home' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home');
  });
});

describe('pwd', (): void => {
  test('should correctly return current directory', async (): Promise<void> => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/');
  });

  test('should correctly return directory after cd', async (): Promise<
    void
  > => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd home/user/test' } });
    fireEvent.submit(input);

    await wait();
    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/user/test');
  });
});

describe('ls', (): void => {
  test('should list all content from current directory', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should correctly return contents for given relative directory from root', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'ls home' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should correctly return contents for given relative directory from nested path', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait();

    fireEvent.change(input, { target: { value: 'ls user' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should correctly return contents for absolute path from nested path', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait();

    fireEvent.change(input, { target: { value: 'ls /home/user' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should handle invalid directory for ls', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'ls invalid' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('help', (): void => {
  test('should print help menu', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('mkdir', (): void => {
  test('should create new directory from root', async (): Promise<void> => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'mkdir banana' } });
    fireEvent.submit(input);

    let history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();

    fireEvent.change(input, { target: { value: 'cd banana' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/banana');
  });

  test('should create new directory from nested path', async (): Promise<
    void
  > => {
    const { container, getByLabelText, getByTestId } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');
    const currentPath = getByTestId('input-prompt-path');

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    let history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();

    fireEvent.change(input, { target: { value: 'mkdir banana' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();

    fireEvent.change(input, { target: { value: 'cd /home/banana' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(currentPath.innerHTML).toEqual('/home/banana');
  });

  test('should handle invalid mkdir command', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'mkdir home' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('rm', (): void => {
  test('should remove file from root', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'rm file3.txt' } });
    fireEvent.submit(input);

    let history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();

    fireEvent.change(input, { target: { value: 'cat file3.txt' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(history.innerHTML).not.toContain('Contents of file 3');
  });

  test('should remove folder from root', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'rm -r home' } });
    fireEvent.submit(input);

    let history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
    expect(history.innerHTML).toContain('path does not exist: home');
  });

  test('should remove folder from parent path', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cd home/user' } });
    fireEvent.submit(input);

    await wait();

    fireEvent.change(input, { target: { value: 'rm -r ../../docs' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('cat', (): void => {
  test('should list contents of file with path', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat home/file1.txt' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toContain('Contents of file 1');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should list contents of file that contains react component', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat blog.txt' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toContain('3/22');
    expect(history.innerHTML).toContain('Today is a good day');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should show error when cat on non file', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat home' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should show error when cat on invalid path', async (): Promise<
    void
  > => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat invalid.txt' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toMatchSnapshot();
  });

  test('should support cat on images', async (): Promise<void> => {
    const { container, getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );

    const input = getByLabelText('terminal-input');

    fireEvent.change(input, { target: { value: 'cat home/dog.png' } });
    fireEvent.submit(input);

    const history = await findByLabelText(container, 'terminal-history');

    expect(history.innerHTML).toContain('<img src="abc/dog.png">');
    expect(history.innerHTML).toMatchSnapshot();
  });
});

describe('history', (): void => {
  test('up key should auto-fill previous command into input', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    await wait(() => {
      expect(input.value).toBe('cd home');
    });
  });

  test('up key should do nothing if no history items', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    await wait(() => {
      expect(input.value).toBe('');
    });
  });

  test('up key should handle multiple history items', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    await wait(() => {
      expect(input.value).toBe('cd home');
    });
  });

  test('should handle pressing up with nothing left in history', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    await wait(() => {
      expect(input.value).toBe('cd home');
    });
  });

  test('should call "e.preventDefault" on up arrow keyDown handler', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    const keyDownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      code: '38',
      key: 'ArrowUp',
    });
    Object.assign(keyDownEvent, { preventDefault: jest.fn() });

    fireEvent(input, keyDownEvent);

    await wait(() => {
      expect(keyDownEvent.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  test('should not call "e.preventDefault" on up down keyDown handler', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    const keyDownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      code: '40',
      key: 'ArrowDown',
    });
    Object.assign(keyDownEvent, { preventDefault: jest.fn() });

    fireEvent(input, keyDownEvent);

    await wait(() => {
      expect(keyDownEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  test('down key should let you go to more recent history items', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 40 });
    await wait(() => {
      expect(input.value).toBe('pwd');
    });
  });

  test('pressing down on most recent history item should make input empty', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd home' } });
    fireEvent.submit(input);

    await wait(() => {
      expect(input.value).toBe('');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp', code: 38 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 40 });
    await wait(() => {
      expect(input.value).toBe('');
    });
  });

  test('down key should do nothing if no history items', async (): Promise<
    void
  > => {
    const { getByLabelText } = render(
      <Terminal fileSystem={exampleFileSystem} />,
    );
    const input = getByLabelText('terminal-input') as HTMLInputElement;

    fireEvent.keyDown(input, { key: 'ArrowDown', code: 40 });
    await wait(() => {
      expect(input.value).toBe('');
    });
  });
});
