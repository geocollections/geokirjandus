<template>
  <v-container>
    <v-card v-if="library">
      <v-card-title
        style="background-color: #F1CDA7"
        class="pt-1 pb-1 d-flex text-center"
      >
        <v-col cols="auto" class="py-0 px-0">
          <v-btn
            large
            icon
            @click="$router.replace(prevRoute)"
            aria-label="back"
          >
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <div class="col" style="word-break: normal">
          {{ `${library.author}, ${library.year}: ${getTitle}` }}
        </div>
      </v-card-title>
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
      <v-card-text>
        <h2 class="pb-3">
          <b>{{ $t("common.citation") }}</b>
        </h2>
        <v-card flat outlined>
          <div class="pa-4">
            <library-citation :library="library" />
          </div>
        </v-card>
      </v-card-text>
      <v-card-text v-if="library.abstract" class="pt-0">
        <h2>
          <b>{{ $t("common.summary") }}</b>
        </h2>
      </v-card-text>
      <v-card-text v-if="library.abstract" class="py-0">
        <div v-if="$i18n.locale === 'ee'" v-html="library.abstract"></div>
        <div v-else v-html="library.abstract_en"></div>
      </v-card-text>
      <v-card-text class="pb-0">
        <h2>
          <b>{{ $t("common.libraryReferences") }}</b>
        </h2>
      </v-card-text>
      <reference-viewer />
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

export default {
  name: "Library",
  components: { LibraryCitation, ReferenceViewer },
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
      isLoading: true,
      error: false,
      prevRoute: null
    };
  },
  mixins: [dateMixin, citationMixin],
  computed: {
    getTitle() {
      if (this.$i18n.locale === "ee") {
        return this.library.title;
      } else {
        return this.library.title_en;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from.path;

      if (from.name === "searchLib") vm.resetSearch();
    });
  },
  created() {
    // this.resetSearch();
    this.resetPage();
    this.setSearchFromURL(this.$route.query);
    this.getLibrary().then(res => {
      this.library = res.results[0];

      if (this.library === undefined) {
        this.error = true;
      }
    });
  },

  methods: {
    ...mapActions("search", ["resetSearch", "resetPage", "setSearchFromURL"]),
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
