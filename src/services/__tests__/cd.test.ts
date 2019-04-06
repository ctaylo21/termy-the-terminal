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

describe('cd suite', () => {
  describe('valid cases', () => {
    describe('from root', () => {
      test('1 level path', () => {
        const fileSystem: FileSystem = {
          home: {
            children: null,
            type: 'FOLDER',
          },
        };

        return expect(cd(fileSystem, '/', 'home')).resolves.toEqual('/home');
      });

      test('multi-level cd', () => {
        return expect(
          cd(testSystem, '/', 'home/folder1/folder2'),
        ).resolves.toEqual('/home/folder1/folder2');
      });

      test('.. above root level', () => {
        return expect(cd(testSystem, '/', '..')).resolves.toEqual('/');
      });
    });

    describe('from nested path', () => {
      test('1 level cd', () => {
        return expect(cd(testSystem, '/home', 'folder1')).resolves.toEqual(
          '/home/folder1',
        );
      });

      test('.. 1 level to root', () => {
        return expect(cd(testSystem, '/home', '..')).resolves.toEqual('/');
      });

      test('.. 1 level', () => {
        return expect(
          cd(testSystem, '/home/folder1/folder2', '..'),
        ).resolves.toEqual('/home/folder1');

        test('.. multiple levels', () => {
          return expect(
            cd(testSystem, '/home/folder1/folder2', '../..'),
          ).resolves.toEqual('/home');
        });
      });

      test('.. multiple levels in separate paths', () => {
        return expect(
          cd(testSystem, '/home/folder1/folder2', '../folder2/../../'),
        ).resolves.toEqual('/home');
      });
    });
  });

  describe('invalid cases', () => {
    test('empty path', () => {
      const fileSystem: FileSystem = {
        home: {
          children: null,
          type: 'FOLDER',
        },
      };
      return expect(cd(fileSystem, 'path', '')).rejects.toMatchSnapshot();
    });

    test('nested cd to a file', () => {
      return expect(
        cd(testSystem, 'path', 'home/folder1/folder2/file1'),
      ).rejects.toMatchSnapshot();
    });
  });
});
