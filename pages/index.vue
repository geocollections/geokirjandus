<template>
  <div class="background -mt-[57px]">
    <div class="container mx-auto px-2 pt-[calc(57px+2em)] xl:max-w-screen-xl">
      <div class="space-y-4 lg:w-fit">
        <div>
          <SiteLogo class="pb-1 text-4xl md:text-7xl lg:pb-3" />
          <div
            class="text-2xl font-normal text-gray-700 md:text-4xl dark:text-gray-300"
            style="word-break: normal"
          >
            {{ $t("subtitle") }}
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-2 pb-4 lg:pt-10 xl:max-w-screen-xl">
      <div class="grid grid-cols-2 gap-8">
        <div class="col-span-full space-y-4 lg:order-none lg:col-span-1">
          <UForm
            class="mt-12 flex justify-center"
            :state="state"
            @submit="handleSearch"
          >
            <UInput
              v-model="state.searchStr"
              class="w-full"
              autofocus
              id="search"
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
            :ui="{ border: { base: 'border-stone-400 dark:border-stone-400' } }"
            icon="i-heroicons-arrow-left"
          />
          <div
            class="flex flex-col space-y-1 text-center lg:block lg:space-x-1"
          >
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
          <div class="hidden w-full lg:block lg:h-96">
            <Statistics />
          </div>
        </div>

        <div class="col-span-full lg:order-none lg:col-span-1">
          <div class="rounded dark:border-gray-800">
            <div class="mb-3 text-2xl font-medium">
              {{ t("latest") }}
            </div>

            <div class="space-y-1">
              <template v-for="(reference, index) in references">
                <!-- <UDivider v-if="index !== 0" /> -->
                <ReferenceItem
                  class="rounded border bg-stone-50 p-2 dark:border-gray-800 dark:bg-gray-900"
                  :reference="reference"
                />
              </template>
            </div>
          </div>
        </div>

        <div class="col-span-full mb-8">
          <AboutSection />
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
    rows: 5,
    sort: "date_added desc",
    fq: ["is_estonian_reference:true"],
    json: {
      facet: {
        allReferences: {
          type: "query",
          q: "*",
          domain: {
            query: "*"
          }
        },
        estonianReferences: {
          type: "query",
          q: "is_estonian_reference:true",
          domain: {
            query: "*"
          }
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
  background-image: 
    // url("/layered-steps-haikei-light.svg"),
    // linear-gradient(
    //   to right,
    //   rgba(250, 250, 249, 0.9),
    //   rgba(250, 250, 249, 0.7)
    // ),
    linear-gradient(
      to bottom,
      rgba(250, 250, 249, 0.85),
      rgba(250, 250, 249, 1)
    ),
    url("/background.webp");
  background-size: cover, cover;
  background-position: bottom, top;
  background-repeat: repeat, no-repeat;
}

.dark .background {
  background-image: linear-gradient(
      to bottom,
      rgba(17, 24, 39, 0.85),
      rgba(17, 24, 39, 1)
    ),
    url("/background.webp");
  background-size: cover, cover;
  background-position: bottom, top;
  background-repeat: repeat, no-repeat;
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
  search: "Otsi"
  enterKeyword: "Sisesta otsingu termin"
  browse: "või sirvi"
  estonianReferences: "Eesti kirjandus"
  allReferences: "Kogu kirjandus"
  libraries: "Kogumikud"
  about: "Tutvustus"
  latest: "Viimati lisatud teavikud"
en:
  search: "Search"
  enterKeyword: "Enter a search term"
  browse: "or browse"
  estonianReferences: "Estonian references"
  allReferences: "All references"
  libraries: "Libraries"
  about: "About"
  latest: "Recently added references"
</i18n>
