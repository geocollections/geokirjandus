import { defineStore } from "pinia";
import type { RouteLocation } from "vue-router";
import { z } from "zod";

export const useReferencesStore = defineStore(
  "references",
  () => {
    const {
      page,
      perPage,
      perPageOptions,
      offset,
      querySchema: paginationQuerySchema,
    } = usePagination();
    const { query, solrQuery } = useQuery();
    const {
      sort,
      sortOptions,
      sortQueryOptions,
      currentSort,
      querySchema: sortQuerySchema,
    } = useReferenceSort();
    const {
      filters,
      activeFiltersCount,
      solrFilters,
      resetFilters,
      querySchema: filtersQuerySchema,
    } = useReferenceFilters();
    const { searchPosition, enteredFrom, fromSearch } = useSearchPosition();

    const querySchema = z
      .object({
        q: z.string().catch(""),
        sort: sortQuerySchema,
      })
      .merge(filtersQuerySchema)
      .merge(paginationQuerySchema);

    function setStateFromQueryParams(route: RouteLocation) {
      const params = querySchema.parse({
        sort: route.query.sort,
        page: route.query.page,
        perPage: route.query.perPage,
        q: route.query.q,
        isEstonianReference: route.query.isEstonianReference,
        isEstonianAuthor: route.query.isEstonianAuthor,
        pdf: route.query.pdf,
        title: route.query.title,
        book: route.query.book,
        journal: route.query.journal,
        year: route.query.year,
        publisher: route.query.publisher,
        type: route.query.type,
        language: route.query.language,
        keywords: route.query.keywords,
        volumeOrNumber: route.query.volumeOrNumber,
        localities: route.query.localites,
        taxa: route.query.taxa,
      });

      page.value = params.page;
      perPage.value = params.perPage;
      sort.value =
        sortQueryOptions.find((option) => option === params.sort) ??
        sortOptions.value[0].value;
      query.value = params.q;
      filters.value.isEstonianReference = params.isEstonianReference;
      filters.value.isEstonianAuthor = params.isEstonianAuthor;
      filters.value.pdf = params.pdf;
      filters.value.year = params.year;
      filters.value.title = params.title;
      filters.value.book = params.book;
      filters.value.journal = params.journal;
      filters.value.publisher = params.publisher;
      filters.value.volumeOrNumber = params.volumeOrNumber;
      filters.value.type = params.type;
      filters.value.language = params.language;
      filters.value.keywords = params.keywords;
      filters.value.localities = params.localities;
      filters.value.taxa = params.taxa;
    }

    return {
      query,
      solrQuery,
      page,
      perPage,
      perPageOptions,
      offset,
      sortOptions,
      sort,
      currentSort,
      filters,
      solrFilters,
      setStateFromQueryParams,
      searchPosition,
      enteredFrom,
      fromSearch,
      resetFilters,
      activeFiltersCount,
      querySchema,
    };
  },
  {
    persist: {
      paths: ["searchPosition", "sort", "page", "perPage", "filters", "query"],
      storage: persistedState.sessionStorage,
      serializer: {
        serialize: (value) => {
          return JSON.stringify(value, (_key, v) => {
            return v instanceof Set ? [...v] : v;
          });
        },
        deserialize: (value) => {
          return JSON.parse(value, (k, v) => {
            if (["keywords", "language", "type"].includes(k)) {
              return new Set(v);
            }
            return v;
          });
        },
      },
    },
  },
);
