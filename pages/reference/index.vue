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
import { z } from "zod";
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
  type?: number;
  reference_type?: string;
  reference_type_en?: string;
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
  if (referencesStore.filters.author.length > 0) {
    query.author = referencesStore.filters.author;
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

  if (referencesStore.filters.year.some((val) => val !== undefined)) {
    const start = referencesStore.filters.year[0] ?? "*";
    const end = referencesStore.filters.year[1] ?? "*";

    query.year = `${start}-${end}`;
  }
  router.push({
    query: query as LocationQueryRaw,
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
