import {isArray, isObject, isEmpty, has, get, set} from 'lodash'

export default class Commands {
  constructor (placeholder) {
    this._placeholder = placeholder
    this._commands = []
    this._responses = []
  }

  /**
   * Sets the filesystem of the terminal
   *
   * @param {object} data - the JSON representation of the file system
   */
  setData (data) {
    if (!isArray(data) && isObject(data) && !isEmpty(data)) {
      this._location = ''
      this._data = data
    }
  }

  /**
   * Prints the current working directory in the file system
   *
   * @returns {string | undefined} - The current path in the file system or undefined
   */
  pwd () {
    if (!this._data) {
      return
    }

    return '/' + this._location.replace(/._children/g, '').split('.').join('/')
  }

  /**
   * Takes a valid Unix path and converts it into a format
   * that matches the internal data structure. Doesn't handle
   * leading "/" on path. Leaves ".." path piece alone.
   *
   * usr/home/test becomes usr/_children/_home/_children/test
   * usr/home/../.. becomes usr/_children/_home/_children/../..
   *
   * @param {string} pathStr - path string to convert
   * @returns {string} - converted string
   */
  _convertPath (pathStr) {
    return pathStr.split('/').map((elem, index, arr) => {
      if (elem !== '..' && index !== arr.length - 1) {
        elem += '/_children'
      }
      return elem
    }).join('/')
  }

  /**
   * Allows user to change directory within file system. Handles ".."
   * character for moving up level and check for valid paths
   *
   * @param {string} dirPathStr - path to attempt to CD to
   * @returns {boolean} - true if cd command worked, false if not
   */
  cd (dirPathStr) {
    // Validate input and current state
    if (!this._data || !dirPathStr || dirPathStr.length < 1) {
      return false
    }

    // Default starting point to current location
    var currentPath = this._location

    // Path is from root. Ignore current location
    if (dirPathStr[0] === '/') {
      // Reset current path to root
      currentPath = ''

      // Clean path to not include /
      dirPathStr = dirPathStr.substring(1)
    }

    // Create path split by "/"
    let dirArr = this._convertPath(dirPathStr).split('/')

    // Check for valid path
    for (var i = 0; i < dirArr.length; i++) {
      // Handle moving up a level
      if (dirArr[i] === '..') {
        var folders = currentPath.split('.')
        if (folders.length <= 1) {
          // Already at root or 1 level below
          currentPath = ''
        }
        if (folders.length > 1) {
          // Move up to levels (since we have additional _children prop)
          currentPath = folders.slice(0, folders.length - 2).join('.')
        }
      } else if (!currentPath && has(this._data, `${dirArr[i]}`)) { // Check path form root
        // Found valid path from root so update location
        currentPath += `${dirArr[i]}`
      } else if (
        has(this._data, `${currentPath}.${dirArr[i]}`) && // Check path relative to current location
        isObject(get(this._data, `${currentPath}.${dirArr[i]}`))
      ) {
        // Found valid relative path so update location
        currentPath += `.${dirArr[i]}`
      } else {
        return false // No valid directory
      }
    }

    this._location = currentPath
    return true
  }

  /**
   * Lists all the contents of the current directory. Object will be empty
   * if nothing is in directory. Includes a "type" property for each item.
   *
   * @returns {object} - contents of current directory
   */
  ls () {
    if (this._data) {
      let contents = this._data
      let result = {}
      if (this._location) {
        contents = get(this._data, `${this._location}._children`)
      }

      for (let item in contents) {
        result[item] = {
          type: contents[item]._type
        }
      }

      return result
    }

    return {}
  }

  /**
   * Creates a new directory in the current directory
   *
   * @returns {object} - result of the mkdir command
   * @returns {boolean} result.success - true if success, false if not
   * @returns {string} result.errorCode - error code (one of following: ERR_PATH_EXISTS)
   * @returns {string} result.errorMsg - user-friendly error description if command failed
   */
  mkdir (folderName) {
    let newDir = {
      _type: 'folder',
      _children: {}
    }

    let dirPath = folderName

    if (this._location) {
      dirPath = `${this._location}._children.${folderName}`
    }

    // Check if that path already exists
    if (has(this._data, dirPath)) {
      return {
        success: false,
        errorCode: 'ERR_PATH_EXISTS',
        errorMsg: `${folderName}: File exists`
      }
    }

    this._data = set(this._data, dirPath, newDir)
    return {success: true}
  }
}