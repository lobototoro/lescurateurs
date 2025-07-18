export function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export const urlsToArrayUtil = (urls: any[] | any) => (urls && urls !== '')
? JSON.parse(urls)
: [];