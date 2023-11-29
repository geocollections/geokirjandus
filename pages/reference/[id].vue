<template>
  <div class="container" v-if="reference">
    <div class="grid grid-cols-12 gap-x-2">
      <div
        class="col-span-2 overflow-y-auto lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <ReferenceSimilar />
      </div>

      <div class="col-span-8 space-y-2 px-4 py-8">
        <div id="general" class="scroll-mt-20">
          <div class="text-xl italic">{{ reference.reference }}</div>
          <h1 class="text-4xl font-semibold">
            {{ reference.title }}
          </h1>
          <div class="text-2xl">{{ reference.author }}</div>
        </div>
        <div>
          <table>
            <tbody>
              <tr v-if="reference.doi">
                <th class="w-40 text-start font-semibold">
                  {{ t("doi") }}
                </th>
                <td>
                  <NuxtLink
                    :to="`https://doi.org/${reference.doi}`"
                    target="_blank"
                  >
                    {{ reference.doi }}
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="reference.author_original">
                <th class="w-40 text-start font-semibold">
                  {{ t("authorOriginal") }}
                </th>
                <td>{{ reference.author_original }}</td>
              </tr>
              <tr v-if="reference.year">
                <th class="w-40 text-start font-semibold">{{ t("year") }}</th>
                <td>{{ reference.year }}</td>
              </tr>
              <tr v-if="reference.title_translated">
                <th class="w-40 text-start font-semibold">
                  {{ t("titleTranslated") }}
                </th>
                <td>{{ reference.title_translated }}</td>
              </tr>
              <tr v-if="reference.title_original">
                <th class="w-40 text-start font-semibold">
                  {{ t("titleOriginal") }}
                </th>
                <td>{{ reference.title_original }}</td>
              </tr>
              <tr v-if="reference.book">
                <th class="w-40 text-start font-semibold">{{ t("book") }}</th>
                <td>{{ reference.book }}</td>
              </tr>
              <tr v-if="reference.book_translated">
                <th class="w-40 text-start font-semibold">
                  {{ t("bookTranslated") }}
                </th>
                <td>{{ reference.book_translated }}</td>
              </tr>
              <tr v-if="reference.book_original">
                <th class="w-40 text-start font-semibold">
                  {{ t("bookOriginal") }}
                </th>
                <td>{{ reference.book_original }}</td>
              </tr>
              <tr v-if="reference.book_editor">
                <th class="w-40 text-start font-semibold">
                  {{ t("bookEditor") }}
                </th>
                <td>{{ reference.book_editor }}</td>
              </tr>
              <tr v-if="reference.publisher">
                <th class="w-40 text-start font-semibold">
                  {{ t("publisher") }}
                </th>
                <td>{{ reference.publisher }}</td>
              </tr>
              <tr v-if="reference.publisher_place">
                <th class="w-40 text-start font-semibold">
                  {{ t("publisherPlace") }}
                </th>
                <td>{{ reference.publisher_place }}</td>
              </tr>
              <tr v-if="reference.journal">
                <th class="w-40 text-start font-semibold">
                  {{ t("journal") }}
                </th>
                <td>{{ reference.journal.name }}</td>
              </tr>
              <tr v-if="reference.parent">
                <th class="w-40 text-start font-semibold">{{ t("parent") }}</th>
                <td>
                  <NuxtLinkLocale :to="`/reference/${reference.parent.id}`">
                    {{ reference.parent.reference }}
                  </NuxtLinkLocale>
                </td>
              </tr>
              <tr v-if="reference.volume">
                <th class="w-40 text-start font-semibold">{{ t("volume") }}</th>
                <td>{{ reference.volume }}</td>
              </tr>
              <tr v-if="reference.number">
                <th class="w-40 text-start font-semibold">{{ t("number") }}</th>
                <td>{{ reference.number }}</td>
              </tr>
              <tr v-if="reference.pages">
                <th class="w-40 text-start font-semibold">{{ t("pages") }}</th>
                <td>{{ reference.pages }}</td>
              </tr>
              <tr v-if="reference.type">
                <th class="w-40 text-start font-semibold">{{ t("type") }}</th>
                <td>
                  {{
                    $translate({
                      et: reference.type.value,
                      en: reference.type.value_en,
                    })
                  }}
                </td>
              </tr>
              <tr v-if="reference.figures">
                <th class="w-40 text-start font-semibold">
                  {{ t("figures") }}
                </th>
                <td>{{ reference.figures }}</td>
              </tr>
              <tr v-if="reference.is_oa">
                <th class="w-40 text-start font-semibold">OpenAccess</th>
                <td><UIcon name="i-heroicons-check" /></td>
              </tr>
              <tr v-if="reference.licence">
                <th class="w-40 text-start font-semibold">
                  {{ t("licence") }}
                </th>
                <td>
                  <NuxtLinkLocale
                    :to="
                      $translate({
                        et: reference.licence.url,
                        en: reference.licence.url_en,
                      })
                    "
                    target="_blank"
                  >
                    {{
                      $translate({
                        et: reference.licence.name,
                        en: reference.licence.name_en,
                      })
                    }}
                  </NuxtLinkLocale>
                </td>
              </tr>
              <tr v-if="reference.is_estonian_reference">
                <th class="w-40 text-start font-semibold">
                  {{ t("estonianReference") }}
                </th>
                <td><UIcon name="i-heroicons-check" /></td>
              </tr>
              <tr v-if="reference.is_estonian_author">
                <th class="w-40 text-start font-semibold">
                  {{ t("estonianAuthor") }}
                </th>
                <td><UIcon name="i-heroicons-check" /></td>
              </tr>
              <tr v-if="reference.language">
                <th class="w-40 text-start font-semibold">
                  {{ t("language") }}
                </th>
                <td>
                  {{
                    $translate({
                      et: reference.language.name,
                      en: reference.language.name_en,
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="reference.abstract" id="abstract" class="scroll-mt-16">
          <h2 class="mb-2 text-xl font-semibold">{{ t("abstract") }}</h2>
          <div v-html="reference.abstract"></div>
        </div>
        <div v-if="reference.remarks" id="remarks" class="scroll-mt-16">
          <h2 class="mb-2 text-xl font-semibold">{{ t("remarks") }}</h2>
          <div v-html="reference.remarks"></div>
        </div>
        <div
          v-if="reference.keyword_count > 0"
          id="keywords"
          class="scroll-mt-16"
        >
          <h2 class="mb-2 text-xl font-semibold">{{ t("keywords") }}</h2>
          <ReferenceKeywords :keywords-url="reference.keywords_url" />
        </div>
        <div
          v-if="reference.reference_library_count > 0"
          id="libraries"
          class="scroll-mt-16"
        >
          <h2 class="mb-2 text-xl font-semibold">{{ t("libraries") }}</h2>
          <ReferenceLibraries
            :reference-libraries-url="reference.reference_libraries_url"
          />
        </div>
        <div
          v-if="
            reference.reference_locality_count +
              reference.reference_area_count +
              reference.reference_site_count >
            0
          "
          id="geography"
          class="scroll-mt-16"
        >
          <h2 class="mb-2 text-xl font-semibold">{{ t("geography") }}</h2>
          <ReferenceGeography
            :locality-url="reference.reference_localities_url"
            :locality-count="reference.reference_locality_count"
            :area-url="reference.reference_areas_url"
            :area-count="reference.reference_area_count"
            :site-url="reference.reference_sites_url"
            :site-count="reference.reference_site_count"
          />
        </div>
        <div v-if="reference.taxon_count > 0" id="taxa" class="scroll-mt-16">
          <h2 class="mb-2 text-xl font-semibold">{{ t("taxa") }}</h2>
          <ReferenceTaxa
            :url="reference.taxa_url"
            :count="reference.taxon_count"
          />
        </div>
        <div
          v-if="reference.content_count > 0"
          id="content"
          class="scroll-mt-16"
        >
          <h2 class="mb-2 text-xl font-semibold">{{ t("contents") }}</h2>
          <ReferenceContent
            :contents-url="reference.contents_url"
            :count="reference.content_count"
          />
        </div>
        <div class="text-end">
          <span v-if="reference.date_changed" class="italic text-gray-500">
            {{
              t("changed", {
                date: new Date(reference.date_changed).toLocaleDateString(),
              })
            }}
          </span>
        </div>
      </div>
      <div class="col-span-2">
        <div
          class="sticky space-y-2 overflow-y-auto lg:top-[57px] lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
        >
          <div>
            <CitePopover :id="reference.id" />
            <UButton
              v-if="reference.doi"
              variant="soft"
              color="yellow"
              icon="i-simple-icons-doi"
              :to="`https://doi.org/${reference.doi}`"
            >
              DOI
            </UButton>
            <UButton
              v-if="reference.pdf"
              variant="soft"
              color="red"
              icon="i-heroicons-document"
            >
              PDF
            </UButton>
            <UButton
              v-if="url"
              variant="soft"
              color="blue"
              icon="i-heroicons-arrow-top-right-on-square"
            >
              URL
            </UButton>
          </div>
          <UDivider />
          <div class="space-y-2">
            <div class="font-semibold">{{ t("navigation") }}</div>
            <UVerticalNavigation :links="navigationLinks">
              <template #default="{ link }">
                <div class="group-hover:text-primary relative space-x-1">
                  <span>
                    {{ link.label }}
                  </span>
                  <UBadge v-if="link.count" color="gray">{{
                    link.count
                  }}</UBadge>
                </div>
              </template>
            </UVerticalNavigation>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VerticalNavigationLink } from "@nuxt/ui/dist/runtime/types";

const route = useRoute();
const { t } = useI18n({ useScope: "local" });

type Reference = {
  id: number;
  reference: string;
  title: string;
  author: string;
  doi?: string;
  author_original?: string;
  year?: string;
  title_translated?: string;
  title_original?: string;
  book?: string;
  book_translated?: string;
  book_original?: string;
  book_editor?: string;
  publisher?: string;
  publisher_place?: string;
  pdf?: string;
  url?: string;
  journal?: {
    name: string;
  };
  parent?: {
    id: string;
    reference: string;
    url?: string;
  };
  volume?: string;
  number?: string;
  pages?: string;
  type?: {
    value: string;
    value_en: string;
  };
  figures?: string;
  is_oa: boolean;
  licence?: {
    url: string;
    url_en: string;
    name: string;
    name_en: string;
  };
  is_estonian_reference: boolean;
  is_estonian_author: boolean;
  language?: {
    name: string;
    name_en: string;
  };
  abstract?: string;
  remarks?: string;
  keyword_count: number;
  reference_library_count: number;
  reference_locality_count: number;
  reference_area_count: number;
  reference_site_count: number;
  taxon_count: number;
  content_count: number;
  date_added: string;
  date_changed: string;
  reference_libraries_url: string;
  reference_localities_url: string;
  reference_areas_url: string;
  reference_sites_url: string;
  taxa_url: string;
  contents_url: string;
  keywords_url: string;
};

const { data: reference } = await useNewApiFetch<Reference>(
  `/references/${route.params.id}/`,
  {
    query: {
      expand: "language,parent,type,journal,licence",
      fields: [
        "id",
        "reference",
        "title",
        "author",
        "doi",
        "author_original",
        "year",
        "title_translated",
        "title_original",
        "book",
        "book_translated",
        "book_original",
        "book_editor",
        "publisher",
        "publisher_place",
        "pdf",
        "url",
        "journal.name",
        "parent.id",
        "parent.reference",
        "parent.url",
        "volume",
        "number",
        "pages",
        "type.value",
        "type.value_en",
        "figures",
        "is_oa",
        "licence.url",
        "licence.url_en",
        "licence.name",
        "licence.name_en",
        "is_estonian_reference",
        "is_estonian_author",
        "language.name",
        "language.name_en",
        "abstract",
        "remarks",
        "keyword_count",
        "reference_library_count",
        "reference_locality_count",
        "reference_area_count",
        "reference_site_count",
        "taxon_count",
        "content_count",
        "date_added",
        "date_changed",
        "reference_libraries_url",
        "reference_localities_url",
        "reference_areas_url",
        "reference_sites_url",
        "taxa_url",
        "contents_url",
        "keywords_url",
      ],
    },
  },
);

if (!reference.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

type NavLink = VerticalNavigationLink & {
  count?: number;
  exactHash?: boolean;
};

const navigationLinks = computed(() => {
  const links: NavLink[] = [
    { label: t("general"), to: route.path, exactHash: true },
  ];
  if (!reference.value) return links;
  if (reference.value.abstract) {
    links.push({
      label: t("abstract"),
      to: "#abstract",
      exactHash: true,
    });
  }
  if (reference.value.remarks) {
    links.push({
      label: t("remarks"),
      to: "#remarks",
      exactHash: true,
    });
  }
  if (reference.value.keyword_count > 0) {
    links.push({
      label: t("keywords"),
      to: "#keywords",
      exactHash: true,
      count: reference.value.keyword_count,
    });
  }
  if (reference.value.reference_library_count > 0) {
    links.push({
      label: t("libraries"),
      to: "#libraries",
      exactHash: true,
      count: reference.value.reference_library_count,
    });
  }
  if (
    reference.value.reference_locality_count +
      reference.value.reference_area_count +
      reference.value.reference_site_count >
    0
  ) {
    links.push({
      label: t("geography"),
      to: "#geography",
      exactHash: true,
      count:
        reference.value.reference_locality_count +
        reference.value.reference_area_count +
        reference.value.reference_site_count,
    });
  }
  if (reference.value.taxon_count > 0) {
    links.push({
      label: t("taxa"),
      to: "#taxa",
      exactHash: true,
      count: reference.value.taxon_count,
    });
  }
  if (reference.value.content_count > 0) {
    links.push({
      label: t("contents"),
      to: "#content",
      exactHash: true,
      count: reference.value.content_count,
    });
  }
  return links;
});

const url = computed(() => {
  if (!reference.value) return null;
  return reference.value.url ?? reference.value.parent?.url ?? null;
});
</script>

<i18n lang="yaml">
et:
  doi: "DOI"
  authorOriginal: "Autor originaal"
  year: "Aasta"
  titleTranslated: "Pealkiri tõlgitud"
  titleOriginal: "Pealkiri originaal"
  book: "Raamat"
  bookTranslated: "Raamatu pealkiri tõlgitud"
  bookOriginal: "Raamatu pealkiri originaal"
  bookEditor: "Toimetaja(d)"
  publisher: "Kirjastus"
  publisherPlace: "Kirjastuse koht"
  journal: "Ajakiri"
  parent: "Kuulub kogumikku"
  volume: "Köide"
  number: "Number"
  pages: "Leheküljed"
  type: "Tüüp"
  figures: "Joonised"
  licence: "Litsents"
  estonianReference: "Eesti kirjandus"
  estonianAuthor: "Eesti autor"
  language: "Keel"
  abstract: "Abstrakt"
  general: "Üldine info"
  keywords: "Märksõnad"
  libraries: "Kogumikud"
  geography: "Geograafia"
  contents: "Sisukord"
  navigation: "Navigatsioon"
  remarks: "Märkused"
  taxa: "Kirjeldatud taksonid"
  changed: "Viimati muudetud: {date}"
en:
  doi: "DOI"
  authorOriginal: "Author original"
  year: "Year"
  titleTranslated: "Title translated"
  titleOriginal: "Title original"
  book: "Book"
  bookTranslated: "Book title translated"
  bookOriginal: "Book title original"
  bookEditor: "Editor(s)"
  publisher: "Publisher"
  publisherPlace: "Publisher place"
  journal: "Journal"
  parent: "Belongs to"
  volume: "Volume"
  number: "Number"
  pages: "Pages"
  type: "Type"
  figures: "Figures"
  licence: "Litsents"
  estonianReference: "Estonian reference"
  estonianAuthor: "Estonian author"
  language: "Language"
  general: "General info"
  abstract: "Abstract"
  keywords: "Keywords"
  libraries: "Libraries"
  geography: "Geography"
  contents: "Contents"
  navigation: "Navigation"
  remarks: "Remarks"
  taxa: "Described taxa"
  changed: "Last change: {date}"
</i18n>