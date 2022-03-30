import { getStorageItem, setStorageItem } from '@/webapp/Features/LocalStorage/LocalStorage';

export const sortReturn = (isSorted: boolean, isSortedDesc: boolean | undefined) => {
  if (!isSorted) return '';
  if (isSortedDesc) return ' 🔽';
  return ' 🔼';
};

export const initialSortBy = (localStorageSortName: string | undefined) => {
  if (!localStorageSortName) return [];
  const getSortFromStorage = getStorageItem(localStorageSortName);

  if (!getSortFromStorage) return [];
  return getSortFromStorage;
};

export const setSortStorage = (sort: object[], localStorageSortName: string | undefined) => {
  if (localStorageSortName) setStorageItem(localStorageSortName, sort);
};
