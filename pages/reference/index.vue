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
          <UCheckbox
            v-model="searchStore.filterState.isEstonianReference"
            :label="t('isEstonianReference')"
            @input="handleFilterChange"
          />
          <UCheckbox
            v-model="searchStore.filterState.isEstonianAuthor"
            :label="t('isEstonianAuthor')"
            @input="handleFilterChange"
          />
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
              placeholder="Start"
            />
            <UInput
              v-model="searchStore.filterState.year[1]"
              @blur="handleFilterChange"
              placeholder="End"
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
        <div class="space-y-2">
          <div class="flex items-center">
            <div class="text-xl">
              <span class="font-bold">{{
                referencesRes?.response.numFound ?? 0
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
              :total="referencesRes?.response.numFound ?? 0"
              show-first
              show-last
            />
          </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { z } from "zod";
import { useSearchStore } from "~/stores/searchStore";
const router = useRouter();
const route = useRoute();
const { t } = useI18n({ useScope: "local" });

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
const { data: referencesRes, execute } = await useSolrFetch<SolrResponse>(
  "/reference",
  {
    query: computed(() => ({
      q: searchStore.solrQuery,
      rows: searchStore.perPage,
      start: (searchStore.page - 1) * searchStore.perPage,
      sort: searchStore.sort.value,
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

function setQueryParamsFromState() {
  const query: z.input<typeof ParamsSchema> = {
    page: searchStore.page,
    perPage: searchStore.perPage,
    sort: searchStore.sort.value,
    q: searchStore.searchState.activeQuery,
  };
  if (searchStore.filterState.isEstonianReference) {
    query.isEstonianReference =
      searchStore.filterState.isEstonianReference.toString();
  }
  if (searchStore.filterState.isEstonianAuthor) {
    query.isEstonianAuthor =
      searchStore.filterState.isEstonianAuthor.toString();
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

// function setStateFromQueryParams() {
//   const params = ParamsSchema.parse({
//     searchStore.sort: route.query.searchStore.sort,
//     searchStore.page: route.query.searchStore.page,
//     searchStore.perPage: route.query.searchStore.perPage,
//     q: route.query.q,
//     isEstonianReference: route.query.isEstonianReference,
//     isEstonianAuthor: route.query.isEstonianAuthor,
//     title: route.query.title,
//     book: route.query.book,
//     journal: route.query.journal,
//     year: route.query.year,
//     publisher: route.query.publisher,
//     type: route.query.type,
//     language: route.query.language,
//     keywords: route.query.keywords,
//     volumeOrNumber: route.query.volumeOrNumber,
//     localities: route.query.localites,
//     taxa: route.query.taxa,
//   });
//
//   searchStore.page= params.searchStore.page;
//   searchStore.perPage= params.searchStore.perPage;
//   searchStore.sort=
//     searchStore.sortOptions.find((option) => option.value === params.searchStore.sort) ??
//     searchStore.sortOptions[0];
//   searchStore.searchState.query = params.q;
//   searchStore.searchState.activeQuery = params.q;
//   searchStore.filterState.isEstonianReference = params.isEstonianReference;
//   searchStore.filterState.isEstonianAuthor = params.isEstonianAuthor;
//   searchStore.filterState.year = params.year;
//   searchStore.filterState.title = params.title;
//   searchStore.filterState.book = params.book;
//   searchStore.filterState.journal = params.journal;
//   searchStore.filterState.publisher = params.publisher;
//   searchStore.filterState.volumeOrNumber = params.volumeOrNumber;
//   searchStore.filterState.type = params.type;
//   searchStore.filterState.language = params.language;
//   searchStore.filterState.keywords = params.keywords;
//   searchStore.filterState.localities = params.localities;
//   searchStore.filterState.taxa = params.taxa;
// }
function handleFilterChange() {
  setQueryParamsFromState();
  execute();
}
function handleSubmit() {
  searchStore.searchState.activeQuery = searchStore.searchState.query;
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
en:
  search: "Search"
  filters: "Filters"
  isEstonianReference: "Estonian reference"
  isEstonianAuthor: "Estonian author"
  title: "Title"
  year: "Year"
  book: "Book"
  journal: "Journal"
  publisher: "Publisher"
  volumeOrNumber: "Volume/Number"
  keywords: "Keywords"
  type: "type"
  language: "Language"
  searchAllFields: "Search all fields"
  localities: "Localities"
  taxa: "Taxa"
</i18n>
