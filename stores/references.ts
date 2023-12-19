import { defineStore } from "pinia";
import type { LocationQueryRaw, RouteLocation } from "vue-router";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

export const useReferencesStore = defineStore(
  "references",
  () => {
    const getRouteBaseName = useRouteBaseName();
    const {
      page,
      perPage,
      perPageMenuOptions,
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
    const { selection } = useSelection<string>();

    const route = useRoute();
    const router = useRouter();
    const routeSolrFilters = computed(() => {
      const baseName = getRouteBaseName(route);
      const res = [];

      if (baseName?.startsWith("library") && route.params.id) {
        res.push(`libraries:${route.params.id}`);
      }
      return res;
    });
    const enteredFromRouteSolrFilters = computed(() => {
      const enteredFromRoute = router.resolve(enteredFrom.value);
      const baseName = getRouteBaseName(enteredFromRoute);
      const res = [];

      if (baseName?.startsWith("library") && enteredFromRoute.params.id) {
        res.push(`libraries:${enteredFromRoute.params.id}`);
      }
      return res;
    });

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
        author: route.query.author,
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
      filters.value.author = params.author;
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
    function getQueryParams() {
      const queryParams: LocationQueryRaw = {
        page: page.value,
        perPage: perPage.value,
        sort: sort.value,
      };

      if (query.value.length > 0) {
        queryParams.q = query.value;
      }

      if (filters.value.isEstonianReference) {
        queryParams.isEstonianReference =
          filters.value.isEstonianReference.toString();
      }
      if (filters.value.isEstonianAuthor) {
        queryParams.isEstonianAuthor =
          filters.value.isEstonianAuthor.toString();
      }
      if (filters.value.isEstonianAuthor) {
        queryParams.pdf = filters.value.pdf.toString();
      }
      if (filters.value.author.length > 0) {
        queryParams.author = filters.value.author;
      }
      if (filters.value.title.length > 0) {
        queryParams.title = filters.value.title;
      }
      if (filters.value.book.length > 0) {
        queryParams.book = filters.value.book;
      }
      if (filters.value.journal.length > 0) {
        queryParams.journal = filters.value.journal;
      }
      if (filters.value.publisher.length > 0) {
        queryParams.publisher = filters.value.publisher;
      }
      if (filters.value.volumeOrNumber.length > 0) {
        queryParams.volumeOrNumber = filters.value.volumeOrNumber;
      }
      if (filters.value.localities.length > 0) {
        queryParams.localities = filters.value.localities;
      }
      if (filters.value.taxa.length > 0) {
        queryParams.taxa = filters.value.taxa;
      }
      if (filters.value.type.size > 0) {
        queryParams.type = Array.from(filters.value.type).join(",");
      }
      if (filters.value.language.size > 0) {
        queryParams.language = Array.from(filters.value.type).join(",");
      }

      if (filters.value.keywords.size > 0) {
        queryParams.keywords = Array.from(filters.value.keywords).join(",");
      }

      if (filters.value.year.some((val) => val !== undefined)) {
        const start = filters.value.year[0] ?? "*";
        const end = filters.value.year[1] ?? "*";

        queryParams.year = `${start}-${end}`;
      }
      return queryParams;
    }

    return {
      query,
      solrQuery,
      page,
      perPage,
      perPageMenuOptions,
      offset,
      sortOptions,
      sort,
      currentSort,
      filters,
      solrFilters,
      routeSolrFilters,
      enteredFromRouteSolrFilters,
      setStateFromQueryParams,
      getQueryParams,
      searchPosition,
      enteredFrom,
      fromSearch,
      resetFilters,
      activeFiltersCount,
      querySchema,
      selection,
    };
  },
  {
    persist: {
      paths: [
        "searchPosition",
        "sort",
        "page",
        "perPage",
        "filters",
        "query",
        "selection",
      ],
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
