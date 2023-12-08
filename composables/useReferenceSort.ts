import { z } from "zod";
export const useReferenceSort = () => {
  const { t } = useI18n();

  const sortQueryOptions = [
    "score desc",
    "author desc",
    "author asc",
    "year_numeric desc",
    "year_numeric asc",
    "title desc",
    "title asc",
    "date_added desc",
  ] as const;

  const sortOptionsMap = computed(
    (): SortOptionsMap<typeof sortQueryOptions> => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "author asc": { value: "author asc", name: t("sort.authorAsc") },
      "author desc": { value: "author desc", name: t("sort.authorDesc") },
      "title asc": { value: "title asc", name: t("sort.titleAsc") },
      "title desc": { value: "title desc", name: t("sort.titleDesc") },
      "year_numeric asc": {
        value: "year_numeric asc",
        name: t("sort.yearAsc"),
      },
      "year_numeric desc": {
        value: "year_numeric desc",
        name: t("sort.yearDesc"),
      },
      "date_added desc": { value: "date_added desc", name: t("sort.newest") },
    }),
  );

  const sort = ref<(typeof sortQueryOptions)[number]>(sortQueryOptions[0]);
  const sortOptions = computed(() =>
    Object.values<SortOption>(sortOptionsMap.value),
  );
  const currentSort = computed(() => sortOptionsMap.value[sort.value]);
  const querySchema = z.enum(sortQueryOptions).catch(sortQueryOptions[0]);

  return { sort, sortOptions, sortQueryOptions, querySchema, currentSort };
};
