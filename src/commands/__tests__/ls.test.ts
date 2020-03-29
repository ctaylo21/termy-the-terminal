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

  test('should reject if invalid directory given', async (): Promise<void> => {
    return expect(ls(exampleFileSystem, '/invalid')).rejects.toMatchSnapshot();
  });

  test('empty path from nested location', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home/user', '');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('test');
  });

  describe('auto complete', (): void => {
    test('empty value', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(
        exampleFileSystem,
        '/home/user',
        '',
      );
      const { container } = render(lsResult.commandResult as JSX.Element);

      expect(container.innerHTML).toContain('test');
    });

    test('should filter single level target', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(exampleFileSystem, '/', 'fi');
      const { container } = render(lsResult.commandResult as JSX.Element);

      expect(container.innerHTML).toContain('file3.txt');
      expect(container.innerHTML).toContain('file4.txt');
      expect(container.innerHTML).not.toContain('blog');
      expect(container.innerHTML).not.toContain('docs');
      expect(container.innerHTML).not.toContain('home');
    });

    test('invalid path should return nothing', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(exampleFileSystem, '/bad/path', '');
      const { container } = render(lsResult.commandResult as JSX.Element);

      expect(container.innerHTML).toBe('');
    });

    test('relative path', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(exampleFileSystem, '/', 'home/fi');
      const { container } = render(lsResult.commandResult as JSX.Element);

      expect(container.innerHTML).toContain('file1.txt');
      expect(container.innerHTML).toContain('file5.txt');
      expect(container.innerHTML).not.toContain('user');
      expect(container.innerHTML).not.toContain('videos');
      expect(container.innerHTML).not.toContain('dog.png');
    });

    test('absolute path', async (): Promise<void> => {
      const lsResult = await lsAutoComplete(exampleFileSystem, '/', '/home/d');
      const { container } = render(lsResult.commandResult as JSX.Element);

      expect(container.innerHTML).toContain('dog.png');
      expect(container.innerHTML).not.toContain('user');
      expect(container.innerHTML).not.toContain('videos');
      expect(container.innerHTML).not.toContain('file1.txt');
      expect(container.innerHTML).not.toContain('file5.txt');
    });
  });
});
