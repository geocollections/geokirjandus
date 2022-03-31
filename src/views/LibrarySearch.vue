<template>
  <v-container>
    <v-row no-gutters class="flex-nowrap">
      <v-col class="pl-0" v-if="!$vuetify.breakpoint.smAndDown">
        <div class="text-h4 font-weight-medium mb-4">
          {{ $t("tabs.libraries") }}
        </div>
        <search-library
          :col-size="12"
          @update:data="handleSearch"
          @reset:search="handleResetSearch"
        />
      </v-col>
      <v-col md="9" xl="10" class="ml-md-4">
        <div
          v-if="$vuetify.breakpoint.smAndDown"
          class="text-center text-h4 font-weight-medium mb-3 mb-md-0"
        >
          {{ $t("tabs.libraries") }}
        </div>
        <v-fade-transition :hide-on-leave="true">
          <v-card
            id="view"
            flat
            outlined
            elevation="0"
            class="ml-auto mr-auto card"
          >
            <library-viewer
              :options="options"
              :data="results"
              :count="count"
              :isLoading="isLoading"
              @update:options="handleOptionsUpdate"
              @update:pagination="handlePaginationUpdate"
            />
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-fab-transition v-if="$vuetify.breakpoint.smAndDown">
      <v-btn
        class="mt-2 d-print-none d-md-none font-family-exo-2"
        :color="$vuetify.theme.themes.light.accent"
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
      class="navigation-search-mobile"
    >
      <search-library
        class="my-3 mx-2"
        :col-size="12"
        @update:data="handleSearch"
        @reset:search="handleResetSearch"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import isEqual from "lodash/isEqual";
import { mapFields } from "vuex-map-fields";
import LibraryViewer from "@/components/library/LibraryViewer";
import SearchLibrary from "@/components/search/SearchLibrary";
import { fetchLibraries } from "@/utils/apiCalls";
export default {
  name: "LibrarySearch",
  components: { LibraryViewer, SearchLibrary },
  data() {
    return {
      showSearch: false,
      isLoading: true
    };
  },
  metaInfo: {
    title: "Otsing"
  },
  computed: {
    ...mapFields("search/library", ["options"]),
    ...mapState("search/library", ["search", "advancedSearch"]),
    ...mapState("result/library", ["count", "results"])
  },
  mounted() {
    this.getLibrariesFromApi();
  },
  methods: {
    ...mapActions("search/library", [
      "updateSearch",
      "updateAdvancedSearch",
      "resetSearch",
      "resetPage"
    ]),
    ...mapActions("result/library", { setLibraryResult: "setResult" }),
    handleResetSearch(event) {
      this.resetSearch(event);
      this.getLibrariesFromApi();
    },
    handleOptionsUpdate(event) {
      if (isEqual(this.options, event)) return;
      this.options = event;
      this.getLibrariesFromApi();
    },
    handlePaginationUpdate(event) {
      this.options = event;
      this.getLibrariesFromApi();
    },
    handleSearch(event) {
      this.resetPage();
      this.getLibrariesFromApi();
    },
    getLibrariesFromApi() {
      this.isLoading = true;
      const searchObj = {
        search: this.search,
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      fetchLibraries(searchObj).then(res => {
        this.setLibraryResult(res);
        this.isLoading = false;
      });
    }
  }
};
</script>

<style scoped>
.navigation-search-mobile {
  background-color: var(--v-primary-base);
}
</style>
