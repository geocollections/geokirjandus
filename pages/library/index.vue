<template>
  <Search :filter-count="librariesStore.activeFiltersCount">
    <template #filters>
      <SearchFormLibrary @update="handleSubmit" @reset="handleReset" />
    </template>
    <div class="space-y-2">
      <div class="flex items-center">
        <div class="text-xl">
          <span class="font-bold">
            {{ librariesRes?.response.numFound ?? 0 }}
          </span>
          results
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <USelectMenu
          class="w-40"
          v-model="librariesStore.sort"
          :options="librariesStore.sortOptions"
          value-attribute="value"
          option-attribute="name"
          icon="i-heroicons-arrows-up-down"
          :ui="{ wrapper: 'mr-auto' }"
        >
          <template #label>
            {{ librariesStore.currentSort.name }}
          </template>
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
        :position="index + (librariesStore.page - 1) * librariesStore.perPage"
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
    <template #mobile-filters>
      <SearchFormLibrary
        :num-found="librariesRes?.response.numFound"
        @update="handleSubmit"
        @reset="handleReset"
      />
    </template>
  </Search>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { z } from "zod";

const { t } = useI18n({ useScope: "local" });
useHead({
  title: t("title"),
});

const router = useRouter();
const route = useRoute();
const librariesStore = useLibrariesStore();
const localQuery = ref("");
librariesStore.setStateFromQueryParams(route);
localQuery.value = librariesStore.query;

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

function handleSubmit() {
  librariesStore.query = localQuery.value;
  execute();
}
function handleReset() {
  librariesStore.resetFilters();
  setQueryParamsFromState();
  execute();
}
</script>
<i18n lang="yaml">
et:
  title: "Kogumikud"
en:
  title: "Libraries"
</i18n>
