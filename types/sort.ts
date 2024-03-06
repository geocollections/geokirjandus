export type SortOption = { value: string | {et: string, en: string}; name: string };
export type SortOptionsMap<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: SortOption;
};
