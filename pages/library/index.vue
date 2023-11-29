<template>
  <div class="container">
    <div class="grid grid-cols-12 gap-x-4">
      <div
        class="col-span-3 space-y-2 overflow-y-auto lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <UForm :state="searchStore.searchState" @submit="handleSubmit">
          <UButtonGroup size="lg" :ui="{ wrapper: { horizontal: 'w-full' } }">
            <UInput
              v-model="searchStore.searchState.query"
              :placeholder="t('searchAllFields')"
              :ui="{ wrapper: 'w-full' }"
            />
            <UButton icon="i-heroicons-magnifying-glass" type="submit">
            </UButton>
          </UButtonGroup>
        </UForm>
        <div class="space-y-1">
          <div class="text-xl font-medium">{{ t("filters") }}</div>
          <UFormGroup :label="t('author')">
            <UInput
              v-model="searchStore.filterState.author"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
            <UInput
              v-model="searchStore.filterState.year[0]"
              @blur="handleFilterChange"
              placeholder="Start"
            />
            <UInput
              v-model="searchStore.filterState.year[1]"
              @blur="handleFilterChange"
              placeholder="End"
            />
          </UFormGroup>
          <UFormGroup :label="t('title')">
            <UInput
              v-model="searchStore.filterState.title"
              @blur="handleFilterChange"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="col-span-9 lg:py-8">
        <div class="space-y-2">
          <div class="flex items-center">
            <div class="text-xl">
              <span class="font-bold">{{
                librariesRes?.response.numFound ?? 0
              }}</span>
              results
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <USelectMenu
              class="w-40"
              v-model="searchStore.sort"
              :options="searchStore.sortOptions"
              by="value"
              option-attribute="name"
              :ui="{ wrapper: 'mr-auto' }"
            >
            </USelectMenu>
            <USelectMenu
              class="ml-auto"
              v-model="searchStore.perPage"
              :options="perPageOptions"
            />
            <UPagination
              v-model="searchStore.page"
              :page-count="searchStore.perPage"
              :total="librariesRes?.response.numFound ?? 0"
              show-first
              show-last
            />
          </div>
        </div>
        <template v-for="(library, index) in libraries">
          <UDivider v-if="index !== 0" />
          <LibrarySummary
            :library="library"
            :position="index + (searchStore.page - 1) * searchStore.perPage"
          />
        </template>

        <UPagination
          v-model="searchStore.page"
          :ui="{ base: 'ml-auto' }"
          :page-count="searchStore.perPage"
          :total="librariesRes?.response.numFound ?? 0"
          show-first
          show-last
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { useSearchStore } from "~/stores/librarySearchStore";
const { t } = useI18n({ useScope: "local" });
const router = useRouter();
const route = useRoute();
const searchStore = useSearchStore();
searchStore.setStateFromQueryParams(route);
const perPageOptions = [10, 25, 50, 100];
type SolrResponse<T = any> = {
  facets: any;
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
};

const { data: librariesRes, execute } = await useSolrFetch<SolrResponse>(
  "/library",
  {
    query: computed(() => ({
      q: searchStore.solrQuery,
      rows: searchStore.perPage,
      start: (searchStore.page - 1) * searchStore.perPage,
      sort: searchStore.sort.value,
      json: {
        filter: searchStore.solrFilter,
      },
    })),
    watch: false,
  },
);
const libraries = computed(() => librariesRes.value?.response.docs ?? []);

watch(
  () => searchStore.sort,
  () => {
    searchStore.page = 1;
    execute();
  },
);
watch(
  () => searchStore.perPage,
  () => {
    searchStore.page = 1;
    execute();
  },
);
watch(
  () => searchStore.page,
  () => execute(),
);

watch(
  [
    () => searchStore.sort,
    () => searchStore.perPage,
    () => searchStore.page,
    searchStore.searchState,
  ],
  () => {
    setQueryParamsFromState();
  },
);

function setQueryParamsFromState() {
  const query: z.input<typeof ParamsSchema> = {
    page: searchStore.page,
    perPage: searchStore.perPage,
    sort: searchStore.sort.value,
    q: searchStore.searchState.activeQuery,
  };

  if (searchStore.filterState.year.some((val) => val !== null)) {
    const start = searchStore.filterState.year[0] ?? "*";
    const end = searchStore.filterState.year[1] ?? "*";

    query.year = `${start}-${end}`;
  }
  if (searchStore.filterState.author.length > 0) {
    query.author = searchStore.filterState.author;
  }
  if (searchStore.filterState.title.length > 0) {
    query.title = searchStore.filterState.title;
  }

  router.push({
    query: query as LocationQueryRaw,
  });
}

function handleFilterChange() {
  setQueryParamsFromState();
  execute();
}
function handleSubmit() {
  searchStore.searchState.activeQuery = searchStore.searchState.query;
  execute();
}
</script>

<i18n lang="yaml">
et:
  search: "Otsi"
  filters: "Filtrid"
  year: "Aasta"
  author: "Koostaja(d)"
  title: "Pealkiri"
  searchAllFields: "Otsi kõigilt väljadelt"
en:
  search: "Search"
  filters: "Filters"
  year: "Year"
  author: "Compiler(s)"
  title: "Title"
  searchAllFields: "Search all fields"
</i18n>
