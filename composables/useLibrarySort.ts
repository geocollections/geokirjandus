import { z } from "zod";
export const useLibrarySort = () => {
  const { t } = useI18n();

  const sortQueryOptions = [
    "score desc",
    "title desc",
    "title asc",
    "date_added desc",
  ] as const;

  type SortOption<K> = { value: K; name: string };
  type SortOptionsMap = {
    [K in (typeof sortQueryOptions)[number]]: SortOption<K>;
  };

  const sortOptionsMap = computed(
    (): SortOptionsMap => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "title asc": { value: "title asc", name: t("sort.titleAsc") },
      "title desc": { value: "title desc", name: t("sort.titleDesc") },
      "date_added desc": { value: "date_added desc", name: t("sort.newest") },
    }),
  );

  const sortOptions = computed(() => Object.values(sortOptionsMap.value));

  const sort = ref<(typeof sortQueryOptions)[number]>(sortQueryOptions[0]);

  const currentSort = computed(() => sortOptionsMap.value[sort.value]);

  const querySchema = z.enum(sortQueryOptions).catch(sortQueryOptions[0]);

  return { sort, sortOptions, sortQueryOptions, querySchema, currentSort };
};
