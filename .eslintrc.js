module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.eslint.json',

    // Using __dirname to solve this issue:
    // https://github.com/typescript-eslint/typescript-eslint/issues/251
    tsconfigRootDir: __dirname,
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'react/prop-types': false,
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
