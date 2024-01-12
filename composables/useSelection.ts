export const useSelection = <T extends string | number>() => {
  const selection = ref<T[]>([]);
  return { selection };
};
