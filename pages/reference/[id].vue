<template>
  <Head>
    <Title>{{ reference?.title }}</Title>
  </Head>
  <div class="container px-2" v-if="reference">
    <div class="grid grid-cols-12 gap-x-2">
      <div
        class="col-span-2 hidden overflow-y-auto lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:px-2 lg:py-8"
      >
        <ClientOnly>
          <ReferenceSimilar />
        </ClientOnly>
      </div>

      <div class="col-span-12 space-y-4 px-4 py-8 lg:col-span-8">
        <div id="general" class="scroll-mt-20">
          <UButton
            class="lg:hidden"
            variant="link"
            icon="i-heroicons-arrow-small-left"
            :to="localePath({ path: '/reference', query: searchQueryParams })"
          >
            {{ t("back") }}
          </UButton>
          <div class="text-xl italic">{{ reference.reference }}</div>
          <h1 class="pb-3 pt-2 text-4xl font-semibold">
            {{ reference.title }}
          </h1>
          <div class="text-2xl">{{ reference.author }}</div>
        </div>
        <div class="flex space-x-2 lg:hidden">
          <CitePopover :id="reference.id" />
          <ReferenceLinks
            :doi="reference.doi"
            :pdf="reference.pdf"
            :url="url"
            :book-pdf="reference.parent?.pdf"
          />
        </div>
        <UDivider />
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
              <tr v-if="reference.issn">
                <th class="w-40 text-start font-semibold">ISSN</th>
                <td>{{ reference.issn }}</td>
              </tr>
              <tr v-if="reference.isbn">
                <th class="w-40 text-start font-semibold">ISBN</th>
                <td>{{ reference.isbn }}</td>
              </tr>
              <tr v-if="reference.id">
                <th class="w-40 text-start font-semibold">
                  {{ t("id") }}
                </th>
                <td>{{ reference.id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <UDivider />
        <div v-if="reference.abstract" id="abstract" class="scroll-mt-16">
          <HashLink hash="abstract">
            {{ t("abstract") }}
          </HashLink>
          <div v-html="reference.abstract"></div>
        </div>
        <div v-if="reference.remarks" id="remarks" class="scroll-mt-16">
          <HashLink hash="remarks">
            {{ t("remarks") }}
          </HashLink>
          <div v-html="reference.remarks"></div>
        </div>
        <div
          v-if="reference.keyword_count > 0"
          id="keywords"
          class="scroll-mt-16"
        >
          <HashLink hash="keywords">
            {{ t("keywords") }}
          </HashLink>
          <ReferenceKeywords
            :keywords-url="`/references/${route.params.id}/keywords/`"
          />
        </div>
        <div
          v-if="reference.reference_library_count > 0"
          id="libraries"
          class="scroll-mt-16"
        >
          <HashLink hash="libraries">
            {{ t("libraries") }}
          </HashLink>
          <ReferenceLibraries
            :reference-libraries-url="`/references/${route.params.id}/reference-libraries/`"
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
          <HashLink hash="geography">
            {{ t("geography") }}
          </HashLink>
          <ClientOnly>
            <ReferenceGeography
              :locality-url="`/references/${route.params.id}/reference-localities/`"
              :locality-count="reference.reference_locality_count"
              :area-url="`/references/${route.params.id}/reference-areas/`"
              :area-count="reference.reference_area_count"
              :site-url="`/references/${route.params.id}/reference-sites/`"
              :site-count="reference.reference_site_count"
            />
          </ClientOnly>
        </div>
        <div v-if="reference.taxon_count > 0" id="taxa" class="scroll-mt-16">
          <HashLink hash="taxa">
            {{ t("taxa") }}
          </HashLink>
          <ReferenceTaxa
            :url="`/references/${route.params.id}/taxa/`"
            :count="reference.taxon_count"
          />
        </div>
        <div
          v-if="reference.content_count > 0"
          id="contents"
          class="scroll-mt-16"
        >
          <HashLink hash="contents">
            {{ t("contents") }}
          </HashLink>
          <ReferenceContent
            :contents-url="`/references/${route.params.id}/contents/`"
            :count="reference.content_count"
          />
        </div>
        <div class="text-end">
          <span
            v-if="reference.date_changed"
            class="italic text-gray-500 dark:text-gray-400"
          >
            {{
              t("changed", {
                date: new Date(reference.date_changed).toLocaleDateString("et"),
              })
            }}
          </span>
        </div>
      </div>
      <div class="hidden lg:col-span-2 lg:block">
        <div
          class="space-y-2 overflow-y-auto py-8 lg:sticky lg:top-[57px] lg:max-h-[calc(100vh-57px)] lg:px-4"
        >
          <div class="flex flex-col items-start space-y-1">
            <CitePopover :id="reference.id" size="sm" variant="solid" />
            <ReferenceLinks
              :doi="reference.doi"
              :pdf="reference.pdf"
              :url="url"
              :book-pdf="reference.parent?.pdf"
              size="sm"
              variant="solid"
            />
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
            <UDivider />
            <UButton
              :to="`https://edit.geocollections.info/reference/${route.params.id}`"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              target="_blank"
            >
              {{ t("edit") }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VerticalNavigationLink } from "#ui/types";

const route = useRoute();
const { t } = useI18n({ useScope: "local" });

const localePath = useLocalePath();

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
    pdf?: string;
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
  issn?: string;
  isbn?: string;
  keyword_count: number;
  reference_library_count: number;
  reference_locality_count: number;
  reference_area_count: number;
  reference_site_count: number;
  taxon_count: number;
  content_count: number;
  date_added: string;
  date_changed: string;
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
        "parent.pdf",
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
        "issn",
        "isbn",
        "keyword_count",
        "reference_library_count",
        "reference_locality_count",
        "reference_area_count",
        "reference_site_count",
        "taxon_count",
        "content_count",
        "date_added",
        "date_changed",
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

function getNavigationLinks(reference: Reference) {
  const links: NavLink[] = [
    { label: t("general"), to: route.path, exactHash: true },
  ];
  if (reference.abstract) {
    links.push({
      label: t("abstract"),
      to: "#abstract",
      exactHash: true,
    });
  }
  if (reference.remarks) {
    links.push({
      label: t("remarks"),
      to: "#remarks",
      exactHash: true,
    });
  }
  if (reference.keyword_count > 0) {
    links.push({
      label: t("keywords"),
      to: "#keywords",
      exactHash: true,
      count: reference.keyword_count,
    });
  }
  if (reference.reference_library_count > 0) {
    links.push({
      label: t("libraries"),
      to: "#libraries",
      exactHash: true,
      count: reference.reference_library_count,
    });
  }
  if (
    reference.reference_locality_count +
      reference.reference_area_count +
      reference.reference_site_count >
    0
  ) {
    links.push({
      label: t("geography"),
      to: "#geography",
      exactHash: true,
      count:
        reference.reference_locality_count +
        reference.reference_area_count +
        reference.reference_site_count,
    });
  }
  if (reference.taxon_count > 0) {
    links.push({
      label: t("taxa"),
      to: "#taxa",
      exactHash: true,
      count: reference.taxon_count,
    });
  }
  if (reference.content_count > 0) {
    links.push({
      label: t("contents"),
      to: "#contents",
      exactHash: true,
      count: reference.content_count,
    });
  }
  return links;
}

const navigationLinks: NavLink[] = getNavigationLinks(reference.value);

const url = computed(() => {
  if (!reference.value) return undefined;
  return reference.value.url ?? reference.value.parent?.url ?? undefined;
});
const referencesStore = useReferencesStore();
const searchQueryParams = referencesStore.getQueryParams();
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
  id: "Id"
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
  back: "Tagasi otsingusse"
  edit: "Muuda"
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
  id: "Id"
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
  back: "Back to search"
  edit: "Edit"
</i18n>
