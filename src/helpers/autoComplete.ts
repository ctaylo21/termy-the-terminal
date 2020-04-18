import { ItemListType } from '../';

/**
 * Given a input value for a command with a target, return the new value
 * for a tab press.
 *
 * Cases:
 *  1) Matching a partial target like "fi" when "file1.txt" is an option
 *  2) Replacing last value full file path like "/home/user/"" when "user/"" is AC option
 *  3) Appending onto path like "home/" when "home" isn't in AC and is part of base path
 *
 * @param currentInputValue {string} - Current full input value
 * @param currentTargetPath {string} - Current full path of command target
 * @param targetFormattedName {string} - Full target name (include "/" for folders and file extensions)
 * @param targetPathToUpdate {string} - Section of target path to update
 * @returns {string} - Updated value to put in input
 */
export function getUpdatedInputValueFromTarget(
  currentInputValue: string,
  currentTargetPath: string,
  targetFormattedName: string,
  targetPathToUpdate?: string,
): string {
  let updatedInputValue = currentInputValue + targetFormattedName;
  if (targetPathToUpdate) {
    const isCurrentItemFolder = currentTargetPath.endsWith('/');
    updatedInputValue = currentInputValue.replace(
      new RegExp(
        isCurrentItemFolder
          ? `${targetPathToUpdate}\/$`
          : `${targetPathToUpdate}$`,
      ),
      targetFormattedName,
    );
  }

  return updatedInputValue;
}

/**
 * Given a list of files/folders and a key, return the user-friendly version
 * of that given item. This includes a trailing "/" for folders.
 *
 * @param fileSystem {object} - list of files/folders
 * @param itemKey {string} - key to grab from file system
 * @returns {string} - user-friendly item name
 */
export function formatItem(fileSystem: ItemListType, itemKey: number): string {
  const targetRawName = Object.keys(fileSystem)[itemKey];
  return fileSystem[targetRawName].type === 'FOLDER'
    ? `${targetRawName}/`
    : targetRawName;
}

/**
 * Given the current target path for an autocomplete command, return the section
 * of the target path to update. Splits a nested path into parts and grabs the last
 * part of the path
 *
 * Example:
 * "home/us" => "us"
 * "home/user/test/" => "test"
 * "home" => "home"
 *
 * @param currentTargetPath {string} - current target path, may include multiple levels
 * @returns {string} - last part of the given path
 */
export function getTargetPath(currentTargetPath: string): string {
  return currentTargetPath
    .replace(/\/$/, '')
    .split('/')
    .slice(-1)
    .pop() as string;
}
