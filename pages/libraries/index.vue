<template>
  <div class="container">
    <div class="grid grid-cols-12 gap-x-4">
      <div
        class="col-span-3 space-y-2 overflow-y-auto lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <UForm :state="{ localQuery }" @submit="handleSubmit">
          <UButtonGroup size="lg" :ui="{ wrapper: { horizontal: 'w-full' } }">
            <UInput
              v-model="localQuery"
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
              v-model="librariesStore.filters.author"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
            <UInput
              v-model="librariesStore.filters.year[0]"
              @blur="handleFilterChange"
              placeholder="Start"
            />
            <UInput
              v-model="librariesStore.filters.year[1]"
              @blur="handleFilterChange"
              placeholder="End"
            />
          </UFormGroup>
          <UFormGroup :label="t('title')">
            <UInput
              v-model="librariesStore.filters.title"
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
              v-model="librariesStore.sort"
              :options="librariesStore.sortOptions"
              by="value"
              option-attribute="name"
              :ui="{ wrapper: 'mr-auto' }"
            >
            </USelectMenu>
            <USelectMenu
              class="ml-auto"
              v-model="librariesStore.perPage"
              :options="librariesStore.perPageOptions"
            />
            <UPagination
              v-model="librariesStore.page"
              :page-count="librariesStore.perPage"
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
            :position="
              index + (librariesStore.page - 1) * librariesStore.perPage
            "
          />
        </template>

        <UPagination
          v-model="librariesStore.page"
          :ui="{ base: 'ml-auto' }"
          :page-count="librariesStore.perPage"
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
import { z } from "zod";
definePageMeta({
  alias: "/library",
});

const { t } = useI18n({ useScope: "local" });
const router = useRouter();
const route = useRoute();
const librariesStore = useLibrariesStore();
const localQuery = ref("");
librariesStore.setStateFromQueryParams(route);
localQuery.value = librariesStore.query;

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
      q: librariesStore.solrQuery,
      rows: librariesStore.perPage,
      start: (librariesStore.page - 1) * librariesStore.perPage,
      sort: librariesStore.sort,
      json: {
        filter: librariesStore.solrFilters,
      },
    })),
    watch: false,
  },
);
const libraries = computed(() => librariesRes.value?.response.docs ?? []);

watch(
  () => librariesStore.sort,
  () => {
    librariesStore.page = 1;
    execute();
  },
);
watch(
  () => librariesStore.perPage,
  () => {
    librariesStore.page = 1;
    execute();
  },
);
watch(
  () => librariesStore.page,
  () => execute(),
);

watch(
  [
    () => librariesStore.sort,
    () => librariesStore.perPage,
    () => librariesStore.page,
    () => librariesStore.query,
  ],
  () => {
    setQueryParamsFromState();
  },
);

function setQueryParamsFromState() {
  const query: z.input<typeof librariesStore.querySchema> = {
    page: librariesStore.page,
    perPage: librariesStore.perPage,
    sort: librariesStore.sort,
    q: librariesStore.query,
  };

  if (librariesStore.filters.year.some((val) => val !== null)) {
    const start = librariesStore.filters.year[0] ?? "*";
    const end = librariesStore.filters.year[1] ?? "*";

    query.year = `${start}-${end}`;
  }
  if (librariesStore.filters.author.length > 0) {
    query.author = librariesStore.filters.author;
  }
  if (librariesStore.filters.title.length > 0) {
    query.title = librariesStore.filters.title;
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
  librariesStore.query = localQuery.value;
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
