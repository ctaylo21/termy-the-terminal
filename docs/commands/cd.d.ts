import { CommandResponse, FileSystem } from '../index';
/**
 * Given a file system, validates if changing directories from a given path
 * to a new path is possible, and returns the new path if so.
 *
 * @param fileSystem {object} - filesystem to cd upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path to change to
 * @returns Promise<object> - resolves with new path if successful, rejects if not
 */
export default function cd(fileSystem: FileSystem, currentPath: string, targetPath: string): Promise<CommandResponse>;
