import autoComplete from '../autoComplete';
import exampleFileSystem from '../../data/exampleFileSystem';
import { ItemListType } from '../../';

describe('auto complete', (): void => {
  test('empty value', async (): Promise<void> => {
    const { commandResult } = await autoComplete(
      exampleFileSystem,
      '/home/user',
      '',
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(Object.keys(commandResult!)).toContain('test');
  });

  test('should filter single level target', async (): Promise<void> => {
    const { commandResult } = await autoComplete(exampleFileSystem, '/', 'fi');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const autoCompleteValues = Object.keys(commandResult!);

    expect(autoCompleteValues).toContain('file3.txt');
    expect(autoCompleteValues).toContain('file4.txt');
    expect(autoCompleteValues).not.toContain('blog');
    expect(autoCompleteValues).not.toContain('docs');
    expect(autoCompleteValues).not.toContain('home');
  });

  test('invalid path should return nothing', async (): Promise<void> => {
    const lsResult = await autoComplete(exampleFileSystem, '/bad/path', '');

    expect(lsResult.commandResult).toBeUndefined();
  });

  test('relative path', async (): Promise<void> => {
    const { commandResult } = await autoComplete(
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
    const { commandResult } = await autoComplete(
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
    const { commandResult } = await autoComplete(
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
    const { commandResult } = await autoComplete(
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

  test('should use filter function on reults', async (): Promise<void> => {
    const filterNonFilesFn = (item: ItemListType): boolean =>
      item[Object.keys(item)[0]].type === 'FOLDER';

    const { commandResult } = await autoComplete(
      exampleFileSystem,
      '/',
      '',
      filterNonFilesFn,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const autoCompleteValues = Object.keys(commandResult!);

    expect(autoCompleteValues).toContain('docs');
    expect(autoCompleteValues).toContain('home');
    expect(autoCompleteValues).not.toContain('file3.txt');
    expect(autoCompleteValues).not.toContain('file4.txt');
    expect(autoCompleteValues).not.toContain('blog.txt');
  });
});
