import { z } from "zod";
export const useSearchStore = defineStore("searchLibrary", () => {
  const { locale } = useI18n();
  const allowedValues = {
    perPage: [10, 25, 50, 100],
    sort: ["date_added desc", "date_added asc", "title desc", "title asc"],
  } as const;

  const ParamsSchema = z.object({
    sort: z.enum(allowedValues.sort).catch(allowedValues.sort[0]),
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val > 0)
      .catch(1),
    perPage: z
      .string()
      .transform((val) => parseInt(val))
      .refine((value): value is (typeof allowedValues.perPage)[number] =>
        allowedValues.perPage.includes(
          value as (typeof allowedValues.perPage)[number],
        ),
      )
      .catch(allowedValues.perPage[1]),
    q: z.string().catch(""),
    year: z
      .string()
      .transform((val, ctx) => {
        let [startStr, endStr] = val.split("-");
        const start = parseInt(startStr) || null;
        const end = parseInt(endStr) || null;

        if (start && end && start > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start year cannot be later than end year",
          });
          return z.NEVER;
        }

        return [start, end];
      })
      .catch([null, null]),
    author: z.string().catch(""),
    title: z.string().catch(""),
  });
  const sortOptions = computed(() => [
    { value: "date_added desc", name: "Newest" },
    { value: "date_added asc", name: "Oldest" },
    { value: "title asc", name: "Title A-Z" },
    { value: "title desc", name: "Title Z-A" },
  ]);
  const perPageOptions = [10, 25, 50, 100];
  const perPage = ref(25);

  const sort = ref(sortOptions.value[0]);
  const page = ref(1);
  const searchState = reactive({
    query: "",
    activeQuery: "",
  });
  const filterState = reactive({
    year: [null, null] as (number | null)[],
    author: "",
    title: "",
  });
  function $reset() {
    page.value = 1;
    searchState.query = "";
    searchState.activeQuery = "";
    filterState.year = [null, null];
    filterState.author = "";
    filterState.title = "";
  }

  const solrFilter = computed(() => {
    const filters = [];

    if (filterState.year.some((val) => val !== null)) {
      const start = filterState.year[0] ?? "*";
      const end = filterState.year[1] ?? "*";
      filters.push(`year:[${start} TO ${end}]`);
    }

    if (filterState.author.length > 0) {
      filters.push(`author:*${filterState.author}*`);
    }
    if (filterState.title.length > 0) {
      if (locale.value === "et") {
        filters.push(`title:*${filterState.title}*`);
      } else {
        filters.push(`title_en:*${filterState.title}*`);
      }
    }

    return filters;
  });

  function setStateFromQueryParams(route) {
    const params = ParamsSchema.parse({
      sort: route.query.sort,
      page: route.query.page,
      perPage: route.query.perPage,
      q: route.query.q,
      year: route.query.year,
      author: route.query.author,
      title: route.query.title,
    });

    page.value = params.page;
    perPage.value = params.perPage;
    sort.value =
      sortOptions.value.find((option) => option.value === params.sort) ??
      sortOptions.value[0];
    searchState.query = params.q;
    searchState.activeQuery = params.q;
    filterState.year = params.year;
    filterState.author = params.author;
    filterState.title = params.title;
  }

  const solrQuery = computed(() => {
    return searchState.activeQuery.length < 1 ? "*" : searchState.activeQuery;
  });

  const selectedPosition = ref(0);
  return {
    filterState,
    searchState,
    solrFilter,
    solrQuery,
    sort,
    sortOptions,
    page,
    perPage,
    setStateFromQueryParams,
    selectedPosition,
  };
});
