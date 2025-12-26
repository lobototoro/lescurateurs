import HeaderMenu from '@/app/editor/components/headerMenu';
import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

it('Should render correctly', () => {
  const role = 'admin';
  const permissions = ['read:articles', 'edit:articles'];
  const setSelection = vi.fn();
  const { asFragment } = render(
    <HeaderMenu
      role={role}
      permissions={permissions}
      setSelection={setSelection}
      selection=""
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
