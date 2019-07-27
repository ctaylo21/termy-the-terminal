import ls from '../ls';
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

  test('should reject if invalid directory given', async (): Promise<
    CommandResponse
  > => {
    return expect(ls(exampleFileSystem, '/invalid')).rejects.toMatchSnapshot();
  });

  test('empty path from nested location', async (): Promise<void> => {
    const lsResult = await ls(exampleFileSystem, '/home/user', '');
    const { container } = render(lsResult.commandResult as JSX.Element);

    expect(container.innerHTML).toContain('test');
  });
});
