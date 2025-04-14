import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import IstanbulPlugin from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.USE_BABEL_PLUGIN_ISTANBUL
      ? [
          IstanbulPlugin({
            include: './',
            exclude: ['node_modules', 'tests-e2e/**'],
            extension: ['.js', '.ts', '.tsx'],
          }),
        ]
      : []),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['app/**/*.{js,ts,jsx,tsx}'],
    },
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'tests-e2e/**',
    ],
  },
  resolve: {
    alias: {
      '@/': '/',
    },
  },
});