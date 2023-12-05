<template>
  <div class="container">
    <div class="grid grid-cols-12 gap-x-4">
      <div
        class="hidden space-y-2 overflow-y-auto py-4 lg:sticky lg:top-[57px] lg:col-span-3 lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <SearchFormReference @update="handleSubmit" @reset="handleReset" />
      </div>
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
                v-model="referencesStore.sort"
                :options="referencesStore.sortOptions"
                value-attribute="value"
                option-attribute="name"
                icon="i-heroicons-arrows-up-down"
              >
                <template #label>
                  {{ referencesStore.currentSort.name }}
                </template>
              </USelectMenu>
            </div>
            <div class="ml-auto flex items-center space-x-2">
              <USelectMenu
                v-model="referencesStore.perPage"
                :options="referencesStore.perPageOptions"
              />
              <UPagination
                v-model="referencesStore.page"
                :page-count="referencesStore.perPage"
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
              :position="
                index + (referencesStore.page - 1) * referencesStore.perPage
              "
              @update:selected="handleSelectUpdate(reference.id)"
            />
          </template>

          <UPagination
            v-model="referencesStore.page"
            :ui="{ base: 'ml-auto' }"
            :page-count="referencesStore.perPage"
            :total="referencesRes?.response.numFound ?? 0"
            :max="5"
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
      class="fixed bottom-2 left-1/2 z-10 mx-auto -translate-x-1/2 rounded-full lg:hidden"
      size="lg"
      icon="i-heroicons-adjustments-horizontal"
      @click="openFilters = !openFilters"
    >
      <span>
        {{ t("filters") }}
      </span>
      <span v-if="referencesStore.activeFiltersCount > 0">
        ({{ referencesStore.activeFiltersCount }})
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
import { useReferencesStore } from "~/stores/references";
import { useReferenceSelectStore } from "~/stores/referenceSelectStore";

definePageMeta({
  alias: "/references",
});

const router = useRouter();
const route = useRoute();
const { t } = useI18n({ useScope: "local" });

const openFilters = ref(false);

const referencesStore = useReferencesStore();
const selectStore = useReferenceSelectStore();

referencesStore.setStateFromQueryParams(route);

type SolrResponse<T = any> = {
  facets: any;
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
};
const { data: referencesRes, refresh: refreshReferences } =
  await useSolrFetch<SolrResponse>("/reference", {
    query: computed(() => ({
      q: referencesStore.solrQuery,
      rows: referencesStore.perPage,
      start: referencesStore.offset,
      sort: referencesStore.sort,
      json: {
        filter: referencesStore.solrFilters,
      },
    })),
    watch: false,
  });
const references = computed(() => referencesRes.value?.response.docs ?? []);

watch([() => referencesStore.sort, () => referencesStore.perPage], () => {
  referencesStore.page = 1;
  refreshReferences();
});
watch(
  () => referencesStore.page,
  () => refreshReferences(),
);

watch(
  [
    () => referencesStore.sort,
    () => referencesStore.perPage,
    () => referencesStore.page,
    () => referencesStore.query,
  ],
  () => {
    setQueryParamsFromState();
  },
);

watch(
  [
    () => referencesStore.filters.isEstonianAuthor,
    () => referencesStore.filters.isEstonianReference,
    () => referencesStore.filters.pdf,
  ],
  () => {
    handleFilterChange();
  },
);

function setQueryParamsFromState() {
  const query: z.input<typeof referencesStore.querySchema> = {
    page: referencesStore.page,
    perPage: referencesStore.perPage,
    sort: referencesStore.sort,
  };

  if (referencesStore.query.length > 0) {
    query.q = referencesStore.query;
  }

  if (referencesStore.filters.isEstonianReference) {
    query.isEstonianReference =
      referencesStore.filters.isEstonianReference.toString();
  }
  if (referencesStore.filters.isEstonianAuthor) {
    query.isEstonianAuthor =
      referencesStore.filters.isEstonianAuthor.toString();
  }
  if (referencesStore.filters.isEstonianAuthor) {
    query.pdf = referencesStore.filters.pdf.toString();
  }
  if (referencesStore.filters.title.length > 0) {
    query.title = referencesStore.filters.title;
  }
  if (referencesStore.filters.book.length > 0) {
    query.book = referencesStore.filters.book;
  }
  if (referencesStore.filters.journal.length > 0) {
    query.journal = referencesStore.filters.journal;
  }
  if (referencesStore.filters.publisher.length > 0) {
    query.publisher = referencesStore.filters.publisher;
  }
  if (referencesStore.filters.volumeOrNumber.length > 0) {
    query.volumeOrNumber = referencesStore.filters.volumeOrNumber;
  }
  if (referencesStore.filters.localities.length > 0) {
    query.localities = referencesStore.filters.localities;
  }
  if (referencesStore.filters.taxa.length > 0) {
    query.taxa = referencesStore.filters.taxa;
  }
  if (referencesStore.filters.type.size > 0) {
    query.type = Array.from(referencesStore.filters.type).join(",");
  }
  if (referencesStore.filters.language.size > 0) {
    query.language = Array.from(referencesStore.filters.type).join(",");
  }

  if (referencesStore.filters.keywords.size > 0) {
    query.keywords = Array.from(referencesStore.filters.keywords).join(",");
  }

  if (referencesStore.filters.year.some((val) => val !== null)) {
    const start = referencesStore.filters.year[0] ?? "*";
    const end = referencesStore.filters.year[1] ?? "*";

    query.year = `${start}-${end}`;
  }
  router.push({
    query: query as LocationQueryRaw,
  });
}

function handleFilterChange() {
  setQueryParamsFromState();
  refreshReferences();
}
function handleSubmit() {
  refreshReferences();
}
function handleReset() {
  referencesStore.resetFilters();
  setQueryParamsFromState();
  refreshReferences();
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
    authorAsc: "Autorid A-Z"
    authorDesc: "Autorid Z-A"
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
    authorAsc: "Authors A-Z"
    authorDesc: "Authors Z-A"
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
