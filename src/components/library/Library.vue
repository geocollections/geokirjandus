<template>
  <v-container>
    <v-card v-if="library">
      <v-card-title
        style="background-color: #F1CDA7"
        class="pt-1 pb-1 d-flex text-center"
      >
        <v-col cols="auto" class="py-0 px-0">
          <v-btn large icon @click="handleBack()" aria-label="back">
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <div class="col" style="word-break: normal">
          {{ getTitle }}
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <h3>
          {{ $t("common.libraryCreatedBy") }}: {{ library.author }}
          {{ library.year }}
        </h3>
      </v-card-text>

      <v-card-text>
        <div class="d-flex pb-3">
          <h3 class="align-self-center">
            <b>{{ $t("common.citation") }}</b>
          </h3>
          <!--
              TODO: Find a better way to copy citation. Right now there is a copy of the csl json in this component and the citation is built again. Should build citation only once
              TODO: Citation text style is not copied right now (bold, italic)
            -->
          <copy-button
            :text="citation(getCslJson, append, null, 'string')"
            :message="$t('messages.copyCitation')"
          />
        </div>
        <v-card flat outlined>
          <div class="pa-4">
            <library-citation :library="library" />
          </div>
        </v-card>
      </v-card-text>
      <v-card-text v-if="library.abstract" class="pt-0">
        <h3>
          <b>{{ $t("common.summary") }}</b>
        </h3>
      </v-card-text>
      <v-card-text v-if="library.abstract" class="py-0">
        <div v-if="$i18n.locale === 'ee'" v-html="library.abstract"></div>
        <div v-else v-html="library.abstract_en"></div>
      </v-card-text>
      <v-card-text class="pb-0">
        <h3>
          <b>{{ $t("common.libraryReferences") }}</b>
        </h3>
      </v-card-text>
      <reference-viewer />
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="auto" class="pt-2">
            <b>{{ $t("common.libraryCreated") }}:</b>
            {{ formatDate(library.date_added) }}
          </v-col>
          <v-col cols="auto" class="pt-2">
            <b>{{ $t("common.libraryChanged") }}:</b>
            {{ formatDate(library.date_changed) }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-if="error">
      <v-card-actions style="background-color: #F6EDDF">
        <v-col cols="auto" class="py-0 px-2">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon>fas fa-backspace</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-title style="background-color: #F6EDDF" class="pt-0">
        {{ $t("error.libraryId", { text: id }) }}
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import { fetchLibrary } from "@/utils/apiCalls";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import { mapActions } from "vuex";
import dateMixin from "@/mixins/dateMixin";
import citationMixin from "@/mixins/citationMixin";
import LibraryCitation from "@/components/library/LibraryCitation";
import queryMixin from "@/mixins/queryMixin";
import CopyButton from "@/components/CopyButton";
export default {
  name: "Library",
  components: { LibraryCitation, ReferenceViewer, CopyButton },
  data() {
    return {
      id: this.$route.params.id,
      library: null,
      isLoading: true,
      error: false,
      prevRoute: null
    };
  },
  mixins: [dateMixin, citationMixin, queryMixin],
  computed: {
    append() {
      return ` ${this.$t("common.visited")}: ${this.formatDate(Date.now())}`;
    },
    getTitle() {
      if (this.$i18n.locale === "ee") {
        return this.library.title;
      } else {
        return this.library.title_en;
      }
    },
    getCslJson() {
      return {
        id: this.library.id,
        type: "webpage",
        author: this.parseNames(this.library.author),
        issued: [
          {
            "date-parts": [this.library.year]
          }
        ],
        publisher: this.$t("common.libraryPublisher"),
        title: this.library.title,
        URL: `https://geoloogia.info/library/${this.library.id}`
      };
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!from.name)
        vm.prevRoute = { name: "searchLibrary", params: vm.$route.params };
      if (from.name === "searchLibrary") vm.resetSearch();
      vm.getLibrary().then(res => {
        vm.library = res.results[0];

        if (vm.library === undefined) {
          vm.error = true;
        }
      });
      vm.resetPage();
      vm.updateSortBy(["author", "year"]);
      vm.updateSortDesc([false, false]);
      vm.getReferencesInLibrary();
    });
  },

  methods: {
    ...mapActions("librarySearch", [
      "resetSearch",
      "resetPage",
      "updateSortBy",
      "updateSortDesc"
    ]),
    handleBack() {
      if (this.prevRoute) {
        this.$router.replace(this.prevRoute);
      } else {
        this.$router.go(-1);
      }
    },
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
    getFileUrl(uuid) {
      return `https://files.geocollections.info/${uuid.substring(
        0,
        2
      )}/${uuid.substring(2, 4)}/${uuid}`;
    }
  }
};
</script>
