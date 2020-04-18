import { pwd, pwdAutoComplete } from '../pwd';
import exampleFileSystem from '../../data/exampleFileSystem';

describe('pwd suite', (): void => {
  it('should return current path', async (): Promise<void> => {
    const result = await pwd(exampleFileSystem, '/home');

    expect(result).toStrictEqual({ commandResult: '/home' });
  });

  it('autocomplete should do nothing', async (): Promise<void> => {
    const result = await pwdAutoComplete(exampleFileSystem, '/home', '');

    expect(result).toStrictEqual({ commandResult: null });
  });
});
