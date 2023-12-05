<template>
  <div class="container" v-if="library">
    <div class="grid grid-cols-12 gap-x-2">
      <div
        class="col-span-2 overflow-y-auto lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      ></div>

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
          <div v-if="referencesRes?.response.numFound" class="space-y-2">
            <div class="flex items-center space-x-2">
              <USelectMenu
                class="ml-auto"
                v-model="perPage"
                :options="perPageOptions"
              />
              <UPagination
                v-model="page"
                :page-count="perPage"
                :total="referencesRes?.response.numFound ?? 0"
                show-first
                show-last
              />
            </div>
            <template v-for="(reference, index) in references">
              <UDivider v-if="index !== 0" />
              <ReferenceSummary
                :reference="reference"
                :position="index + (page - 1) * perPage"
              />
            </template>

            <UPagination
              v-model="page"
              :ui="{ base: 'ml-auto' }"
              :page-count="perPage"
              :total="referencesRes?.response.numFound ?? 0"
              show-first
              show-last
            />
          </div>
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
definePageMeta({
  alias: "/library/:id",
});
const route = useRoute();
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
const perPageOptions = [10, 25, 50, 100];
const page = ref(1);
const perPage = ref(10);
const { data: referencesRes, execute } = await useSolrFetch("/reference", {
  query: computed(() => ({
    q: "*",
    rows: perPage.value,
    start: (page.value - 1) * perPage.value,
    // sort: searchStore.sort,
    json: {
      // filter: searchStore.solrFilter,
      filter: [`libraries:${route.params.id}`],
    },
  })),
});
const references = computed(() => referencesRes.value?.response.docs ?? []);
</script>

<i18n lang="yaml">
et:
  abstract: "Abstrakt"
  general: "Üldine info"
  remarks: "Märkused"
  virtualLibrary: "Virtuaalne kirnaudse kogumik"
  references: "Kogumiku artiklid"
en:
  general: "General info"
  abstract: "Abstract"
  remarks: "Remarks"
  virtualLibrary: "Virtual reference collection"
  references: "Library references"
</i18n>
