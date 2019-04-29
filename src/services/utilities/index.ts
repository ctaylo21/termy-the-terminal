/**
 * Takes a valid Unix path and converts it into a format
 * that matches the internal data structure. Including replacing "/"
 * with ".children" and removing leading slash
 *
 * usr/home/test becomes usr.children.home.children.test
 *
 * @param {string} pathStr - path string to convert
 * @returns {string} - converted string
 */
export function convertPathToInternalFormat(pathStr: string): string {
  return pathStr
    .replace(/^\/+/g, '')
    .split('/')
    .map(
      (elem, index, arr): string => {
        if (elem !== '..' && index !== arr.length - 1) {
          elem += '.children';
        }
        return elem;
      },
    )
    .join('.');
}

/**
 * Takes a unix path that may contain ".." and return a new
 * string that respects the ".." path segments i.e.
 * /home/user/.. => /home
 *
 * @param pathStr {string} - unix-formatted path
 * @returns {string} - new path after taking ".." into account
 */
export function handleDotDotInPath(pathStr: string): string {
  let currentDotDots = 0;
  let pathArr = pathStr.split('/').filter((path): boolean => path.length > 0);
  for (let i = pathArr.length - 1; i >= 0; i--) {
    if (pathArr[i] === '..') {
      currentDotDots++;
    } else {
      if (currentDotDots > 0) {
        pathArr.splice(i, 1);
        currentDotDots--;
      }
    }
  }

  return pathArr.filter((path): boolean => path !== '..').join('/');
}

/**
 * Takes an path formatted for internal use and converts it to an
 * external format. i.e.
 * home.children.user => /home/user
 *
 * @param pathStr {string} - internally formatted path
 * @returns {string} - path string formatted for terminal use
 */
export function convertInternalPathToExternal(pathStr: string): string {
  return (
    '/' +
    pathStr
      .split('.')
      .filter((path): boolean => path !== 'children')
      .join('/')
  );
}

/**
 * Takes a current path and a target path, and calculates the combined path and
 * returns it in internal format. If target path is absolute, currentPath is ignored.
 *
 * @param currentPath {string} - current path in system
 * @param targetPath {string} - target path in system
 */
export function getInternalPath(
  currentPath: string,
  targetPath: string,
): string {
  if (!targetPath) {
    return currentPath;
  }

  const normalizedPath = targetPath.startsWith('/')
    ? targetPath
    : currentPath === '/'
      ? `/${targetPath}`
      : `${currentPath}/${targetPath}`;

  return convertPathToInternalFormat(handleDotDotInPath(normalizedPath));
}
