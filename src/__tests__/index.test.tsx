import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from '@testing-library/react';
import { Terminal } from '../Terminal';
import exampleFileSystem from '../data/exampleFileSystem';

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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"invalid-command\\"></form></div><span class=\\"commandResult\\">command not found: invalid-command</span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd invalid\\"></form></div><span class=\\"commandResult\\">Error: path does not exist: invalid</span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home/../home/user/../user/test\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
    );
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

        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/user\\"></form></div><span class=\\"commandResult\\"></span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home/user</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
        );
        expect(currentPath.innerHTML).toEqual('/home');
        done();
      },
    );

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/user\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"pwd\\"></form></div><span class=\\"commandResult\\">/</span></li>"`,
    );
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

          expect(history.innerHTML).toMatchInlineSnapshot(
            `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home/user/test\\"></form></div><span class=\\"commandResult\\"></span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home/user/test</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"pwd\\"></form></div><span class=\\"commandResult\\">/home/user/test</span></li>"`,
          );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls\\"></form></div><span class=\\"commandResult\\"><ul class=\\"terminal-ls-list\\"><li class=\\"ls-folder\\"> home</li><li class=\\"ls-folder\\"> docs</li></ul></span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls home\\"></form></div><span class=\\"commandResult\\"><ul class=\\"terminal-ls-list\\"><li class=\\"ls-folder\\"> user</li><li class=\\"ls-folder\\"> videos</li><li class=\\"ls-file\\"> file1.txt</li></ul></span></li>"`,
    );
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

        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div><span class=\\"commandResult\\"></span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls user\\"></form></div><span class=\\"commandResult\\"><ul class=\\"terminal-ls-list\\"><li class=\\"ls-folder\\"> test</li></ul></span></li>"`,
        );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls /home/user\\"></form></div><span class=\\"commandResult\\"><ul class=\\"terminal-ls-list\\"><li class=\\"ls-folder\\"> test</li></ul></span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls invalid\\"></form></div><span class=\\"commandResult\\">Error: Target folder does not exist</span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"help\\"></form></div><span class=\\"commandResult\\"><div id=\\"help-container\\"><ul aria-label=\\"help-menu\\"><li>cd - Changes the current working directory</li><li>pwd - Prints the current working directory</li><li>ls - Lists the contents of the given directory</li><li>mkdir - Creates a folder for a given path in the filesystem</li><li>cat - Shows the contents of a file</li><li>help - Prints list of available commands</li></ul></div></span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div><span class=\\"commandResult\\">Folder created: banana</span></li>"`,
    );

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cd banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div><span class=\\"commandResult\\">Folder created: banana</span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd banana\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
        );
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
    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
    );

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'mkdir banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );
        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div><span class=\\"commandResult\\"></span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div><span class=\\"commandResult\\">Folder created: banana</span></li>"`,
        );

        process.nextTick(
          async (): Promise<void> => {
            fireEvent.change(input, { target: { value: 'cd /home/banana' } });
            fireEvent.submit(input);

            const history = await waitForElement(
              (): HTMLElement => getByLabelText('terminal-history'),
            );

            expect(history.innerHTML).toMatchInlineSnapshot(
              `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div><span class=\\"commandResult\\"></span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div><span class=\\"commandResult\\">Folder created: banana</span></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/banana\\"></form></div><span class=\\"commandResult\\"></span></li>"`,
            );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir home\\"></form></div><span class=\\"commandResult\\">Error: Path already exists</span></li>"`,
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
    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cat home/file1.txt\\"></form></div><span class=\\"commandResult\\">Contents of file 1</span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cat home\\"></form></div><span class=\\"commandResult\\">Error: Target is not a file</span></li>"`,
    );
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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cat invalid.txt\\"></form></div><span class=\\"commandResult\\">Error: Invalid target path</span></li>"`,
    );
  });
});
