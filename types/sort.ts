export type SortOption<K> = { value: K; name: string };
export type SortOptionsMap<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: SortOption<K>;
};
