<template>
  <v-main class="library">
    <v-container v-if="library">
      <v-row>
        <v-col cols="auto">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon >fas fa-backspace</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h1>{{ getTitle }}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
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
              <reference-item :reference="reference" :index="index"></reference-item>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { fetchLibrary, fetchLibraryReferences } from "@/utils/apiCalls";
import ReferenceItem from "@/components/reference/ReferenceItem";

export default {
  name: "Library",
  components: { ReferenceItem },
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
      this.library = res.results[0];
    });

    this.getLibraryReferences().then(res => {
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
