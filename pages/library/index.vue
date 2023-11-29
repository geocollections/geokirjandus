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
import { useSearchStore } from "~/stores/librarySearchStore";
const { t } = useI18n({ useScope: "local" });
const searchStore = useSearchStore();
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

function handleSubmit() {
  searchStore.searchState.activeQuery = searchStore.searchState.query;
  execute();
}
</script>
