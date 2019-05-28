const exampleFileSystem: FileSystem = {
  home: {
    type: 'FOLDER',
    children: {
      user: {
        type: 'FOLDER',
        children: {
          test: {
            type: 'FOLDER',
            children: null,
          },
        },
      },
      videos: {
        type: 'FOLDER',
        children: {
          file2: {
            type: 'FILE',
            content: 'Contents of file 2',
            extension: 'txt',
          },
        },
      },
      file1: {
        type: 'FILE',
        content: 'Contents of file 1',
        extension: 'txt',
      },
    },
  },
  docs: {
    type: 'FOLDER',
    children: null,
  },
};

export default exampleFileSystem;
