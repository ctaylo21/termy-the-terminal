import ls from '../ls';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('ls suite', (): void => {
  test('root with no directory', async (): Promise<object> => {
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

  test('nested path with no directory', async (): Promise<object> => {
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

  test('relative path from root', async (): Promise<object> => {
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

    return expect(ls(exampleFileSystem, '/', 'home')).resolves.toEqual(
      expectedLs,
    );
  });

  test('relative path from nested path', async (): Promise<object> => {
    const expectedLs = {
      test: {
        type: 'FOLDER',
      },
    };

    return expect(ls(exampleFileSystem, '/home', 'user')).resolves.toEqual(
      expectedLs,
    );
  });

  test('root with dotdot', async (): Promise<object> => {
    const expectedLs = {
      home: {
        type: 'FOLDER',
      },
      docs: {
        type: 'FOLDER',
      },
    };

    return expect(ls(exampleFileSystem, '/', '..')).resolves.toEqual(
      expectedLs,
    );
  });

  test('nestd path with dotdot', async (): Promise<object> => {
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

    return expect(
      ls(exampleFileSystem, '/home', '../home/user/..'),
    ).resolves.toEqual(expectedLs);
  });

  test('should reject if invalid directory given', async (): Promise<
    LsResultType
  > => {
    return expect(
      ls(exampleFileSystem, '/invalid'),
    ).rejects.toMatchInlineSnapshot(`"Target folder does not exist"`);
  });

  test('empty path from nested location', async (): Promise<object> => {
    const expectedLs = {
      test: {
        type: 'FOLDER',
      },
    };

    return expect(ls(exampleFileSystem, '/home/user', '')).resolves.toEqual(
      expectedLs,
    );
  });
});
