import rm from '../rm';
import exampleFileSystem from '../../data/exampleFileSystem';
import { CommandResponse, FileSystem } from '../../index';
import cloneDeep from 'lodash/cloneDeep';

describe('rm suite', (): void => {
  describe('success', (): void => {
    describe('non-folders', (): void => {
      it('should remove a file with no options', async (): Promise<
        CommandResponse
      > => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.file3;

        return expect(rm(exampleFileSystem, '/', 'file3.txt')).resolves.toEqual(
          {
            updatedState: {
              fileSystem: expectedFileSystem,
            },
          },
        );
      });

      it('should remove a nested file', async (): Promise<CommandResponse> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete ((expectedFileSystem.home.children as FileSystem).videos
          .children as FileSystem).file2;

        return expect(
          rm(exampleFileSystem, '/', 'home/videos/file2.txt'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should remove file in parent path', async (): Promise<
        CommandResponse
      > => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.file3;

        return expect(
          rm(exampleFileSystem, '/home/videos', '../../file3.txt'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });
    });

    describe('folders', (): void => {
      it('should delete at same level', async (): Promise<CommandResponse> => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.docs;

        return expect(
          rm(exampleFileSystem, '/', 'docs', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should delete from nested path', async (): Promise<
        CommandResponse
      > => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete (expectedFileSystem.home.children as FileSystem).videos;

        return expect(
          rm(exampleFileSystem, '/', 'home/videos', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });

      it('should delete from parent path', async (): Promise<
        CommandResponse
      > => {
        const expectedFileSystem = cloneDeep(exampleFileSystem);
        delete expectedFileSystem.docs;

        return expect(
          rm(exampleFileSystem, '/home/videos', '../../docs', '-r'),
        ).resolves.toEqual({
          updatedState: {
            fileSystem: expectedFileSystem,
          },
        });
      });
    });
  });

  describe('failure', (): void => {
    it('should reject if path is invalid', async (): Promise<
      CommandResponse
    > => {
      return expect(
        rm(exampleFileSystem, '/', 'invalid'),
      ).rejects.toMatchSnapshot();
    });

    it('should reject if no target path provided', async (): Promise<
      CommandResponse
    > => {
      return expect(rm(exampleFileSystem, '/', '')).rejects.toMatchSnapshot();
    });

    it('should reject if no options and target is a folder', async (): Promise<
      CommandResponse
    > => {
      return expect(
        rm(exampleFileSystem, '/', 'home'),
      ).rejects.toMatchSnapshot();
    });
  });
});
