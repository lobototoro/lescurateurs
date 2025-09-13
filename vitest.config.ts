import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
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
