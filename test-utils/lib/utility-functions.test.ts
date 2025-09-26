import { expect, it, describe } from 'vitest';

import { isEmpty, urlsToArrayUtil, iconMapper } from '@/lib/utility-functions';

it('should return true if the object is empty', () => {
  expect(isEmpty({})).toBe(true);
});

it('should return false if the object is not empty', () => {
  expect(isEmpty({ a: 1, b: 2, c: 3 })).toBe(false);
});

it('Should return an empty array if "urls" is an empty string', () => {
  expect(urlsToArrayUtil('')).toEqual([]);
});

it('Should return a form array if "urls" is not empty', () => {
  expect(
    urlsToArrayUtil(
      '[{"type":"image","url":"https://example.com/image1"},{"type":"video","url":"https://example.com/video1"}]'
    )
  ).toEqual([
    { type: 'image', url: 'https://example.com/image1' },
    { type: 'video', url: 'https://example.com/video1' },
  ]);
});

// Unit test for iconMapper function
describe('iconMapper', () => {
  it('returns correct icon for create:articles permission', () => {
    expect(iconMapper('create:articles')).toBe('create');
  });

  it('returns correct icon for update:articles permission', () => {
    expect(iconMapper('update:articles')).toBe('edit_note');
  });

  it('returns correct icon for manage:articles permission', () => {
    expect(iconMapper('manage:articles')).toBe('library_books');
  });

  it('returns correct icon for create:user permission', () => {
    expect(iconMapper('create:user')).toBe('contacts');
  });

  it('returns correct icon for manage:user permission', () => {
    expect(iconMapper('manage:user')).toBe('manage_accounts');
  });

  it('returns correct icon for enable:maintenance permission', () => {
    expect(iconMapper('enable:maintenance')).toBe('wifi_off');
  });

  it('returns error icon for unknown permission', () => {
    expect(iconMapper('unknown:permission')).toBe('error');
  });
});
