<template>
  <div class="library">
    <v-container v-if="library">
      <v-row>
        <v-col>
          <h1>{{ getTitle }}</h1>
          <h2>{{ library.author }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto">
          <div>
            <b>{{ $t("common.libraryCreated") }}:</b>
            {{ formatDate(library.date_added) }}
          </div>
        </v-col>
        <v-col cols="auto">
          <div>
            <b>{{ $t("common.libraryChanged") }}:</b>
            {{ formatDate(library.date_changed) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div>
            <b>{{ $t("common.referenceLibrary") }}</b>
          </div>
          <!--  TODO: Add URL  -->
          <div>
            {{
              `${library.author} (${library.year}) ${getTitle}. ${$t(
                "common.visited"
              )}: ${formatDate(Date.now())}`
            }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>{{ $t("common.summary") }}</h3>
          <div v-if="$i18n.locale === 'ee'" v-html="library.abstract[0]"></div>
          <div v-else v-html="library.abstract_en[0]"></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2>
            <b>{{ $t("common.libraryReferences") }}</b>
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div :key="reference.id" v-for="(reference, index) in references">
            <v-divider v-if="index !== 0" />
            <div class="py-2">
              <span>{{ index }}. </span>
              <span v-if="reference.author" class="ablack font-weight-medium">
                <router-link
                  :to="{ path: '/reference/' + reference.id }"
                  :title="$t('reference.viewReference')"
                >
                  {{ reference.author }},
                </router-link>
              </span>

              <span v-if="reference.year"> {{ reference.year }}. </span>

              <span v-if="reference.title"> {{ reference.title }}. </span>

              <span v-if="reference.book_editor || reference.book">
                <i>In: </i>
              </span>

              <span v-if="reference.book_editor">
                {{ reference.book_editor }} (ed.),
              </span>

              <span v-if="reference.book">
                <i>{{ reference.book }}</i
                >.
              </span>

              <span v-if="reference.publisher">
                {{ reference.publisher }},
              </span>

              <span v-if="reference.publisher_place">
                {{ reference.publisher_place }}.
              </span>

              <span v-if="reference.journal__journal_name">
                <i>{{ reference.journal__journal_name }}</i>
              </span>

              <span v-if="reference.volume"> {{ reference.volume }}, </span>

              <span v-if="reference.number"> {{ reference.number }}, </span>

              <span v-if="reference.pages && reference.journal__journal_name">
                {{ reference.pages }}.
              </span>

              <span v-else-if="reference.pages">
                pp. {{ reference.pages }}.
              </span>

              <!-- TODO: DOI LINK -->
              <span v-if="reference.doi">
                <a
                  :href="getDoiUrl(reference.doi)"
                  :title="getDoiUrl(reference.doi)"
                  target="DoiWindow"
                  >https://doi.org/{{ reference.doi }}
                </a>
              </span>

              <span>
                <a
                  v-if="reference.attachment__filename"
                  :href="getFileUrl(reference.attachment__filename)"
                  :title="getFileUrl(reference.attachment__filename)"
                  target="FileWindow"
                  class="green-link"
                >
                  <b>PDF</b>
                </a>
                <a
                  v-if="
                    reference.attachment__filename === null &&
                      reference.url &&
                      getUrl(reference.url)
                  "
                  :href="getUrl(reference.url)"
                  :title="getUrl(reference.url)"
                  target="UrlWindow"
                  rel="noopener noreferrer"
                  class="red-link"
                >
                  <b>PDF</b>
                </a>
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { fetchLibrary, fetchLibraryReferences } from "@/utils/apiCalls";

export default {
  name: "Library",
  data() {
    return {
      id: this.$route.params.id,
      library: null,
      references: null
    };
  },
  computed: {
    getDateLocale() {
      if (this.$i18n.locale === "ee") {
        return "et-EE";
      } else {
        return "en-GB";
      }
    },
    getTitle() {
      if (this.$i18n.locale === "ee") {
        return this.library.title;
      } else {
        return this.library.title_en;
      }
    }
  },
  created() {
    this.getLibrary().then(res => {
      console.log(res.results[0]);
      this.library = res.results[0];
    });

    this.getLibraryReferences().then(res => {
      console.log(res.results);
      this.references = res.results;
    });
  },
  methods: {
    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleString(this.getDateLocale, {
        dateStyle: "medium"
      });
    },
    getUrl(url) {
      if (url.startsWith("http")) return url;
      else if (url.startsWith("www.")) return "http://" + url;
      else if (url.includes("www."))
        return "http://" + url.substring(url.indexOf("www."));
      else return false;
    },

    getLibrary() {
      return fetchLibrary(this.$route.params.id);
    },
    getLibraryReferences() {
      return fetchLibraryReferences(this.$route.params.id);
    },
    getFileUrl(uuid) {
      return `https://files.geocollections.info/${uuid.substring(
        0,
        2
      )}/${uuid.substring(2, 4)}/${uuid}`;
    }
  }
};
</script>
