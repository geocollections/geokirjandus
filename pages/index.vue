<template>
  <div class="background -mt-[57px] bg-cover pb-8">
    <div class="container px-2 pt-[calc(57px+2em)]">
      <div class="mx-auto space-y-4 lg:w-fit">
        <div class="b-6">
          <div class="typewriter mx-auto w-fit">
            <i18n-t
              keypath="titleNew"
              scope="global"
              tag="h1"
              class="font-serif cursor-default pb-1 text-4xl font-semibold text-carrot-orange-500 md:text-7xl lg:pb-3 dark:text-carrot-orange-400"
              style="word-break: normal"
            >
              <template #literature>
                <span class="font-normal text-black dark:text-white">{{
                  $t("literature")
                }}</span>
              </template>
            </i18n-t>
          </div>

          <div
            class="cursor-default text-center text-2xl font-normal md:text-4xl"
            style="word-break: normal"
          >
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
          <UButton
            type="submit"
            class="ml-2 pr-4"
            icon="i-heroicons-magnifying-glass"
          >
            <div class="font-family-exo-2">
              {{ t("search") }}
            </div>
          </UButton>
        </UForm>
        <UDivider
          :label="t('browse')"
          :ui="{ border: { base: 'border-stone-400' } }"
          icon="i-heroicons-arrow-left"
        />
        <div class="flex flex-col space-y-1 text-center lg:block lg:space-x-1">
          <UButton
            :to="
              localePath({
                path: '/reference',
                query: { isEstonianReference: 'true' },
              })
            "
            size="xl"
          >
            <div class="text-start">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-book-open"></UIcon>
                <span>
                  {{
                    roundToRank(
                      referencesRes?.facets.estonianReferences.count ?? 26000,
                    )
                  }}+
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
              })
            "
            size="xl"
          >
            <div class="text-start">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-book-open"></UIcon>
                <span>
                  {{
                    roundToRank(
                      referencesRes?.facets.allReferences.count ?? 43000,
                    )
                  }}+
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
                <span>
                  {{
                    roundToRank(
                      libraryRes?.facets.allLibraries.count ?? 80,
                      1e1,
                    )
                  }}+
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
        <div class="hidden w-full p-4 lg:block lg:h-96">
          <Statistics />
        </div>
        <div class="rounded border p-4 dark:border-gray-800">
          <div class="mb-3 text-2xl">
            {{ t("about") }}
          </div>
          <div
            v-html="
              $translate({
                et: intro?.content_et ?? '',
                en: intro?.content_en ?? '',
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
import type { ReferenceDoc } from "./reference/index.vue";

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

const { data: referencesRes } = await useSolrFetch<
  SolrResponse<ReferenceDoc> & {
    facets: {
      allReferences: { count: number };
      estonianReferences: { count: number };
    };
  }
>("/reference", {
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
const { data: libraryRes } = await useSolrFetch<{
  facets: { allLibraries: { count: number } };
}>("/library", {
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

const { data: intro } = await useNewApiFetch<{
  content_et: string;
  content_en: string;
}>("/web-pages/75/");

function handleSearch() {
  router.push(
    localePath({ path: "/reference", query: { q: state.searchStr } }),
  );
}

function roundToRank(n: number, rank: number = 1e3) {
  return Math.floor(n / rank) * rank;
}
</script>

<style lang="scss">
.background {
  background-image: url("/layered-steps-haikei-light.svg"),
    linear-gradient(
      to right,
      rgba(250, 250, 249, 0.9),
      rgba(250, 250, 249, 0.7)
    ),
    url("/background.webp");
  background-size: contain, cover, cover;
  background-position: bottom, bottom, 50%;
  background-repeat: repeat-x, repeat, no-repeat;
}

.dark .background {
  background-image: url("/layered-steps-haikei-dark.svg"),
    linear-gradient(to right, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.7)),
    url("/background.webp");
  background-size: contain, cover, cover;
  background-position: bottom, bottom, 50%;
  background-repeat: repeat-x, repeat, no-repeat;
  background-attachment: scroll, fixed, fixed;
}
.typewriter h1 {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 0.25rem solid; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.005em;
  animation:
    typing 0.8s steps(24) 0.1s 1 normal both,
    blink-caret 1.5s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: orange;
  }
}
</style>

<i18n lang="yaml">
et:
  title: "Geokirjandus"
  subtitle: "Eesti maapõue teavikute register"
  search: "Otsi"
  enterKeyword: "Sisesta otsingu termin"
  browse: "või sirvi"
  estonianReferences: "Eesti kirjandus"
  allReferences: "Kogu kirjandus"
  libraries: "Kogumikud"
  about: "Tutvustus"
  latest: "Viimati listud teavikud"
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
  latest: "Recently added references"
</i18n>
