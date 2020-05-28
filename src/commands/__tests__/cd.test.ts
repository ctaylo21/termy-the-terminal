import cd from '../cd';
const { handler, autoCompleteHandler } = cd;
import exampleFileSystem from '../../data/exampleFileSystem';
import { FileSystem } from '../../index';

describe('cd suite', (): void => {
  describe('valid cases', (): void => {
    describe('from root', (): void => {
      test('1 level path', async (): Promise<void> => {
        const fileSystem: FileSystem = {
          home: {
            children: null,
            type: 'FOLDER',
          },
        };

        return expect(handler(fileSystem, '/', 'home')).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('multi-level cd', async (): Promise<void> => {
        return expect(
          handler(exampleFileSystem, '/', 'home/user/test'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user/test',
          },
        });
      });

      test('.. above root level', async (): Promise<void> => {
        return expect(handler(exampleFileSystem, '/', '..')).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });
    });

    describe('from nested path', (): void => {
      test('1 level cd', async (): Promise<void> => {
        return expect(
          handler(exampleFileSystem, '/home', 'user'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. 1 level to root', async (): Promise<void> => {
        return expect(
          handler(exampleFileSystem, '/home', '..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });

      test('.. 1 level', async (): Promise<void> => {
        return expect(
          handler(exampleFileSystem, '/home/user/test', '..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. multiple levels', async (): Promise<void> => {
        return expect(
          handler(exampleFileSystem, '/home/folder1/folder2', '../..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('.. multiple levels in separate paths', (): Promise<void> => {
        return expect(
          handler(
            exampleFileSystem,
            '/home/folder1/folder2',
            '../folder2/../../',
          ),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });
    });
  });

  describe('invalid cases', (): void => {
    test('empty path', async (): Promise<void> => {
      const fileSystem: FileSystem = {
        home: {
          children: null,
          type: 'FOLDER',
        },
      };
      return expect(handler(fileSystem, 'path', '')).rejects.toMatchSnapshot();
    });

    test('nested cd to a file', async (): Promise<void> => {
      return expect(
        handler(exampleFileSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('auto complete', (): void => {
    test('empty value', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/home',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const items = Object.keys(commandResult!);

      expect(items).toContain('user');
      expect(items).toContain('videos');
      expect(items).not.toContain('file1.txt');
      expect(items).not.toContain('file5.txt');
      expect(items).not.toContain('dog.png');
    });

    test('should filter single level target', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/',
        'ho',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('home');
      expect(autoCompleteValues).not.toContain('file3.txt');
      expect(autoCompleteValues).not.toContain('file4.txt');
      expect(autoCompleteValues).not.toContain('blog');
      expect(autoCompleteValues).not.toContain('docs');
    });

    test('invalid path should return nothing', async (): Promise<void> => {
      const lsResult = await autoCompleteHandler(
        exampleFileSystem,
        '/bad/path',
        '',
      );

      expect(lsResult.commandResult).toBeUndefined();
    });

    test('relative path', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/',
        'home/us',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('user');
      expect(autoCompleteValues).not.toContain('dog.png');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('videos');
    });

    test('relative path with dotdot', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/',
        'home/../home/us',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('user');
      expect(autoCompleteValues).not.toContain('dog.png');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('videos');
    });

    test('absolute path', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/',
        '/home/us',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('user');
      expect(autoCompleteValues).not.toContain('dog.png');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('videos');
    });

    test('absolute path with ..', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/',
        '/home/user/../us',
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoCompleteValues = Object.keys(commandResult!);

      expect(autoCompleteValues).toContain('user');
      expect(autoCompleteValues).not.toContain('dog.png');
      expect(autoCompleteValues).not.toContain('file1.txt');
      expect(autoCompleteValues).not.toContain('file5.txt');
      expect(autoCompleteValues).not.toContain('videos');
    });
  });
});
