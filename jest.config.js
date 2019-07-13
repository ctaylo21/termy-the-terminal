module.exports = {
  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(scss|jpg|png)$': '<rootDir>/node_modules/jest-css-modules',
    '^-!svg-react-loader.*$': '<rootDir>/src/__mocks__/svgMock.tsx',
  },
};
