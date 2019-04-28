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
          video1: {
            type: 'FILE',
          },
        },
      },
    },
  },
  docs: {
    type: 'FOLDER',
    children: null,
  },
};

export default exampleFileSystem;
