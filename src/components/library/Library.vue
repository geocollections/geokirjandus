<template>
  <v-container v-if="library">
    <v-card>
      <v-card-title>
        <v-col cols="auto">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon>fas fa-backspace</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h1>{{ getTitle }}</h1>
        </v-col>
      </v-card-title>
      <v-card-subtitle v-if="library.author">
        <v-col>
          <h2>{{ library.author }}</h2>
        </v-col>
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="auto">
            <b>{{ $t("common.libraryCreated") }}:</b>
            {{ formatDate(library.date_added) }}
          </v-col>
          <v-col cols="auto">
            <b>{{ $t("common.libraryChanged") }}:</b>
            {{ formatDate(library.date_changed) }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-subtitle>
        <h2>
          <b>{{ $t("common.referenceLibrary") }}</b>
        </h2>
      </v-card-subtitle>
      <v-card-text>
        <!--  TODO: Add URL  -->
        <div>
          {{
            `${library.author} (${library.year}) ${getTitle}. ${$t(
              "common.visited"
            )}: ${formatDate(Date.now())}`
          }}
        </div>
      </v-card-text>
      <v-card-subtitle v-if="library.abstract">
        <h2>
          <b>{{ $t("common.summary") }}</b>
        </h2>
      </v-card-subtitle>
      <v-card-text v-if="library.abstract">
        <div v-if="$i18n.locale === 'ee'" v-html="library.abstract[0]"></div>
        <div v-else v-html="library.abstract_en[0]"></div>
      </v-card-text>
      <v-card-subtitle>
        <h2>
          <b>{{ $t("common.libraryReferences") }}</b>
        </h2>
      </v-card-subtitle>
      <v-card-actions>
        <reference-viewer
          :search="search"
          :advancedSearch="getAdvancedSearch"
          :show-libraries="false"
        ></reference-viewer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { fetchLibrary, fetchLibraryReferences } from "@/utils/apiCalls";
import ReferenceItem from "@/components/reference/ReferenceItem";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import { mapState, mapActions } from "vuex";
import dateMixin from "@/mixins/dateMixin";

export default {
  name: "Library",
  components: { ReferenceViewer },
  props: {
    search: {
      type: Object
    },
    advancedSearch: {
      type: Object
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      library: null,
      references: null,
      isLoading: true
    };
  },
  mixins: [dateMixin],
  computed: {
    getTitle() {
      if (this.$i18n.locale === "ee") {
        return this.library.title;
      } else {
        return this.library.title_en;
      }
    },
    getAdvancedSearch() {
      return {
        byIds: {
          ...this.advancedSearch.byIds,
          libraries: {
            type: "text",
            id: "libraries",
            lookUpType: "contains",
            value: `|${this.library.id}|`,
            label: "reference.libraries",
            fields: ["libraries"],
            hidden: true
          }
        },
        allIds: [...this.advancedSearch.allIds, "libraries"]
      };
    }
  },
  created() {
    this.resetSearch();
    this.resetPage();
    this.getLibrary().then(res => {
      this.library = res.results[0];
    });

    this.getLibraryReferences().then(res => {
      this.references = res.results;
      this.isLoading = false;
    });
  },
  methods: {
    ...mapActions("search", ["resetSearch", "resetPage"]),
    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
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
