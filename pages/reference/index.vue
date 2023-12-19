<template>
  <Search :filterCount="referencesStore.activeFiltersCount">
    <template #filters>
      <SearchFormReference @update="handleSubmit" @reset="handleReset" />
    </template>
    <h1 class="mb-2 text-4xl font-semibold">{{ t("title") }}</h1>
    <ReferenceList
      :references="references"
      :count="referencesRes?.response.numFound ?? 0"
      @update="handleSubmit"
    />
    <template #mobile-filters>
      <SearchFormReference
        :num-found="referencesRes?.response.numFound"
        @update="handleSubmit"
        @reset="handleReset"
      />
    </template>
  </Search>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";

const { t } = useI18n({ useScope: "local" });

useHead({
  title: t("title"),
});

const router = useRouter();
const route = useRoute();
const referencesStore = useReferencesStore();
referencesStore.setStateFromQueryParams(route);

export type ReferenceDoc = {
  id: string;
  reference: string;
  title?: string;
  author?: string;
  journal_name?: string;
  book?: string;
  abstract?: string;
  doi_url?: string;
  attachment__filename?: string;
  parent_reference__attachment__filename?: string;
  filename?: string;
  url?: string;
  parent_reference__url?: string;
  year_numeric?: number;
  volume?: string;
  pages?: string;
  type: number;
  reference_type: string;
  reference_type_en: string;
};

const { data: referencesRes, refresh: refreshReferences } = await useSolrFetch<
  SolrResponse<ReferenceDoc>
>("/reference", {
  query: computed(() => ({
    q: referencesStore.solrQuery,
    fl: [
      "id",
      "reference",
      "title",
      "author",
      "journal_name",
      "book",
      "abstract",
      "doi_url",
      "attachment__filename",
      "parent_reference__attachment__filename",
      "filename",
      "url",
      "parent_reference__url",
      "year_numeric",
      "volume",
      "pages",
      "type",
      "reference_type",
      "reference_type_en",
    ] as (keyof ReferenceDoc)[],
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

function setQueryParamsFromState() {
  router.push({
    query: referencesStore.getQueryParams() as LocationQueryRaw,
  });
}

function handleSubmit() {
  setQueryParamsFromState();
  refreshReferences();
}
function handleReset() {
  referencesStore.resetFilters();
  setQueryParamsFromState();
  refreshReferences();
}
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>

<i18n lang="yaml">
et:
  title: "Teavikud"
en:
  title: "References"
</i18n>
