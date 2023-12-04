<template>
  <UForm :state="store.searchState" @submit="handleSubmit">
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
        v-model="store.searchState.query"
        :placeholder="t('searchAllFields')"
        :ui="{ wrapper: 'w-full', icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="store.searchState.query !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="store.searchState.query = ''"
          />
        </template>
      </UInput>
      <UButton icon="i-heroicons-magnifying-glass" type="submit"> </UButton>
    </UButtonGroup>
  </UForm>
  <UDivider />
  <div class="space-y-1">
    <div class="flex">
      <div class="text-xl font-medium">{{ t("filters") }}</div>
      <UButton
        v-if="store.activeFiltersCount"
        class="ml-auto"
        icon="i-heroicons-trash"
        variant="ghost"
        @click="handleReset"
      >
        {{ t("reset") }}
      </UButton>
    </div>
    <UCheckbox
      v-model="store.filterState.isEstonianReference"
      :label="t('isEstonianReference')"
    />
    <UCheckbox
      v-model="store.filterState.isEstonianAuthor"
      :label="t('isEstonianAuthor')"
    />
    <UCheckbox v-model="store.filterState.pdf" :label="t('pdf')" />
    <UFormGroup :label="t('title')">
      <UInput v-model="store.filterState.title" @blur="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
      <UInput
        v-model="store.filterState.year[0]"
        @blur="handleFilterChange"
        :placeholder="t('start')"
      />
      <UInput
        v-model="store.filterState.year[1]"
        @blur="handleFilterChange"
        :placeholder="t('end')"
      />
    </UFormGroup>
    <UFormGroup :label="t('book')">
      <UInput v-model="store.filterState.book" @blur="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('journal')">
      <UInput v-model="store.filterState.journal" @blur="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('publisher')">
      <UInput
        v-model="store.filterState.publisher"
        @blur="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('volumeOrNumber')">
      <UInput
        v-model="store.filterState.volumeOrNumber"
        @blur="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('keywords')" :ui="{ container: 'space-y-1' }">
      <FilterKeywords
        v-model="store.filterState.keywords"
        :q="store.solrQuery"
        :filters="store.solrFilter"
        @change="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('type')" :ui="{ container: 'space-y-1' }">
      <UCheckbox
        v-for="option in typeOptions"
        class="label-w-full"
        :ui="{ label: 'flex' }"
        :model-value="store.filterState.type.has(option.value)"
        @click="handleOptionClick(option, store.filterState.type)"
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
        :model-value="store.filterState.language.has(option.value)"
        @click="handleOptionClick(option, store.filterState.language)"
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
        v-model="store.filterState.localities"
        @blur="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('taxa')">
      <UInput v-model="store.filterState.taxa" @blur="handleFilterChange" />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ store: any; numFound?: number }>();
const emit = defineEmits<{ update: []; reset: [] }>();

const { t } = useI18n({ useScope: "local" });

const { data: referencesRes, refresh: refreshOptions } =
  await useSolrFetch<SolrResponse>("/reference", {
    query: computed(() => ({
      q: props.store.solrQuery,
      rows: 0,
      json: {
        filter: props.store.solrFilter,
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
      name: bucket.name.buckets[0].val,
      name_en: bucket.name_en.buckets[0].val,
      count: bucket.count,
    };
  });
});

function handleFilterChange() {
  refreshOptions();
  emit("update");
}
function handleSubmit() {
  refreshOptions();
  emit("update");
}
function handleReset() {
  refreshOptions();
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
  pdf: "PDF saadaval"
  reset: "Puhasta"
  start: "Algus"
  end: "Lõpp"
  found: "Tulemused puuduvad | {count} tulemus leitud | {count} tulemust leitud"
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
</i18n>
