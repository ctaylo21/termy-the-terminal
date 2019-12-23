import { FileSystem } from '../../src/index';
import dogImg from '../../src/images/dog.png';

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
      dog: {
        type: 'FILE',
        content: dogImg,
        extension: 'png',
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
  file3: {
    type: 'FILE',
    content: 'Contents of file 3',
    extension: 'txt',
  },
};

export default exampleFileSystem;
