import { CommandResponse, FileSystem } from '../index';
/**
 * Given a file system, returns contents for a given file
 *
 * @param fileSystem {object} - filesystem to cat upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path of file to cat
 * @returns Promise<object> - resolves with contents of file
 */
export default function cat(fileSystem: FileSystem, currentPath: string, targetPath: string): Promise<CommandResponse>;
