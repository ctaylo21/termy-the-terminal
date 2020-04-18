import React from 'react';
import { cat, catAutoComplete } from '../cat';
import exampleFileSystem, { BlogPost } from '../../data/exampleFileSystem';
import { render } from '@testing-library/react';
jest.mock('../../images/dog.png', () => 'abc/dog.png');

afterAll(() => {
  jest.clearAllMocks();
});

describe('cat suite', (): void => {
  it('should print contents of file with no path', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, '/home', 'file1.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 1',
    });
  });

  it('should print contents of file with path from root', async (): Promise<
    void
  > => {
    return expect(
      cat(exampleFileSystem, '/', 'home/videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should handle image extension', async (): Promise<void> => {
    const { commandResult } = await cat(exampleFileSystem, '/', 'home/dog.png');

    const { container } = render(commandResult as JSX.Element);

    expect(container.getElementsByTagName('img').length).toBe(1);
    expect(container.getElementsByTagName('img')[0].src).toEqual(
      'http://localhost/abc/dog.png',
    );
  });

  it('should print contents of file that contans react component', () => {
    return expect(
      cat(exampleFileSystem, '/', 'blog.txt'),
    ).resolves.toStrictEqual({
      commandResult: <BlogPost content="Today is a good day" date="3/22" />,
    });
  });

  it('should print contents of file with path from nested path', async (): Promise<
    void
  > => {
    return expect(
      cat(exampleFileSystem, '/home', 'videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should reject if target is not a file', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, 'home', 'videos'),
    ).rejects.toMatchSnapshot();
  });

  it('should reject if target is not a valid path', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, '/', 'invalid'),
    ).rejects.toMatchSnapshot();
  });

  describe('auto complete', (): void => {
    test('empty value', async (): Promise<void> => {
      const { commandResult } = await catAutoComplete(
        exampleFileSystem,
        '/home/user',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.keys(commandResult!)).toContain('test');
    });

    test('should filter single level target', async (): Promise<void> => {
      const { commandResult } = await catAutoComplete(
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
      const lsResult = await catAutoComplete(
        exampleFileSystem,
        '/bad/path',
        '',
      );

      expect(lsResult.commandResult).toBeUndefined();
    });

    test('relative path', async (): Promise<void> => {
      const { commandResult } = await catAutoComplete(
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
      const { commandResult } = await catAutoComplete(
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
      const { commandResult } = await catAutoComplete(
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
      const { commandResult } = await catAutoComplete(
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
