import cd from '../cd';
import { FileSystem } from '../../components/Terminal';

describe('cd suite', () => {
  describe('valid cases', () => {
    test('1 level path', () => {
      const fileSystem: FileSystem = {
        home: {
          children: null,
          type: 'FOLDER',
        },
      };

      expect(cd(fileSystem, '/', 'home')).toBe('/home');
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

      expect(cd(fileSystem, '/', 'home/folder1/folder2')).toBe(
        '/home/folder1/folder2',
      );
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
      expect(cd(fileSystem, 'path', '')).toBe('');
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

      expect(cd(fileSystem, 'path', 'home/folder1/file1')).toBe('');
    });
  });
});
