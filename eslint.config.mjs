import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const previousConfig = defineConfig([
  {
    extends: [
      ...nextCoreWebVitals,
      ...compat.extends('plugin:@typescript-eslint/recommended'),
      ...compat.extends('prettier'),
    ],

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },

    rules: {
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      'lines-around-comment': [
        'error',
        {
          beforeLineComment: true,
          beforeBlockComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],

      'newline-before-return': 'error',
    },
  },
  {
    files: ['src/iconify-bundle/*'],

    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]);

const ignoredFolders = defineConfig([
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    '.github/**',
    '.nyc_output/**',
    'certificates/**',
    'coverage/**',
    'final-coverage/**',
    'playwright-report/**',
    'test-results/**',
    'tests-e2e/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default defineConfig([...previousConfig, ...ignoredFolders]);
