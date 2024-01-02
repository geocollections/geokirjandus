import { z } from "zod";
export const useLibrarySort = () => {
  const { t } = useI18n();

  const sortOptions = [
    "score desc",
    "title_str desc",
    "title_str asc",
    "date_added desc",
  ] as const;

  const sortOptionsMap = computed(
    (): SortOptionsMap<typeof sortOptions> => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "title_str asc": { value: "title_str asc", name: t("sort.titleAsc") },
      "title_str desc": { value: "title_str desc", name: t("sort.titleDesc") },
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
  const sortQuery = computed(() => sortOptionsMap.value[sort.value].value);

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
