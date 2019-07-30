import { CommandResponse, FileSystem } from '../index';
export interface LsResultType {
    [index: string]: {
        type: 'FOLDER' | 'FILE';
    };
}
/**
 * Given a fileysystem, lists all items for a given directory
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath {string} - path to list contents within
 * @returns Promise<object> - resolves with contents of given path
 */
export default function ls(fileSystem: FileSystem, currentPath: string, targetPath?: string): Promise<CommandResponse>;
