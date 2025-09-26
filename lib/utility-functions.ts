export function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export const urlsToArrayUtil = (urls: any[] | any) =>
  urls && urls !== '' ? JSON.parse(urls) : [];

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
