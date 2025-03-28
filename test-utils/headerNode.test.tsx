import HeaderNode from '@/app/editor/components/formComponents/headerNode';
import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

it('Should render correctly', () => {
  const role = 'admin';
  const permissions = JSON.stringify(['read:articles', 'edit:articles']);
  const setSelection = vi.fn();
  const { asFragment } = render(<HeaderNode role={role} permissions={permissions} setSelection={setSelection} selection='' />);
  expect(asFragment()).toMatchSnapshot();
});