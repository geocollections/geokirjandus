import { z } from "zod";
export const useLibrarySort = () => {
  const { locale, t } = useI18n({ useScope: "global" });

  const sortOptions = [
    "score desc",
    "title desc",
    "title asc",
    "date_added desc",
  ] as const;

  const sortOptionsMap = computed(
    (): SortOptionsMap<typeof sortOptions> => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "title asc": { value: {et:"title_s asc", en: "title_en_s asc"}, name: t("sort.titleAsc") },
      "title desc": { value: {et:"title_s desc", en: "title_en_s desc"}, name: t("sort.titleDesc") },
      "date_added desc": { value: "date_added desc", name: t("sort.newest") },
    }),
  );

  const sort = ref<(typeof sortOptions)[number]>(sortOptions[0]);
  const sortSelectOptions = computed(() =>
    Object.entries(sortOptionsMap.value).map(([key, value]) => ({
      id: key as (typeof sortOptions)[number],
      ...value,
    })),
  );
  const currentSort = computed(() => sortOptionsMap.value[sort.value]);
  const querySchema = z.enum(sortOptions).catch(sortOptions[0]);
  const sortQuery = computed(() => {
    const currentSort = sortOptionsMap.value[sort.value];

    if (typeof currentSort.value === "string") {
      return currentSort.value;
    }
    return locale.value === "et" ? currentSort.value.et : currentSort.value.en;
  });

  return {
    sort,
    sortOptions,
    sortOptionsMap,
    sortQuery,
    sortSelectOptions,
    querySchema,
    currentSort,
  };
};
