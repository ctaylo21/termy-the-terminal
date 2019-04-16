import cd from '../cd';
import { FileSystem } from '../../components/Terminal';

const testSystem: FileSystem = {
  home: {
    children: {
      folder1: {
        type: 'FOLDER',
        children: {
          folder2: {
            type: 'FOLDER',
            children: {
              file1: {
                type: 'FILE',
                children: null,
              },
            },
          },
        },
      },
    },
    type: 'FOLDER',
  },
};

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
          cd(testSystem, '/', 'home/folder1/folder2'),
        ).resolves.toEqual('/home/folder1/folder2');
      });

      test('.. above root level', async (): Promise<string> => {
        return expect(cd(testSystem, '/', '..')).resolves.toEqual('/');
      });
    });

    describe('from nested path', (): void => {
      test('1 level cd', async (): Promise<string> => {
        return expect(cd(testSystem, '/home', 'folder1')).resolves.toEqual(
          '/home/folder1',
        );
      });

      test('.. 1 level to root', async (): Promise<string> => {
        return expect(cd(testSystem, '/home', '..')).resolves.toEqual('/');
      });

      test('.. 1 level', async (): Promise<string> => {
        return expect(
          cd(testSystem, '/home/folder1/folder2', '..'),
        ).resolves.toEqual('/home/folder1');
      });

      test('.. multiple levels', async (): Promise<string> => {
        return expect(
          cd(testSystem, '/home/folder1/folder2', '../..'),
        ).resolves.toEqual('/home');
      });

      test('.. multiple levels in separate paths', (): Promise<
        Promise<string>
      > => {
        return expect(
          cd(testSystem, '/home/folder1/folder2', '../folder2/../../'),
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
      return expect(cd(fileSystem, 'path', '')).rejects.toMatchSnapshot();
    });

    test('nested cd to a file', async (): Promise<string> => {
      return expect(
        cd(testSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchSnapshot();
    });
  });
});
