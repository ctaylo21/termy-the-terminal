import { CommandResponse, FileSystem } from '../index';

/**
 * Returns current directory
 *
 * @returns Promise<object> - resolves with current directory
 */
export default function pwd(
  _f: FileSystem,
  currentPath: string,
): Promise<CommandResponse> {
  return new Promise((resolve): void => {
    resolve({
      commandResult: currentPath,
    });
  });
}
