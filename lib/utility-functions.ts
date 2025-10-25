import { UrlsTypes } from '@/models/article';
import { SetValueConfig } from 'react-hook-form';

// synchronous func to check if an object is empty of props
export function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/* produce an parsed json object into js object
 *  if supabase is used, this func must be inactivated
 *  since supabase supports json object natively
 */
export const urlsToArrayUtil = (urls: any[] | any) =>
  urls && urls !== '' ? JSON.parse(urls) : [];

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
    valueSetter('urls', JSON.stringify([...urls, initialUrls]));
  };
  const removeInputs = () => {
    if (urlsArray.length > 1) {
      valueSetter('urls', JSON.stringify(urlsArray.slice(0, -1)));
    }
  };
  const updateUrls = (
    newUrl: { type: UrlsTypes; url: string; credits?: string },
    index: number
  ) => {
    const newUrls = [...urlsArray];
    newUrls[index] = newUrl;
    valueSetter('urls', JSON.stringify(newUrls));
  };

  return [addInputs, removeInputs, updateUrls] as const;
};
