import cat from '../cat';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('cat suite', (): void => {
  it('should print contents of file with no path', async (): Promise<
    CommandResponse
  > => {
    return expect(
      cat(exampleFileSystem, '/home', 'file1.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 1',
    });
  });

  it('should print contents of file with path from root', async (): Promise<
    CommandResponse
  > => {
    return expect(
      cat(exampleFileSystem, '/', 'home/videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should print contents of file with path from netsted path', async (): Promise<
    CommandResponse
  > => {
    return expect(
      cat(exampleFileSystem, '/home', 'videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should reject if target is not a file', async (): Promise<
    CommandResponse
  > => {
    return expect(
      cat(exampleFileSystem, 'home', 'videos'),
    ).rejects.toMatchSnapshot();
  });

  it('should reject if target is not a valid path', async (): Promise<
    CommandResponse
  > => {
    return expect(
      cat(exampleFileSystem, '/', 'invalid'),
    ).rejects.toMatchSnapshot();
  });
});
