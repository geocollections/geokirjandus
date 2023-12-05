import { z } from "zod";
import { defineStore } from "pinia";
import { useLibrarySort } from "~/composables/useLibrarySort";
import type { RouteLocation } from "vue-router";

export const useLibrariesStore = defineStore("libraries", () => {
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
    sortQueryOptions,
    sortOptions,
    currentSort,
    querySchema: sortQuerySchema,
  } = useLibrarySort();
  const {
    filters,
    activeFiltersCount,
    solrFilters,
    resetFilters,
    querySchema: filtersQuerySchema,
  } = useLibraryFilters();
  const { searchPosition, fromSearch } = useSearchPosition();

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
      year: route.query.year,
      author: route.query.author,
      title: route.query.title,
    });

    page.value = params.page;
    perPage.value = params.perPage;
    sort.value =
      sortQueryOptions.find((option) => option === params.sort) ??
      sortOptions.value[0].value;
    query.value = params.q;
    filters.value.year = params.year;
    filters.value.author = params.author;
    filters.value.title = params.title;
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
    resetFilters,
    activeFiltersCount,
    querySchema,
    searchPosition,
    fromSearch,
  };
});
