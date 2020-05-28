import pwd from '../pwd';
const { handler, autoCompleteHandler } = pwd;
import exampleFileSystem from '../../data/exampleFileSystem';

describe('pwd suite', (): void => {
  it('should return current path', async (): Promise<void> => {
    const result = await handler(exampleFileSystem, '/home');

    expect(result).toStrictEqual({ commandResult: '/home' });
  });

  it('autocomplete should do nothing', async (): Promise<void> => {
    const result = await autoCompleteHandler(exampleFileSystem, '/home', '');

    expect(result).toStrictEqual({ commandResult: null });
  });
});
