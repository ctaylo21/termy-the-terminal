import { AutoCompleteResponse, FileSystem } from '../index';
import { getTarget } from './utilities';
import { ItemListType } from '../';

/**
 * Takes an internally formatted filesystem and formats it into the
 * expected format for an ls command. Optionally takes a function to apply
 * to the intiial result to filter out certain items.
 *
 * @param directory {object} - internally formatted filesystem
 * @param filterFn {function} - optional fn to filter certain items
 */
function buildAutoCompleteData(
  fileSystem: FileSystem,
  autoCompleteMatch: string,
  filterFn: (item: ItemListType) => boolean,
): ItemListType {
  const autoCompleteMatchFn = (item: ItemListType): boolean =>
    Object.keys(item)[0].startsWith(autoCompleteMatch);

  return Object.assign(
    {},
    ...Object.keys(fileSystem)
      .map((item) => ({
        [fileSystem[item].type === 'FILE'
          ? `${item}.${fileSystem[item].extension}`
          : item]: {
          type: fileSystem[item].type,
        },
      }))
      .filter(autoCompleteMatchFn)
      .filter(filterFn),
  );
}

/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
export default function autoComplete(
  fileSystem: FileSystem,
  currentPath: string,
  target: string,
  filterFn: (item: ItemListType) => boolean = (): boolean => true,
): Promise<AutoCompleteResponse> {
  return new Promise((resolve): void => {
    // Default to searching in currenty directory with simple target
    // that contains no path
    let autoCompleteMatch = target;
    let targetPath = '';

    // Handle case where target is a nested path and
    // we need to pull off last part of path to match against
    const pathParts = target.split('/');
    if (pathParts.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      autoCompleteMatch = pathParts.pop()!;
      targetPath = pathParts.join('/');
    }

    let targetFolderContents;
    try {
      targetFolderContents = getTarget(fileSystem, currentPath, targetPath);
    } catch (e) {
      return resolve({ commandResult: undefined });
    }

    resolve({
      commandResult: buildAutoCompleteData(
        targetFolderContents,
        autoCompleteMatch,
        filterFn,
      ),
    });
  });
}
