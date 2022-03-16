<template>
  <v-container>
    <v-row no-gutters class="flex-nowrap">
      <v-col class="pl-0" v-if="!$vuetify.breakpoint.smAndDown">
        <div class="text-h4 font-weight-medium mb-4">
          {{ $t("tabs.references") }}
        </div>
        <search-reference
          :col-size="12"
          v-on:update:search="handleUpdateSearch"
          v-on:update:advancedSearch="handleUpdateAdvancedSearch"
          v-on:reset:search="handleResetSearch"
        />
      </v-col>
      <v-col md="9" xl="10" class="ml-md-8">
        <div
          v-if="$vuetify.breakpoint.smAndDown"
          class="text-h4 font-weight-medium mb-3 mb-md-0"
        >
          {{ $t("tabs.references") }} [{{ count }}]
        </div>
        <v-fade-transition :hide-on-leave="true">
          <v-card
            id="view"
            flat
            elevation="0"
            outlined
            class="ml-auto mr-auto card"
          >
            <reference-viewer
              :options.sync="options"
              :data="results"
              :count="count"
              @update:data="getReferencesFromApi"
            />
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-fab-transition v-if="$vuetify.breakpoint.smAndDown">
      <v-btn
        class="mt-2 d-print-none d-md-none"
        color="#135ebf"
        fixed
        rounded
        dark
        bottom
        style="left: 50%;transform: translateX(-50%);z-index: 4"
        id="searchFab"
        @click="showSearch = !showSearch"
      >
        <v-icon small left>fas fa-search</v-icon>
        {{ $t("common.search") }}
      </v-btn>
    </v-fab-transition>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="showSearch"
      disable-route-watcher
      mobile-breakpoint="960"
      bottom
      fixed
      temporary
      style="background-color: #fff5e6;"
    >
      <search-reference
        class="my-3 mx-2"
        :col-size="12"
        v-on:update:search="handleUpdateSearch"
        v-on:update:advancedSearch="handleUpdateAdvancedSearch"
        v-on:reset:search="handleResetSearch"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import SearchReference from "@/components/search/SearchReference";
import queryMixin from "@/mixins/queryMixin";
import { fetchReferences } from "@/utils/apiCalls";
import { mapFields } from "vuex-map-fields";
export default {
  name: "Home",
  components: {
    ReferenceViewer,
    SearchReference
  },
  mixins: [queryMixin],
  data() {
    return {
      showSearch: false,
      isPrint: false,
      printResult: []
    };
  },
  metaInfo: {
    title: "Otsing"
  },
  computed: {
    ...mapFields("search/reference", ["options"]),
    ...mapState("search/reference", ["search", "advancedSearch"]),
    ...mapState("references", ["count", "results"])
  },
  created() {
    window.onbeforeprint = () => {
      this.isPrint = true;

      const setPrintResults = res => {
        this.printResult = res.results;
      };

      if (this.$route.name === "library") {
        this.getReferencesInLibrary(this.$route.params.id).then(
          setPrintResults
        );
      } else {
        this.getReferences().then(setPrintResults);
      }
    };
    window.onafterprint = () => {
      this.isPrint = false;
    };
  },
  methods: {
    ...mapActions("search/reference", [
      "updateSearch",
      "updateAdvancedSearch",
      "resetSearch",
      "resetPage"
    ]),
    ...mapActions("references", ["setReferences"]),
    handleUpdateSearch(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/updateSearch", event);
      else this.updateSearch(event);
    },
    handleUpdateAdvancedSearch(event) {
      if (this.$route.name === "library")
        this.$store.dispatch(
          "libraryReferenceSearch/updateAdvancedSearch",
          event
        );
      else this.updateAdvancedSearch(event);
    },
    handleResetSearch(event) {
      this.resetSearch(event);
      this.getReferences().then(res => {
        this.setReferences(res);
      });
    },
    getReferencesFromApi() {
      const searchObj = {
        search: this.search,
        page: this.options.page,
        paginateBy: this.options.paginateBy,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      fetchReferences(searchObj).then(res => {
        this.setReferences(res);
      });
    }
  }
};
</script>

<style scoped>
.main {
  background-color: #f6eddf;
}
</style>
