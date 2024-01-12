import { z } from "zod";
export const useReferenceSort = () => {
  const { t } = useI18n({ useScope: "global" });

  const sortOptions = [
    "score desc",
    "author desc",
    "author asc",
    "year desc",
    "year asc",
    "date_added desc",
    "date_changed desc",
    "title desc",
    "title asc",
  ] as const;

  const sortOptionsMap = computed(
    (): SortOptionsMap<typeof sortOptions> => ({
      "score desc": { value: "score desc", name: t("sort.best") },
      "author asc": {
        value: "author asc,year_numeric desc,title asc",
        name: t("sort.authorAsc"),
      },
      "author desc": {
        value: "author desc,year_numeric desc,title asc",
        name: t("sort.authorDesc"),
      },
      "year asc": {
        value: "year_numeric asc,author asc,title asc",
        name: t("sort.yearAsc"),
      },
      "year desc": {
        value: "year_numeric desc,author asc,title asc",
        name: t("sort.yearDesc"),
      },
      "date_added desc": { value: "date_added desc", name: t("sort.newest") },
      "date_changed desc": {
        value: "date_changed desc",
        name: t("sort.changed"),
      },
      "title asc": { value: "title_str asc", name: t("sort.titleAsc") },
      "title desc": { value: "title_str desc", name: t("sort.titleDesc") },
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
    sortSelectOptions,
    sortOptionsMap,
    sortOptions,
    sortQuery,
    querySchema,
    currentSort,
  };
};
