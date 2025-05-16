import { cleanup } from '@testing-library/react';
import { afterEach, vi, vitest } from 'vitest';

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