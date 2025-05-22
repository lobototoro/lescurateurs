/// <reference types="vitest" />
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('next/font/google', () => ({
  Alegreya: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
  Raleway: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}));

afterEach(() => {
  cleanup();
});
