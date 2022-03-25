<template>
  <v-container>
    <v-row no-gutters class="flex-nowrap">
      <v-col class="pl-0" v-if="!$vuetify.breakpoint.smAndDown">
        <div class="text-h4 font-weight-medium mb-4">
          {{ $t("tabs.references") }}
        </div>
        <search-reference
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
          {{ $t("tabs.references") }}
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
              :options="options"
              :data="results"
              :count="count"
              :is-loading="isLoading"
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
        @update:data="handleSearch"
        @reset:search="handleResetSearch"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import isEqual from "lodash/isEqual";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import SearchReference from "@/components/search/SearchReference";

import { fetchReferences } from "@/utils/apiCalls";
import { mapFields } from "vuex-map-fields";
export default {
  name: "Home",
  components: {
    ReferenceViewer,
    SearchReference
  },
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
    ...mapFields("search/reference", ["options"]),
    ...mapState("search/reference", ["search", "advancedSearch"]),
    ...mapState("result/reference", ["count", "results"])
  },
  mounted() {
    this.getReferencesFromApi();
  },
  methods: {
    ...mapActions("search/reference", [
      "updateSearch",
      "updateAdvancedSearch",
      "updateOptions",
      "resetSearch",
      "resetPage"
    ]),
    ...mapActions("result/reference", { setReferenceResult: "setResult" }),
    handleResetSearch(event) {
      this.resetSearch(event);
      this.getReferencesFromApi();
    },
    handleOptionsUpdate(event) {
      if (isEqual(this.options, event)) return;
      this.options = event;
      this.getReferencesFromApi();
    },
    handlePaginationUpdate(event) {
      this.options = event;
      this.getReferencesFromApi();
    },
    handleSearch(event) {
      this.resetPage();
      this.getReferencesFromApi();
    },
    getReferencesFromApi() {
      this.isLoading = true;
      const searchObj = {
        search: this.search,
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      fetchReferences(searchObj).then(res => {
        this.setReferenceResult(res);
        this.isLoading = false;
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
