import { ls, lsAutoComplete } from '../ls';
import exampleFileSystem from '../../data/exampleFileSystem';
import { render } from '@testing-library/react';

describe('ls suite', (): void => {
  test('root with no directory', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('docs');
    expect(container.innerHTML).toContain('home');
  });

  test('nested path with no directory', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('user');
    expect(container.innerHTML).toContain('videos');
    expect(container.innerHTML).toContain('file1.txt');
  });

  test('relative path from root', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/', '/home');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('user');
    expect(container.innerHTML).toContain('videos');
    expect(container.innerHTML).toContain('file1.txt');
  });

  test('relative path from nested path', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home', 'user');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('test');
  });

  test('root with dotdot', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/', '..');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('home');
    expect(container.innerHTML).toContain('docs');
  });

  test('nestd path with dotdot', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home', '../home/user/..');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('user');
    expect(container.innerHTML).toContain('videos');
    expect(container.innerHTML).toContain('file1.txt');
  });

  test('should reject if invalid target given', async (): Promise<void> => {
    return expect(ls(exampleFileSystem, '/invalid')).rejects.toMatchSnapshot();
  });

  test('empty path from nested location', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home/user', '');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('test');
  });

  test('should return file if given', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/', 'file4.txt');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('file4.txt');
  });

  test('should return message if directory and empty', async (): Promise<
    void
  > => {
    return expect(
      ls(exampleFileSystem, '/home', 'user/test'),
    ).rejects.toMatchSnapshot();
  });

  describe('auto complete', (): void => {
    test('empty value', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/home/user',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.keys(commandResult!)).toContain('test');
    });

    test('should filter single level target', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/',
        'fi',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('file3.txt');
      expect(autoCompleteValues).toContain('file4.txt');
      expect(autoCompleteValues).not.toContain('blog');
      expect(autoCompleteValues).not.toContain('docs');
      expect(autoCompleteValues).not.toContain('home');
    });

    test('invalid path should return nothing', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(exampleFileSystem, '/bad/path', '');

      expect(lsResult.commandResult).toBeUndefined();
    });

    test('relative path', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/',
        'home/fi',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('file1.txt');
      expect(autoCompleteValues).toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('user');
      expect(autoCompleteValues).not.toContain('videos');
      expect(autoCompleteValues).not.toContain('dog.png');
    });

    test('relative path with dotdot', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/',
        'home/../home/fi',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('file1.txt');
      expect(autoCompleteValues).toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('user');
      expect(autoCompleteValues).not.toContain('videos');
      expect(autoCompleteValues).not.toContain('dog.png');
    });

    test('absolute path', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/',
        '/home/d',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('dog.png');
      expect(autoCompleteValues).not.toContain('user');
      expect(autoCompleteValues).not.toContain('videos');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
    });

    test('absolute path with ..', async (): Promise<void> => {
      const { commandResult } = await lsAutoComplete(
        exampleFileSystem,
        '/',
        '/home/user/../d',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('dog.png');
      expect(autoCompleteValues).not.toContain('user');
      expect(autoCompleteValues).not.toContain('videos');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
    });
  });
});
