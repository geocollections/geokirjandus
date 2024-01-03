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
    <div class="space-y-1 overflow-x-hidden">
      <template v-for="(reference, idx) in references">
        <UDivider v-if="idx !== 0" />
        <div class="space-y-1">
          <UButton
            color="white"
            variant="ghost"
            class="block"
            :ui="{ color: { white: { ghost: 'dark:hover:bg-gray-800' } } }"
            :to="localePath(`/reference/${reference.id}`)"
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
              :book-pdf="bookPdf(reference)"
              size="2xs"
            />
          </div>
        </div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { ReferenceDoc } from "~/pages/reference/index.vue";

const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const localePath = useLocalePath();
const perPage = 10;
const page = ref(
  !referencesStore.fromSearch
    ? 1
    : Math.floor(referencesStore.searchPosition / perPage) + 1,
);
const { data: referencesRes } = await useSolrFetch<SolrResponse<ReferenceDoc>>(
  "/reference",
  {
    query: computed(() => ({
      q: referencesStore.solrQuery,
      rows: perPage,
      start: (page.value - 1) * perPage,
      sort: referencesStore.sortQuery,
      json: {
        filter: [
          ...referencesStore.solrFilters,
          ...referencesStore.enteredFromRouteSolrFilters,
        ],
      },
    })),
  },
);
const references = computed(() => referencesRes.value?.response.docs ?? []);
const hasNext = computed(
  () =>
    (page.value - 1) * perPage < (referencesRes.value?.response.numFound ?? 0),
);
const searchQueryParams = referencesStore.getQueryParams();
function pdf(reference: ReferenceDoc) {
  return reference.attachment__filename ?? reference.filename ?? undefined;
}

function bookPdf(reference: ReferenceDoc) {
  return reference.parent_reference__attachment__filename ?? undefined;
}

function url(reference: ReferenceDoc) {
  return reference.url ?? reference.parent_reference__url ?? undefined;
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
