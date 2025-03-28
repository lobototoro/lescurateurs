import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import Header from '@/app/components/header';

it('Should render correctly', () => {
  const { asFragment } = render(<Header />);
  expect(asFragment()).toMatchSnapshot();
});