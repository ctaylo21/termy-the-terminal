import cd from '../cd';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('cd suite', (): void => {
  describe('valid cases', (): void => {
    describe('from root', (): void => {
      test('1 level path', async (): Promise<CommandResponse> => {
        const fileSystem: FileSystem = {
          home: {
            children: null,
            type: 'FOLDER',
          },
        };

        return expect(cd(fileSystem, '/', 'home')).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('multi-level cd', async (): Promise<CommandResponse> => {
        return expect(
          cd(exampleFileSystem, '/', 'home/user/test'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user/test',
          },
        });
      });

      test('.. above root level', async (): Promise<CommandResponse> => {
        return expect(cd(exampleFileSystem, '/', '..')).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });
    });

    describe('from nested path', (): void => {
      test('1 level cd', async (): Promise<CommandResponse> => {
        return expect(cd(exampleFileSystem, '/home', 'user')).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. 1 level to root', async (): Promise<CommandResponse> => {
        return expect(cd(exampleFileSystem, '/home', '..')).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });

      test('.. 1 level', async (): Promise<CommandResponse> => {
        return expect(
          cd(exampleFileSystem, '/home/user/test', '..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. multiple levels', async (): Promise<CommandResponse> => {
        return expect(
          cd(exampleFileSystem, '/home/folder1/folder2', '../..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('.. multiple levels in separate paths', (): Promise<
        Promise<CommandResponse>
      > => {
        return expect(
          cd(exampleFileSystem, '/home/folder1/folder2', '../folder2/../../'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });
    });
  });

  describe('invalid cases', (): void => {
    test('empty path', async (): Promise<CommandResponse> => {
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

    test('nested cd to a file', async (): Promise<CommandResponse> => {
      return expect(
        cd(exampleFileSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchInlineSnapshot(
        `"path does not exist: home/folder1/folder2/file1"`,
      );
    });
  });
});
