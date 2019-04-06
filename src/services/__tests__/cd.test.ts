import cd from '../cd';
import { FileSystem } from '../../components/Terminal';

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
        const fileSystem: FileSystem = {
          home: {
            children: {
              folder1: {
                type: 'FOLDER',
                children: {
                  folder2: {
                    type: 'FOLDER',
                    children: null,
                  },
                },
              },
            },
            type: 'FOLDER',
          },
        };

        return expect(
          cd(fileSystem, '/', 'home/folder1/folder2'),
        ).resolves.toEqual('/home/folder1/folder2');
      });
    });

    describe('from nested path', () => {
      test('1 level cd', () => {
        const fileSystem: FileSystem = {
          home: {
            children: {
              folder1: {
                type: 'FOLDER',
                children: {
                  folder2: {
                    type: 'FOLDER',
                    children: null,
                  },
                },
              },
            },
            type: 'FOLDER',
          },
        };

        return expect(cd(fileSystem, '/home', 'folder1')).resolves.toEqual(
          '/home/folder1',
        );
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
      const fileSystem: FileSystem = {
        home: {
          children: {
            folder1: {
              type: 'FOLDER',
              children: {
                file1: {
                  type: 'FILE',
                  children: null,
                },
              },
            },
          },
          type: 'FOLDER',
        },
      };

      return expect(
        cd(fileSystem, 'path', 'home/folder1/file1'),
      ).rejects.toMatchSnapshot();
    });
  });
});
