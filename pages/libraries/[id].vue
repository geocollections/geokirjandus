<template>
  <div class="container" v-if="library">
    <div class="grid grid-cols-12 gap-x-2">
      <div
        class="hidden space-y-2 overflow-y-auto py-4 lg:sticky lg:top-[57px] lg:col-span-3 lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <SearchFormReference @update="handleSubmit" @reset="handleReset" />
        :default-solr-filters="[librarySolrFilter]" @update="handleSubmit"
        @reset="handleReset" />
      </div>

      <div class="col-span-8 space-y-2 px-4 py-8">
        <div id="general" class="scroll-mt-20">
          <div>{{ t("virtualLibrary") }}</div>
          <h1 class="text-4xl font-semibold">
            {{ $translate({ et: library.title, en: library.title_en }) }}
          </h1>
          <div class="text-2xl">{{ library.author_text }}</div>
        </div>
        <div
          v-if="$translate({ et: library.abstract, en: library.abstract_en })"
          id="abstract"
          class="scroll-mt-16"
        >
          <h2 class="mb-2 text-xl font-semibold">{{ t("abstract") }}</h2>
          <div
            v-html="
              $translate({ et: library.abstract, en: library.abstract_en })
            "
          ></div>
        </div>
        <div v-if="library.remarks" id="remarks" class="scroll-mt-16">
          <h2 class="mb-2 text-xl font-semibold">{{ t("remarks") }}</h2>
          <div v-html="library.remarks"></div>
        </div>
        <div id="references" class="scroll-mt-16">
          <h2 class="mb-2 text-xl font-semibold">{{ t("references") }}</h2>
          <ReferenceSummaryList
            :references="references"
            :count="referencesRes?.response.numFound ?? 0"
          />
        </div>
      </div>
      <div class="col-span-2">
        <div
          class="sticky space-y-2 overflow-y-auto lg:top-[57px] lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { z } from "zod";
definePageMeta({
  alias: "/library/:id",
});
const route = useRoute();
const router = useRouter();
const { t } = useI18n({ useScope: "local" });
const { data: library } = await useNewApiFetch(
  `/libraries/${route.params.id}/`,
  {},
);

if (!library.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
const referencesStore = useReferencesStore();

const librarySolrFilter = `libraries:${route.params.id}`;
const { data: referencesRes, refresh: refreshReferences } = await useSolrFetch(
  "/reference",
  {
    query: computed(() => ({
      q: referencesStore.solrQuery,
      rows: referencesStore.perPage,
      start: referencesStore.offset,
      sort: referencesStore.sort,
      json: {
        // filter: searchStore.solrFilter,
        filter: [librarySolrFilter, ...referencesStore.solrFilters],
      },
    })),
  },
);
const references = computed(() => referencesRes.value?.response.docs ?? []);

referencesStore.setStateFromQueryParams(route);

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
function handleSubmit() {
  refreshReferences();
}
function handleReset() {
  referencesStore.resetFilters();
  setQueryParamsFromState();
  refreshReferences();
}
</script>

<i18n lang="yaml">
et:
  abstract: "Abstrakt"
  general: "Üldine info"
  remarks: "Märkused"
  virtualLibrary: "Virtuaalne kirjanduse kogumik"
  references: "Kogumiku artiklid"
en:
  general: "General info"
  abstract: "Abstract"
  remarks: "Remarks"
  virtualLibrary: "Virtual reference collection"
  references: "Library references"
</i18n>
