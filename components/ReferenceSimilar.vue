<template>
  <UButton
    variant="link"
    icon="i-heroicons-arrow-small-left"
    :to="
      localePath({
        path: referencesStore.enteredFrom,
        query: searchQueryParams,
      })
    "
  >
    {{ t("back") }}
  </UButton>
  <template v-if="referencesStore.fromSearch">
    <div class="text-center font-bold">{{ t("results") }}</div>
    <div class="flex items-center justify-around">
      <UButton
        variant="link"
        icon="i-heroicons-chevron-double-left"
        :disabled="page <= 1"
        @click="page--"
      />
      <span>{{ page }}</span>
      <UButton
        variant="link"
        icon="i-heroicons-chevron-double-right"
        :disabled="!hasNext"
        @click="page++"
      />
    </div>
    <div class="space-y-1">
      <template v-for="(reference, idx) in references">
        <UDivider v-if="idx !== 0" />
        <div class="space-y-1">
          <UButton
            color="white"
            variant="ghost"
            class="block"
            :to="localePath(`/references/${reference.id}`)"
            exact
            active-class="bg-carrot-orange-500/10 border border-carrot-orange-500"
            @click="handleDetailNavigation(idx)"
          >
            <div class="font-semibold">{{ reference.reference }}</div>
            <div class="text-gray-600 dark:text-gray-400">
              {{ reference.title }}
            </div>
          </UButton>
          <div class="space-x-1">
            <ReferenceLinks
              :doi="reference.doi_url"
              :pdf="pdf(reference)"
              :url="url(reference)"
            />
          </div>
        </div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const localePath = useLocalePath();
const perPage = 10;
const page = ref(
  !referencesStore.fromSearch
    ? 1
    : Math.floor(referencesStore.searchPosition / perPage) + 1,
);
const { data: referencesRes, execute } = await useSolrFetch<SolrResponse>(
  "/reference",
  {
    query: computed(() => ({
      q: referencesStore.solrQuery,
      rows: perPage,
      start: (page.value - 1) * perPage,
      sort: referencesStore.sort,
      json: {
        filter: referencesStore.solrFilters,
      },
    })),
  },
);
const references = computed(() => referencesRes.value?.response.docs ?? []);
const hasNext = computed(
  () => (page.value - 1) * perPage < referencesRes.value?.response.numFound,
);
const searchQueryParams = buildReferenceSearchQueryParams({
  query: referencesStore.query,
  page: referencesStore.page,
  perPage: referencesStore.perPage,
  sort: referencesStore.sort,
  filters: referencesStore.filters,
});
function pdf(reference) {
  return (
    reference.attachment__filename ??
    reference.parent_reference__attachment__filename ??
    reference.filename ??
    null
  );
}
function url(reference) {
  return reference.url ?? reference.parent_reference__url ?? null;
}

function handleDetailNavigation(index: number) {
  const position = index + (page.value - 1) * perPage;
  if (position < 0) return;
  referencesStore.searchPosition = position;
}
</script>

<i18n lang="yaml">
et:
  back: "Tagasi otsingusse"
  results: "Otsingu tulemused"
en:
  back: "Back to search"
  results: "Search results"
</i18n>
