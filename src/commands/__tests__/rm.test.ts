import rm from '../rm';
const { handler, autoCompleteHandler } = rm;
import exampleFileSystem from '../../data/exampleFileSystem';
import { FileSystem } from '../../index';
import cloneDeep from 'lodash/cloneDeep';

describe('rm suite', (): void => {
  describe('success', (): void => {
    describe('non-folders', (): void => {
      it('should remove a file with no options', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.file3;

        return expect(
          handler(exampleFileSystem, '/', 'file3.txt'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should remove a nested file', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete ((expectedFileSystem.home.children as FileSystem).videos
          .children as FileSystem).file2;

        return expect(
          handler(exampleFileSystem, '/', 'home/videos/file2.txt'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should remove file in parent path', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.file3;

        return expect(
          handler(exampleFileSystem, '/home/videos', '../../file3.txt'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });
    });

    describe('folders', (): void => {
      it('should delete at same level', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.docs;

        return expect(
          handler(exampleFileSystem, '/', 'docs', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should delete from nested path', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete (expectedFileSystem.home.children as FileSystem).videos;

        return expect(
          handler(exampleFileSystem, '/', 'home/videos', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should delete from parent path', async (): Promise<void> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.docs;

        return expect(
          handler(exampleFileSystem, '/home/videos', '../../docs', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });
    });
  });

  describe('failure', (): void => {
    it('should reject if path is invalid', async (): Promise<void> => {
      return expect(
        handler(exampleFileSystem, '/', 'invalid'),
      ).rejects.toMatchSnapshot();
    });

    it('should reject if no target path provided', async (): Promise<void> => {
      return expect(
        handler(exampleFileSystem, '/', ''),
      ).rejects.toMatchSnapshot();
    });

    it('should reject if no options and target is a folder', async (): Promise<
      void
    > => {
      return expect(
        handler(exampleFileSystem, '/', 'home'),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('auto complete', (): void => {
    test('empty value', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
        exampleFileSystem,
        '/home/user',
        '',
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.keys(commandResult!)).toContain('test');
    });

    test('should filter single level target', async (): Promise<void> => {
      const { commandResult } = await autoCompleteHandler(
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
      const { commandResult } = await autoCompleteHandler(
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
      const { commandResult } = await autoCompleteHandler(
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
      const { commandResult } = await autoCompleteHandler(
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
