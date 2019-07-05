import mkdir from '../mkdir';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('mkdir suite', (): void => {
  describe('success', (): void => {
    it('should create directory from root', async (): Promise<
      ServiceResponse
    > => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        mkdir(exampleFileSystem, '/', 'newDir'),
      ).resolves.toStrictEqual({
        serviceResult: 'Folder created: newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });

    it('should create directory from nested path', async (): Promise<
      ServiceResponse
    > => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'home.children.newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        mkdir(exampleFileSystem, '/home', 'newDir'),
      ).resolves.toStrictEqual({
        serviceResult: 'Folder created: newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });

    it('should create directory given a folder path', async (): Promise<
      ServiceResponse
    > => {
      const expectedFileSystem = cloneDeep(exampleFileSystem);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set(expectedFileSystem, 'home.children.newDir', {
        type: 'FOLDER',
        children: null,
      });

      return expect(
        mkdir(exampleFileSystem, '/', 'home/newDir'),
      ).resolves.toStrictEqual({
        serviceResult: 'Folder created: home/newDir',
        updatedState: {
          fileSystem: expectedFileSystem,
        },
      });
    });
  });

  describe('Failure', (): void => {
    it('should reject if path already exists', async (): Promise<
      ServiceResponse
    > => {
      return expect(
        mkdir(exampleFileSystem, '/home', 'user'),
      ).rejects.toMatchInlineSnapshot(`"Path already exists"`);
    });
  });
});
