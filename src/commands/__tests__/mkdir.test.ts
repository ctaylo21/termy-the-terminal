import mkdir from '../mkdir';
const { handler, autoCompleteHandler } = mkdir;
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('mkdir suite', (): void => {
  describe('success', (): void => {
    it('should create directory from root', async (): Promise<void> => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        handler(exampleFileSystem, '/', 'newDir'),
      ).resolves.toStrictEqual({
        commandResult: 'Folder created: newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });

    it('should create directory from nested path', async (): Promise<void> => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'home.children.newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        handler(exampleFileSystem, '/home', 'newDir'),
      ).resolves.toStrictEqual({
        commandResult: 'Folder created: newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });

    it('should create directory given a folder path', async (): Promise<
      void
    > => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'home.children.newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        handler(exampleFileSystem, '/', 'home/newDir'),
      ).resolves.toStrictEqual({
        commandResult: 'Folder created: home/newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });
  });

  describe('failure', (): void => {
    it('should reject if path already exists', async (): Promise<void> => {
      return expect(
        handler(exampleFileSystem, '/home', 'user'),
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
