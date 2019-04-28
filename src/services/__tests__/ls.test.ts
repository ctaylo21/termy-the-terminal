import ls from '../ls';

const testSystem: FileSystem = {
  home: {
    type: 'FOLDER',
    children: {
      folder1: {
        type: 'FOLDER',
        children: {
          folder3: {
            type: 'FOLDER',
            children: {
              file1: {
                type: 'FILE',
              },
            },
          },
        },
      },
      folder2: {
        type: 'FOLDER',
        children: null,
      },
      file2: {
        type: 'FILE',
      },
    },
  },
};

describe('ls suite', (): void => {
  test('should return correct folder object from root', async (): Promise<
    object
  > => {
    const expectedLs = {
      home: {
        type: 'FOLDER',
      },
    };

    return expect(ls(testSystem, '/')).resolves.toEqual(expectedLs);
  });

  test('should return correct folder object from nested path', async (): Promise<
    object
  > => {
    const expectedLs = {
      folder1: {
        type: 'FOLDER',
      },
      folder2: {
        type: 'FOLDER',
      },
      file2: {
        type: 'FILE',
      },
    };

    return expect(ls(testSystem, '/home')).resolves.toEqual(expectedLs);
  });
});
