<template>
  <div
    class="-mt-[57px] bg-[url('/layered-steps-haikei-light.svg')] dark:bg-[url('/layered-steps-haikei-dark.svg')]"
  >
    <div class="container px-2 pt-[calc(57px+2em)]">
      <div class="mx-auto space-y-4 lg:w-fit">
        <div class="pb-6">
          <h1 class="pb-2 text-center text-6xl" style="word-break: normal">
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
        <div class="flex flex-col space-y-1 text-center lg:block lg:space-x-1">
          <UButton
            :to="
              localePath({
                path: '/reference',
                query: { isEstonianReference: true },
              })
            "
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
            <UIcon name="i-heroicons-arrow-right" class="ml-auto h-6 w-6" />
          </UButton>
          <UButton
            :to="
              localePath({
                path: '/reference',
                query: { isEstonianReference: false },
              })
            "
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
            <UIcon name="i-heroicons-arrow-right" class="ml-auto h-6 w-6" />
          </UButton>
          <UButton :to="localePath({ path: '/library' })" size="xl">
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
            <UIcon name="i-heroicons-arrow-right" class="ml-auto h-6 w-6" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
  <div class="container px-2 pb-4 pt-10">
    <div class="grid grid-cols-2 gap-x-4">
      <div class="order-2 col-span-full space-y-4 lg:order-none lg:col-span-1">
        <div class="w-full p-4 lg:h-96">
          <Statistics />
        </div>
        <div class="rounded border p-4 dark:border-gray-800">
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

      <div class="order-1 col-span-full lg:order-none lg:col-span-1">
        <div class="rounded border p-4 dark:border-gray-800">
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
</template>

<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n({ useScope: "local" });
useHead({
  title: null,
});
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
  enterKeyword: "Sisesta otsingu termin"
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
  enterKeyword: "Enter a search term"
  browse: "or browse"
  estonianReferences: "Estonian references"
  allReferences: "All references"
  libraries: "Libraries"
  about: "About"
  latest: "Latest publications"
</i18n>
