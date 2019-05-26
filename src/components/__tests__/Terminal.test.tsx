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

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"invalid-command\\"></form></div>command not found: invalid-command</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd invalid\\"></form></div>cd: path does not exist: invalid</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div></li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home/../home/user/../user/test\\"></form></div></li>"`,
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
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/user\\"></form></div></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home/user</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home\\"></form></div></li>"`,
        );
        expect(currentPath.innerHTML).toEqual('/home');
        done();
      },
    );

    const history = await waitForElement(
      (): HTMLElement => getByLabelText('terminal-history'),
    );

    expect(history.innerHTML).toMatchInlineSnapshot(
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/user\\"></form></div></li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"pwd\\"></form></div>/</li>"`,
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
            `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home/user/test\\"></form></div></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home/user/test</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"pwd\\"></form></div>/home/user/test</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls\\"></form></div>{\\"home\\":{\\"type\\":\\"FOLDER\\"},\\"docs\\":{\\"type\\":\\"FOLDER\\"}}</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls home\\"></form></div>{\\"user\\":{\\"type\\":\\"FOLDER\\"},\\"videos\\":{\\"type\\":\\"FOLDER\\"},\\"file1\\":{\\"type\\":\\"FILE\\"}}</li>"`,
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
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls user\\"></form></div>{\\"test\\":{\\"type\\":\\"FOLDER\\"}}</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls /home/user\\"></form></div>{\\"test\\":{\\"type\\":\\"FOLDER\\"}}</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"ls invalid\\"></form></div>Target folder does not exist</li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"help\\"></form></div><div id=\\"help-container\\"><ul aria-label=\\"help-menu\\"><li>cd - Changes the current working directory</li><li>pwd - Prints the current working directory</li><li>ls - Lists the contents of the given directory</li><li>help - Prints list of available commands</li></ul></div></li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div>Folder created: banana</li>"`,
    );

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'cd banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );

        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div>Folder created: banana</li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd banana\\"></form></div></li>"`,
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
      `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div></li>"`,
    );

    process.nextTick(
      async (): Promise<void> => {
        fireEvent.change(input, { target: { value: 'mkdir banana' } });
        fireEvent.submit(input);

        const history = await waitForElement(
          (): HTMLElement => getByLabelText('terminal-history'),
        );
        expect(history.innerHTML).toMatchInlineSnapshot(
          `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div>Folder created: banana</li>"`,
        );

        process.nextTick(
          async (): Promise<void> => {
            fireEvent.change(input, { target: { value: 'cd /home/banana' } });
            fireEvent.submit(input);

            const history = await waitForElement(
              (): HTMLElement => getByLabelText('terminal-history'),
            );

            expect(history.innerHTML).toMatchInlineSnapshot(
              `"<li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd home\\"></form></div></li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"mkdir banana\\"></form></div>Folder created: banana</li><li><div id=\\"input-container\\"><form><span data-testid=\\"input-prompt-path\\">/home</span>&nbsp;<span id=\\"inputPromptChar\\">$&gt;</span><input aria-label=\\"terminal-input\\" type=\\"text\\" readonly=\\"\\" value=\\"cd /home/banana\\"></form></div></li>"`,
            );
            expect(currentPath.innerHTML).toEqual('/home/banana');
            done();
          },
        );
      },
    );
  });
});
