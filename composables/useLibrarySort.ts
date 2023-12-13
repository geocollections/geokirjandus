import { z } from "zod";
export const useLibrarySort = () => {
  const { t } = useI18n();

  const sortQueryOptions = [
    "score desc",
    "title desc",
    "title asc",
    "date_added desc",
  ] as const;

  const sortOptionsMap = computed(
    (): SortOptionsMap<typeof sortQueryOptions> => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "title asc": { value: "title asc", name: t("sort.titleAsc") },
      "title desc": { value: "title desc", name: t("sort.titleDesc") },
      "date_added desc": { value: "date_added desc", name: t("sort.newest") },
    }),
  );

  const sort = ref<(typeof sortQueryOptions)[number]>(sortQueryOptions[0]);
  const sortOptions = computed(() => Object.values(sortOptionsMap.value));
  const currentSort = computed(() => sortOptionsMap.value[sort.value]);
  const querySchema = z.enum(sortQueryOptions).catch(sortQueryOptions[0]);

  return { sort, sortOptions, sortQueryOptions, querySchema, currentSort };
};