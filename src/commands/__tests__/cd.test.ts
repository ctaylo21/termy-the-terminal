import cd from '../cd';
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

        return expect(cd(fileSystem, '/', 'home')).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('multi-level cd', async (): Promise<void> => {
        return expect(
          cd(exampleFileSystem, '/', 'home/user/test'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user/test',
          },
        });
      });

      test('.. above root level', async (): Promise<void> => {
        return expect(cd(exampleFileSystem, '/', '..')).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });
    });

    describe('from nested path', (): void => {
      test('1 level cd', async (): Promise<void> => {
        return expect(cd(exampleFileSystem, '/home', 'user')).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. 1 level to root', async (): Promise<void> => {
        return expect(cd(exampleFileSystem, '/home', '..')).resolves.toEqual({
          updatedState: {
            currentPath: '/',
          },
        });
      });

      test('.. 1 level', async (): Promise<void> => {
        return expect(
          cd(exampleFileSystem, '/home/user/test', '..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home/user',
          },
        });
      });

      test('.. multiple levels', async (): Promise<void> => {
        return expect(
          cd(exampleFileSystem, '/home/folder1/folder2', '../..'),
        ).resolves.toEqual({
          updatedState: {
            currentPath: '/home',
          },
        });
      });

      test('.. multiple levels in separate paths', (): Promise<void> => {
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
    test('empty path', async (): Promise<void> => {
      const fileSystem: FileSystem = {
        home: {
          children: null,
          type: 'FOLDER',
        },
      };
      return expect(cd(fileSystem, 'path', '')).rejects.toMatchSnapshot();
    });

    test('nested cd to a file', async (): Promise<void> => {
      return expect(
        cd(exampleFileSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchSnapshot();
    });
  });
});
