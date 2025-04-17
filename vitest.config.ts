import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()],
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