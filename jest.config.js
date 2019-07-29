module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  coverageDirectory: 'coverage',
  errorOnDeprecated: true,
  moduleNameMapper: {
    '\\.(scss|jpg|png)$': '<rootDir>/node_modules/jest-css-modules',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.tsx',
  },
};
