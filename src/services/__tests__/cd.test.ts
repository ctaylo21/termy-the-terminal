import cd from '../cd';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('cd suite', (): void => {
  describe('valid cases', (): void => {
    describe('from root', (): void => {
      test('1 level path', async (): Promise<string> => {
        const fileSystem: FileSystem = {
          home: {
            children: null,
            type: 'FOLDER',
          },
        };

        return expect(cd(fileSystem, '/', 'home')).resolves.toEqual('/home');
      });

      test('multi-level cd', async (): Promise<string> => {
        return expect(
          cd(exampleFileSystem, '/', 'home/user/test'),
        ).resolves.toEqual('/home/user/test');
      });

      test('.. above root level', async (): Promise<string> => {
        return expect(cd(exampleFileSystem, '/', '..')).resolves.toEqual('/');
      });
    });

    describe('from nested path', (): void => {
      test('1 level cd', async (): Promise<string> => {
        return expect(cd(exampleFileSystem, '/home', 'user')).resolves.toEqual(
          '/home/user',
        );
      });

      test('.. 1 level to root', async (): Promise<string> => {
        return expect(cd(exampleFileSystem, '/home', '..')).resolves.toEqual(
          '/',
        );
      });

      test('.. 1 level', async (): Promise<string> => {
        return expect(
          cd(exampleFileSystem, '/home/user/test', '..'),
        ).resolves.toEqual('/home/user');
      });

      test('.. multiple levels', async (): Promise<string> => {
        return expect(
          cd(exampleFileSystem, '/home/folder1/folder2', '../..'),
        ).resolves.toEqual('/home');
      });

      test('.. multiple levels in separate paths', (): Promise<
        Promise<string>
      > => {
        return expect(
          cd(exampleFileSystem, '/home/folder1/folder2', '../folder2/../../'),
        ).resolves.toEqual('/home');
      });
    });
  });

  describe('invalid cases', (): void => {
    test('empty path', async (): Promise<string> => {
      const fileSystem: FileSystem = {
        home: {
          children: null,
          type: 'FOLDER',
        },
      };
      return expect(cd(fileSystem, 'path', '')).rejects.toMatchInlineSnapshot(
        `"path can not be empty."`,
      );
    });

    test('nested cd to a file', async (): Promise<string> => {
      return expect(
        cd(exampleFileSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchInlineSnapshot(
        `"path does not exist: home/folder1/folder2/file1"`,
      );
    });
  });
});
