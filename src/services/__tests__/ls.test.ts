import ls from '../ls';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('ls suite', (): void => {
  test('should return correct folder object from root', async (): Promise<
    object
  > => {
    const expectedLs = {
      home: {
        type: 'FOLDER',
      },
      docs: {
        type: 'FOLDER',
      },
    };

    return expect(ls(exampleFileSystem, '/')).resolves.toEqual(expectedLs);
  });

  test('should return correct folder object from nested path', async (): Promise<
    object
  > => {
    const expectedLs = {
      user: {
        type: 'FOLDER',
      },
      videos: {
        type: 'FOLDER',
      },
      file1: {
        type: 'FILE',
      },
    };

    return expect(ls(exampleFileSystem, '/home')).resolves.toEqual(expectedLs);
  });

  test('should reject if invalid directory given', async (): Promise<
    LsResultType
  > => {
    return expect(
      ls(exampleFileSystem, '/invalid'),
    ).rejects.toMatchInlineSnapshot(`"Target folder does not exist"`);
  });
});
