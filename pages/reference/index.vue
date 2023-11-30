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
              :ui="{ wrapper: 'w-full', icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  v-show="searchStore.searchState.query !== ''"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click="searchStore.searchState.query = ''"
                />
              </template>
            </UInput>
            <UButton icon="i-heroicons-magnifying-glass" type="submit">
            </UButton>
          </UButtonGroup>
        </UForm>
        <UDivider />
        <div class="space-y-1">
          <div class="flex">
            <div class="text-xl font-medium">{{ t("filters") }}</div>
            <UButton
              class="ml-auto"
              icon="i-heroicons-trash"
              variant="ghost"
              @click="handleReset"
            >
              {{ t("reset") }}
            </UButton>
          </div>
          <UCheckbox
            v-model="searchStore.filterState.isEstonianReference"
            :label="t('isEstonianReference')"
          />
          <UCheckbox
            v-model="searchStore.filterState.isEstonianAuthor"
            :label="t('isEstonianAuthor')"
          />
          <UCheckbox v-model="searchStore.filterState.pdf" :label="t('pdf')" />
          <UFormGroup :label="t('title')">
            <UInput
              v-model="searchStore.filterState.title"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
            <UInput
              v-model="searchStore.filterState.year[0]"
              @blur="handleFilterChange"
              :placeholder="t('start')"
            />
            <UInput
              v-model="searchStore.filterState.year[1]"
              @blur="handleFilterChange"
              :placeholder="t('end')"
            />
          </UFormGroup>
          <UFormGroup :label="t('book')">
            <UInput
              v-model="searchStore.filterState.book"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('journal')">
            <UInput
              v-model="searchStore.filterState.journal"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('publisher')">
            <UInput
              v-model="searchStore.filterState.publisher"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('volumeOrNumber')">
            <UInput
              v-model="searchStore.filterState.volumeOrNumber"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('keywords')" :ui="{ container: 'space-y-1' }">
            <FilterKeywords
              v-model="searchStore.filterState.keywords"
              :q="searchStore.solrQuery"
              :filters="searchStore.solrFilter"
              @change="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('type')" :ui="{ container: 'space-y-1' }">
            <UCheckbox
              v-for="option in typeOptions"
              class="label-w-full"
              :ui="{ label: 'flex' }"
              :model-value="searchStore.filterState.type.has(option.value)"
              @click="handleOptionClick(option, searchStore.filterState.type)"
              :label="option.name"
            >
              <template #label>
                {{ option.name }}
                <UBadge size="xs" class="ml-auto block h-min">{{
                  option.count
                }}</UBadge>
              </template>
            </UCheckbox>
          </UFormGroup>
          <UFormGroup :label="t('language')" :ui="{ container: 'space-y-1' }">
            <UCheckbox
              v-for="option in languageOptions"
              class="label-w-full"
              :ui="{ label: 'flex' }"
              :model-value="searchStore.filterState.language.has(option.value)"
              @click="
                handleOptionClick(option, searchStore.filterState.language)
              "
              :label="option.name"
            >
              <template #label>
                {{ option.name }}
                <UBadge size="xs" class="ml-auto">{{ option.count }}</UBadge>
              </template>
            </UCheckbox>
          </UFormGroup>
          <UFormGroup :label="t('localities')">
            <UInput
              v-model="searchStore.filterState.localities"
              @blur="handleFilterChange"
            />
          </UFormGroup>
          <UFormGroup :label="t('taxa')">
            <UInput
              v-model="searchStore.filterState.taxa"
              @blur="handleFilterChange"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="col-span-9 lg:py-8">
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
            <USelectMenu
              class="w-40"
              v-model="searchStore.sort"
              :options="sortOptions"
              value-attribute="value"
              option-attribute="name"
              icon="i-heroicons-arrows-up-down"
              :ui="{ wrapper: 'mr-auto' }"
            >
              <template #label>
                {{ currentSort.name }}
              </template>
            </USelectMenu>
            <USelectMenu
              class="ml-auto"
              v-model="searchStore.perPage"
              :options="perPageOptions"
            />
            <UPagination
              v-model="searchStore.page"
              :page-count="searchStore.perPage"
              :total="referencesRes?.response.numFound ?? 0"
              show-first
              show-last
            />
          </div>
          <template v-for="(reference, index) in references">
            <UDivider v-if="index !== 0" />
            <ReferenceSummary
              :reference="reference"
              :position="index + (searchStore.page - 1) * searchStore.perPage"
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
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { z } from "zod";
import { useSearchStore } from "~/stores/referenceSearchStore";
const router = useRouter();
const route = useRoute();
const { t } = useI18n({ useScope: "local" });

const perPageOptions = [10, 25, 50, 100];
const sortOptions = computed(() => [
  { value: "score desc", name: t("sort.best") },
  { value: "date_added desc", name: t("sort.newest") },
  { value: "title asc", name: t("sort.titleAsc") },
  { value: "title desc", name: t("sort.titleDesc") },
]);

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
        facet: {
          type: {
            type: "terms",
            field: "type",
            limit: -1,
            domain: {
              excludeTags: "type",
            },
            facet: {
              name: {
                type: "terms",
                field: "reference_type",
                limit: 1,
                mincount: 0,
              },
              name_en: {
                type: "terms",
                field: "reference_type_en",
                limit: 1,
                mincount: 0,
              },
            },
          },
          language: {
            type: "terms",
            field: "language",
            domain: {
              excludeTags: "language",
            },
            limit: -1,
            facet: {
              name: {
                type: "terms",
                field: "reference_language",
                limit: 1,
              },
              name_en: {
                type: "terms",
                field: "reference_language_en",
                limit: 1,
              },
            },
          },
        },
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
  searchStore.searchState.activeQuery = searchStore.searchState.query;
  searchStore.page = 1;
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
  noResults: "Otsingu parameetritele vastavaid tulemusi ei leitud. Muuda päringut ja filtreid."
  reset: "Puhasta"
  start: "Algus"
  end: "Lõpp"
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
  noResults: "Search resulted in zero matching results. Change the search query and filters."
  reset: "Reset"
  start: "Start"
  end: "End"
</i18n>
