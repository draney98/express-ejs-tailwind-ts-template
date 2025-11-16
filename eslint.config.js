// ESLint flat config (ESLint v9) - CommonJS version
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
  js.configs.recommended,
  // TypeScript rules scoped only to TS files (non type-aware to avoid JS config lint issues)
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  })),
  eslintConfigPrettier,
];
