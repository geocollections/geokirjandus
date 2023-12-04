<template>
  <div class="container px-1 lg:px-0">
    <div class="grid grid-cols-12 gap-x-4">
      <!-- <div -->
      <!--   class="hidden space-y-2 overflow-y-auto py-4 lg:sticky lg:top-[57px] lg:col-span-3 lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8" -->
      <!-- > -->
      <!--   <SearchFormReference -->
      <!--     :store="searchStore" -->
      <!--     @update="handleSubmit" -->
      <!--     @reset="handleReset" -->
      <!--   /> -->
      <!-- </div> -->
      <div class="col-span-full py-4 lg:col-span-9 lg:py-8">
        <i18n-t
          keypath="results"
          tag="div"
          class="mb-2 text-xl"
          :plural="referencesRes?.response.numFound ?? 0"
        >
          <template #count>
            <span class="font-bold">{{
              referencesRes?.response.numFound ?? 0
            }}</span>
          </template>
        </i18n-t>
        <div v-if="referencesRes?.response.numFound" class="space-y-2">
          <div class="flex items-center space-x-2">
            <ExportPopover v-if="selectStore.selected.length > 0" />
            <span
              class="text-sm text-green-600"
              v-if="selectStore.selected.length > 0"
            >
              {{ t("selected", { count: selectStore.selected.length }) }}
            </span>
          </div>
          <div class="flex flex-col items-end space-y-2 lg:flex-row">
            <div class="flex items-center">
              <USelectMenu
                class="w-40"
                v-model="searchStore.sort"
                :options="sortOptions"
                value-attribute="value"
                option-attribute="name"
                icon="i-heroicons-arrows-up-down"
              >
                <template #label>
                  {{ currentSort.name }}
                </template>
              </USelectMenu>
            </div>
            <div class="ml-auto flex items-center space-x-2">
              <USelectMenu
                v-model="searchStore.perPage"
                :options="perPageOptions"
              />
              <UPagination
                v-model="searchStore.page"
                :page-count="searchStore.perPage"
                :total="referencesRes?.response.numFound ?? 0"
                :max="5"
                show-first
                show-last
              />
            </div>
          </div>
          <template v-for="(reference, index) in references">
            <UDivider v-if="index !== 0" />
            <ReferenceSummary
              :reference="reference"
              :selected="isSelected(reference.id)"
              :position="index + (searchStore.page - 1) * searchStore.perPage"
              @update:selected="handleSelectUpdate(reference.id)"
            />
          </template>

          <UPagination
            v-model="searchStore.page"
            :ui="{ base: 'ml-auto' }"
            :page-count="searchStore.perPage"
            :total="referencesRes?.response.numFound ?? 0"
            show-first
            show-last
          />
        </div>
        <UAlert
          v-else
          color="yellow"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          :description="t('noResults')"
        />
      </div>
    </div>
    <UButton
      class="fixed bottom-2 left-1/2 mx-auto -translate-x-1/2 rounded-full lg:hidden"
      size="lg"
      icon="i-heroicons-adjustments-horizontal"
      @click="openFilters = !openFilters"
    >
      <span>
        {{ t("filters") }}
      </span>
      <span v-if="searchStore.activeFiltersCount > 0">
        ({{ searchStore.activeFiltersCount }})
      </span>
    </UButton>
    <USlideover v-model="openFilters" side="left">
      <div class="space-y-2 overflow-y-auto p-2">
        <UButton
          variant="ghost"
          color="gray"
          trailing-icon="i-heroicons-x-mark"
          @click="openFilters = !openFilters"
          >Close</UButton
        >
        <SearchFormReference
          :num-found="referencesRes?.response.numFound"
          :store="searchStore"
          @update="handleSubmit"
          @reset="handleReset"
        />
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { z } from "zod";
import { useSearchStore } from "~/stores/referenceSearchStore";
import { useReferenceSelectStore } from "~/stores/referenceSelectStore";
const router = useRouter();
const route = useRoute();
const { t } = useI18n({ useScope: "local" });

const openFilters = ref(false);
const perPageOptions = [10, 25, 50, 100];
const sortOptions = computed(() => [
  { value: "score desc", name: t("sort.best") },
  { value: "date_added desc", name: t("sort.newest") },
  { value: "title asc", name: t("sort.titleAsc") },
  { value: "title desc", name: t("sort.titleDesc") },
  { value: "year_numeric asc", name: t("sort.yearAsc") },
  { value: "year_numeric desc", name: t("sort.yearDesc") },
]);

const selectStore = useReferenceSelectStore();

const searchStore = useSearchStore();
const currentSort = computed(() =>
  sortOptions.value.find((option) => option.value === searchStore.sort),
);
searchStore.setStateFromQueryParams(route, sortOptions);

type SolrResponse<T = any> = {
  facets: any;
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
};
const { data: referencesRes, execute } = await useSolrFetch<SolrResponse>(
  "/reference",
  {
    query: computed(() => ({
      q: searchStore.solrQuery,
      rows: searchStore.perPage,
      start: (searchStore.page - 1) * searchStore.perPage,
      sort: searchStore.sort,
      json: {
        filter: searchStore.solrFilter,
      },
    })),
    watch: false,
  },
);
const references = computed(() => referencesRes.value?.response.docs ?? []);

const typeOptions = computed(() => {
  return referencesRes.value?.facets.type.buckets.map((bucket) => {
    return {
      value: bucket.val,
      name: bucket.name.buckets[0].val,
      name_en: bucket.name_en.buckets[0].val,
      count: bucket.count,
    };
  });
});

const languageOptions = computed(() => {
  return referencesRes.value?.facets.language.buckets.map((bucket) => {
    return {
      value: bucket.val,
      name: bucket.name.buckets[0].val,
      name_en: bucket.name_en.buckets[0].val,
      count: bucket.count,
    };
  });
});

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

watch(
  [
    () => searchStore.filterState.isEstonianAuthor,
    () => searchStore.filterState.isEstonianReference,
    () => searchStore.filterState.pdf,
  ],
  () => {
    handleFilterChange();
  },
);

function setQueryParamsFromState() {
  const query: z.input<typeof ParamsSchema> = {
    page: searchStore.page,
    perPage: searchStore.perPage,
    sort: searchStore.sort,
  };

  if (searchStore.searchState.activeQuery.length > 0) {
    query.q = searchStore.searchState.activeQuery;
  }

  if (searchStore.filterState.isEstonianReference) {
    query.isEstonianReference =
      searchStore.filterState.isEstonianReference.toString();
  }
  if (searchStore.filterState.isEstonianAuthor) {
    query.isEstonianAuthor =
      searchStore.filterState.isEstonianAuthor.toString();
  }
  if (searchStore.filterState.isEstonianAuthor) {
    query.pdf = searchStore.filterState.pdf.toString();
  }
  if (searchStore.filterState.title.length > 0) {
    query.title = searchStore.filterState.title;
  }
  if (searchStore.filterState.book.length > 0) {
    query.book = searchStore.filterState.book;
  }
  if (searchStore.filterState.journal.length > 0) {
    query.journal = searchStore.filterState.journal;
  }
  if (searchStore.filterState.publisher.length > 0) {
    query.publisher = searchStore.filterState.publisher;
  }
  if (searchStore.filterState.volumeOrNumber.length > 0) {
    query.volumeOrNumber = searchStore.filterState.volumeOrNumber;
  }
  if (searchStore.filterState.localities.length > 0) {
    query.localities = searchStore.filterState.localities;
  }
  if (searchStore.filterState.taxa.length > 0) {
    query.taxa = searchStore.filterState.taxa;
  }
  if (searchStore.filterState.type.size > 0) {
    query.type = Array.from(searchStore.filterState.type).join(",");
  }
  if (searchStore.filterState.language.size > 0) {
    query.language = Array.from(searchStore.filterState.type).join(",");
  }

  if (searchStore.filterState.keywords.size > 0) {
    query.keywords = Array.from(searchStore.filterState.keywords).join(",");
  }

  if (searchStore.filterState.year.some((val) => val !== null)) {
    const start = searchStore.filterState.year[0] ?? "*";
    const end = searchStore.filterState.year[1] ?? "*";

    query.year = `${start}-${end}`;
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
  execute();
}
function handleReset() {
  searchStore.resetFilters();
  setQueryParamsFromState();
  execute();
}

function handleOptionClick(option: any, valueSet: Set<string>) {
  if (valueSet.has(option.value)) {
    valueSet.delete(option.value);
  } else {
    valueSet.add(option.value);
  }
  handleFilterChange();
}

function handleSelectUpdate(updatedId: string) {
  const index = selectStore.selected.findIndex((id) => id === updatedId);
  if (index === -1) selectStore.selected.push(updatedId);
  else selectStore.selected.splice(index, 1);
}

function isSelected(id: string) {
  return selectStore.selected.includes(id);
}
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>

<i18n lang="yaml">
et:
  search: "Otsi"
  filters: "Filtrid"
  results: "Tulemused puuduvad | {count} tulemus | {count} tulemust"
  isEstonianReference: "Eesti kirjandus"
  isEstonianAuthor: "Eesti author"
  title: "Pealkiri"
  year: "Aasta"
  book: "Raamat"
  journal: "Ajakiri"
  publisher: "Kirjastus"
  volumeOrNumber: "Köide/Number"
  keywords: "Märksõnad"
  type: "Tüüp"
  language: "Keel"
  searchAllFields: "Otsi kõigilt väljadelt"
  localities: "Lokaliteedid"
  taxa: "Taksonid"
  pdf: "PDF saadaval"
  sort:
    best: "Parim vaste"
    newest: "Hiljuti lisatud"
    titleAsc: "Pealkiri A-Z"
    titleDesc: "Pealkiri Z-A"
    yearAsc: "Aasta kasvav"
    yearDesc: "Aasta kahanev"
  noResults: "Otsingu parameetritele vastavaid tulemusi ei leitud. Muuda päringut ja filtreid."
  reset: "Puhasta"
  start: "Algus"
  end: "Lõpp"
  selected: "{count} kirje valitud | {count} kirjet valitud"
en:
  search: "Search"
  filters: "Filters"
  results: "No results | {count} result | {count} results"
  isEstonianReference: "Estonian reference"
  isEstonianAuthor: "Estonian author"
  title: "Title"
  year: "Year"
  book: "Book"
  journal: "Journal"
  publisher: "Publisher"
  volumeOrNumber: "Volume/Number"
  keywords: "Keywords"
  type: "Type"
  language: "Language"
  searchAllFields: "Search all fields"
  localities: "Localities"
  taxa: "Taxa"
  pdf: "PDF available"
  sort:
    best: "Best match"
    newest: "Recently added"
    titleAsc: "Title A-Z"
    titleDesc: "Title Z-A"
    yearAsc: "Year ascending"
    yearDesc: "Year descending"
  noResults: "Search resulted in zero matching results. Change the search query and filters."
  reset: "Clear"
  start: "Start"
  end: "End"
  selected: "{count} item selected | {count} items selected"
</i18n>
