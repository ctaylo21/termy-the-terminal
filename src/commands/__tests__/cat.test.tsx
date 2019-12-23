import cat from '../cat';
import exampleFileSystem from '../../data/exampleFileSystem';
import { render } from '@testing-library/react';
jest.mock('../../images/dog.png', () => 'abc/dog.png');

afterAll(() => {
  jest.clearAllMocks();
});

describe('cat suite', (): void => {
  it('should print contents of file with no path', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, '/home', 'file1.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 1',
    });
  });

  it('should print contents of file with path from root', async (): Promise<
    void
  > => {
    return expect(
      cat(exampleFileSystem, '/', 'home/videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should handle image extension', async (): Promise<void> => {
    const { commandResult } = await cat(exampleFileSystem, '/', 'home/dog.png');

    const { container } = render(commandResult as JSX.Element);

    expect(container.getElementsByTagName('img').length).toBe(1);
    expect(container.getElementsByTagName('img')[0].src).toEqual(
      'http://localhost/abc/dog.png',
    );
  });

  it('should print contents of file with path from nested path', async (): Promise<
    void
  > => {
    return expect(
      cat(exampleFileSystem, '/home', 'videos/file2.txt'),
    ).resolves.toStrictEqual({
      commandResult: 'Contents of file 2',
    });
  });

  it('should reject if target is not a file', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, 'home', 'videos'),
    ).rejects.toMatchSnapshot();
  });

  it('should reject if target is not a valid path', async (): Promise<void> => {
    return expect(
      cat(exampleFileSystem, '/', 'invalid'),
    ).rejects.toMatchSnapshot();
  });
});
