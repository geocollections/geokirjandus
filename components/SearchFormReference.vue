<template>
  <UForm :state="{ localQuery }" @submit="handleSubmit">
    <i18n-t
      v-if="numFound"
      keypath="found"
      tag="div"
      class="mb-2 text-xl"
      :plural="numFound ?? 0"
    >
      <template #count>
        <span class="font-bold">{{ numFound ?? 0 }}</span>
      </template>
    </i18n-t>
    <UButtonGroup size="lg" :ui="{ wrapper: { horizontal: 'w-full' } }">
      <UInput
        v-model="localQuery"
        autofocus
        :placeholder="t('searchAllFields')"
        :ui="{
          wrapper: 'w-full',
          icon: { trailing: { pointer: '' } },
          base: 'rounded-s-md',
        }"
      >
        <template #trailing>
          <UButton
            v-show="localQuery !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :aria-label="t('clear')"
            :padded="false"
            @click="handleQueryReset"
          />
        </template>
      </UInput>
      <UButton
        :aria-label="t('search')"
        icon="i-heroicons-magnifying-glass"
        type="submit"
      >
      </UButton>
    </UButtonGroup>
  </UForm>
  <UDivider />
  <div class="space-y-1">
    <div class="flex">
      <div class="text-xl font-medium">{{ t("filters") }}</div>
      <UButton
        v-if="activeFiltersCount > 0"
        class="ml-auto"
        icon="i-heroicons-trash"
        variant="ghost"
        :aria-label="t('clearFilters')"
        @click="handleReset"
      >
        {{ t("reset") }}
      </UButton>
    </div>
    <UCheckbox
      v-model="filters.isEstonianReference"
      :label="t('isEstonianReference')"
    />
    <UCheckbox
      v-model="filters.isEstonianAuthor"
      :label="t('isEstonianAuthor')"
    />
    <UCheckbox v-model="filters.pdf" :label="t('pdf')" />
    <UFormGroup :label="t('author')">
      <UInput v-model="filters.author" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
      <UInput
        :model-value="filters.year[0]"
        @input="filters.year[0] = parseNumber($event.target.value)"
        type="number"
        :placeholder="t('start')"
        @change="handleFilterChange"
      />
      <UInput
        :model-value="filters.year[1]"
        @input="filters.year[1] = parseNumber($event.target.value)"
        type="number"
        :placeholder="t('end')"
        @change="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('title')">
      <UInput v-model="filters.title" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('book')">
      <UInput v-model="filters.book" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('journal')">
      <UInput v-model="filters.journal" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('publisher')">
      <UInput v-model="filters.publisher" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('volumeOrNumber')">
      <UInput v-model="filters.volumeOrNumber" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('keywords')" :ui="{ container: 'space-y-1' }">
      <FilterKeywords
        ref="filterKeywords"
        v-model="filters.keywords"
        :q="solrQuery"
        :filters="[...solrFilters, ...referencesStore.routeSolrFilters]"
        @update:model-value="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('type')" :ui="{ container: 'space-y-1' }">
      <UCheckbox
        v-for="option in typeOptions"
        :key="`type-${option.value}`"
        :ui="{ label: 'flex', inner: 'w-full' }"
        :model-value="filters.type.has(option.value)"
        @click="handleOptionClick(option, filters.type)"
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
        :key="`language-${option.value}`"
        :ui="{ label: 'flex', inner: 'w-full' }"
        :model-value="filters.language.has(option.value)"
        @click="handleOptionClick(option, filters.language)"
        :label="option.name"
      >
        <template #label>
          {{ option.name }}
          <UBadge size="xs" class="ml-auto">{{ option.count }}</UBadge>
        </template>
      </UCheckbox>
    </UFormGroup>
    <UFormGroup :label="t('localities')">
      <UInput v-model="filters.localities" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('taxa')">
      <UInput v-model="filters.taxa" @change="handleFilterChange" />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
import FilterKeywords from "~/components/FilterKeywords.vue";
defineProps<{ numFound?: number }>();
const emit = defineEmits<{ update: []; reset: [] }>();

const { t } = useI18n({ useScope: "local" });
const filterKeywords = ref<InstanceType<typeof FilterKeywords>>();
const route = useRoute();
const referencesStore = useReferencesStore();
const {
  solrQuery,
  solrFilters,
  routeSolrFilters,
  filters,
  query,
  activeFiltersCount,
} = storeToRefs(referencesStore);
referencesStore.setStateFromQueryParams(route);

const localQuery = ref("");
localQuery.value = query.value;

const combinedSolrFilters = computed(() => {
  return [...solrFilters.value, ...routeSolrFilters.value];
});

const { data: referencesRes, refresh: refreshOptions } = await useSolrFetch<
  SolrFacets<{
    type: { name: {}; name_en: {} };
    language: { name: {}; name_en: {} };
  }>
>("/reference", {
  watch: false,
  query: computed(() => {
    return {
      q: solrQuery.value,
      rows: 0,
      json: {
        filter: combinedSolrFilters.value,
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
    };
  }),
});
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
      name: bucket.name.buckets[0]?.val,
      name_en: bucket.name_en.buckets[0].val,
      count: bucket.count,
    };
  });
});

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

function handleFilterChange() {
  refreshOptions();
  filterKeywords.value?.refreshOptions();
  emit("update");
}
function handleSubmit() {
  refreshOptions();
  filterKeywords.value?.refreshOptions();
  query.value = localQuery.value;
  emit("update");
}
function handleReset() {
  refreshOptions();
  filterKeywords.value?.refreshOptions();
  emit("reset");
}

function handleOptionClick(option: any, valueSet: Set<string>) {
  if (valueSet.has(option.value)) {
    valueSet.delete(option.value);
  } else {
    valueSet.add(option.value);
  }
  handleFilterChange();
}

function handleQueryReset() {
  query.value = "";
  localQuery.value = "";
  emit("update");
}
</script>

<i18n lang="yaml">
et:
  search: "Otsi"
  filters: "Filtrid"
  isEstonianReference: "Eesti kirjandus"
  isEstonianAuthor: "Eesti author"
  author: "Autor(id)"
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
  reset: "Puhasta"
  start: "Algus"
  end: "Lõpp"
  found: "Tulemused puuduvad | {count} tulemus leitud | {count} tulemust leitud"
  clear: "Puhasta otsinguväli"
  clearFilter: "Puhasta filtrid"
en:
  search: "Search"
  filters: "Filters"
  isEstonianReference: "Estonian reference"
  isEstonianAuthor: "Estonian author"
  author: "Author(s)"
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
  reset: "Clear"
  start: "Start"
  end: "End"
  found: "No results found | Found {count} result | Found {count} results"
  clear: "Clear search input"
  clearFilter: "Clear filters"
</i18n>
