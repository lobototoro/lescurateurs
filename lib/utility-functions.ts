import { UrlsTypes } from '@/models/article';
import { SetValueConfig } from 'react-hook-form';

/**
 * Common utilities used by the articles feature and form helpers.
 *
 * - isEmpty: Shallow check for own enumerable properties.
 * - iconMapper: Maps permission labels to Material Symbols icon names.
 * - addRemoveInputsFactory: Small factory ("pseudo hook") that returns functions
 *   to add, remove, and update "urls" fields in a React Hook Form.
 *
 * @remarks
 * These utilities are framework-agnostic except for {@link addRemoveInputsFactory},
 * which expects a React Hook Form `setValue`-compatible function.
 *
 * @packageDocumentation
 *
 * @example
 * // isEmpty
 * isEmpty({}); // true
 * isEmpty({ a: 1 }); // false
 *
 * @example
 * // iconMapper
 * iconMapper('create:articles'); // "create"
 * iconMapper('update:articles'); // "edit_note"
 *
 * @example
 * // addRemoveInputsFactory with react-hook-form
 * const [add, remove, update] = addRemoveInputsFactory(form.getValues('urls'), form.setValue);
 * add();    // pushes an empty url entry
 * remove(); // removes the last url entry (min 1 preserved)
 * update({ type: 'website', url: 'https://example.com', credits: 'John' }, 0);
 *
 * @see isEmpty
 * @see iconMapper
 * @see addRemoveInputsFactory
 */

// synchronous func to check if an object is empty of props
export function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/* hardcoded names of icon, chosen arbitrarily */
export const iconMapper = (permissionLabel: string): string => {
  switch (permissionLabel) {
    case 'create:articles':
      return 'create';
    case 'update:articles':
      return 'edit_note';
    case 'manage:articles':
      return 'library_books';
    case 'create:user':
      return 'contacts';
    case 'manage:user':
      return 'manage_accounts';
    case 'enable:maintenance':
      return 'wifi_off';
    default:
      return 'error'; // Default icon
  }
};

/* gathering of utilities fn for inputs in create article and update article
 *  it is a pseudo hook
 */
export const addRemoveInputsFactory = (
  urlsArray: Array<{ type: UrlsTypes; url: string; credits?: string }> = [],
  valueSetter: (name: any, value: any, config?: SetValueConfig) => void
) => {
  const initialUrls = {
    type: 'website' as UrlsTypes,
    url: '',
    credits: '',
  };
  const addInputs = () => {
    const urls = urlsArray;
    valueSetter('urls', [...urls, initialUrls]);
  };
  const removeInputs = () => {
    if (urlsArray.length > 1) {
      // valueSetter('urls', JSON.stringify(urlsArray.slice(0, -1)));
      valueSetter('urls', urlsArray.slice(0, -1));
    }
  };
  const updateUrls = (
    newUrl: { type: UrlsTypes; url: string; credits?: string },
    index: number
  ) => {
    const newUrls = [...urlsArray];
    newUrls[index] = newUrl;

    // valueSetter('urls', JSON.stringify(newUrls));
    valueSetter('urls', newUrls);
  };

  return [addInputs, removeInputs, updateUrls] as const;
};
