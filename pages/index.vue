<template>
  <div class="-mt-[57px]">
    <div class="container pt-[calc(57px+2em)]">
      <div class="mx-auto w-fit space-y-4">
        <div class="pb-6">
          <h1 class="text-center text-6xl" style="word-break: normal">
            {{ t("title") }}
          </h1>

          <div class="text-center text-4xl" style="word-break: normal">
            {{ t("subtitle") }}
          </div>
        </div>
        <UForm
          class="flex justify-center"
          :state="state"
          @submit="handleSearch"
        >
          <UInput
            v-model="state.searchStr"
            class="w-full"
            size="xl"
            :placeholder="t('enterKeyword')"
          >
          </UInput>
          <UButton class="ml-2 pr-4" icon="i-heroicons-magnifying-glass">
            <div class="font-family-exo-2">
              {{ t("search") }}
            </div>
          </UButton>
        </UForm>
        <UDivider :label="t('browse')" icon="i-heroicons-arrow-left" />
        <div class="space-x-1 text-center">
          <UButton
            :to="
              localePath({
                path: '/reference',
                query: { isEstonianReference: true },
              })
            "
            trailing-icon="i-heroicons-arrow-right"
            size="xl"
          >
            <div class="text-start">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-book-open"></UIcon>
                <span
                  >+
                  {{
                    roundToRank(referencesRes.facets.estonianReferences.count)
                  }}
                </span>
              </div>
              <div>{{ t("estonianReferences") }}</div>
            </div>
          </UButton>
          <UButton
            :to="
              localePath({
                path: '/reference',
                query: { isEstonianReference: false },
              })
            "
            trailing-icon="i-heroicons-arrow-right"
            size="xl"
          >
            <div class="text-start">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-book-open"></UIcon>
                <span
                  >+
                  {{ roundToRank(referencesRes.facets.allReferences.count) }}
                </span>
              </div>
              <div>{{ t("allReferences") }}</div>
            </div>
          </UButton>
          <UButton
            :to="localePath({ path: '/library' })"
            trailing-icon="i-heroicons-arrow-right"
            size="xl"
          >
            <div class="text-start">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-building-library"></UIcon>
                <span
                  >+
                  {{ roundToRank(libraryRes.facets.allLibraries.count, 1e1) }}
                </span>
              </div>
              <div>{{ t("libraries") }}</div>
            </div>
          </UButton>
        </div>
      </div>
    </div>
  </div>
  <div class="mb-4 bg-[url('/layered-steps-haikei4.svg')] bg-cover">
    <div class="container pt-10">
      <div class="grid grid-cols-2 gap-x-4">
        <div class="col-span-1 space-y-4">
          <div class="h-96 w-full p-4">
            <Statistics />
          </div>
          <div class="rounded border bg-stone-50 p-4 dark:bg-gray-800">
            <div class="mb-3 text-2xl">
              {{ t("about") }}
            </div>
            <div
              v-html="
                $translate({
                  et: intro.content_et,
                  en: intro.content_en,
                })
              "
            ></div>
          </div>
        </div>

        <div class="col-span-1">
          <div class="rounded border bg-stone-50 p-4 dark:bg-gray-800">
            <div class="mb-3 text-2xl">
              {{ t("latest") }}
            </div>

            <template v-for="(reference, index) in references">
              <UDivider v-if="index !== 0" />
              <ReferenceItem :reference="reference" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n({ useScope: "local" });
const img = useImage();
const state = reactive({
  searchStr: "",
  references: [] as any[],
  intro: null,
  statisticsData: null,
});

const { data: referencesRes } = await useSolrFetch("/reference", {
  query: {
    q: "*",
    rows: 10,
    sort: "date_added desc",
    json: {
      facet: {
        allReferences: {
          type: "query",
          q: "*",
        },
        estonianReferences: {
          type: "query",
          q: "is_estonian_reference:true",
        },
      },
    },
  },
});
const { data: libraryRes } = await useSolrFetch("/library", {
  query: {
    q: "*",
    rows: 0,
    json: {
      facet: {
        allLibraries: {
          type: "query",
          q: "*",
        },
      },
    },
  },
});
const references = computed(() => referencesRes.value?.response.docs ?? []);

const { data: intro } = await useNewApiFetch("/web-pages/75/");

function handleSearch() {
  router.push(
    localePath({ path: "/reference", query: { q: state.searchStr } }),
  );
}

function roundToRank(n: number, rank: number = 1e3) {
  return Math.floor(n / rank) * rank;
}
</script>

<i18n lang="yaml">
et:
  title: "Geokirjandus"
  subtitle: "Eesti maapõue teavikute register"
  search: "Otsi"
  enterKeyword: "Sisesta märksõna"
  browse: "või sirvi"
  estonianReferences: "Eesti kirjandus"
  allReferences: "Kõik kirjandus"
  libraries: "Kogumikud"
  about: "Tutvustus"
  latest: "Viimased väljaanded"
en:
  title: "Geoliterature"
  subtitle: "Estonian geoscience literature database"
  search: "Search"
  enterKeyword: "Enter keyword"
  browse: "or browse"
  estonianReferences: "Estonian references"
  allReferences: "All references"
  libraries: "Libraries"
  about: "About"
  latest: "Latest publications"
</i18n>
