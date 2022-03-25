<template>
  <v-container>
    <v-row justify="center">
      <v-col class="px-2 px-sm-3">
        <v-breadcrumbs
          v-if="library"
          class="pa-0"
          :items="[
            {
              text: $t('tabs.libraries'),
              to: { name: 'searchLibrary' },
              exact: true
            },
            {
              text: $i18n.locale == 'ee' ? library.title : library.title_en
            }
          ]"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              v-if="item.to"
              :exact="item.exact"
              :to="item.to"
            >
              <span class="grey--text text--darken-3 link">
                {{ item.text }}
              </span>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item v-else>{{ item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-fade-transition :hide-on-leave="true">
          <div>
            <v-card flat color="transparent" class="mb-4" v-if="library">
              <v-card-title
                class="title pt-1 pb-1 px-0 flex-column justify-center text-center font-family-exo-2 font-weight-medium text-h4"
              >
                <div class="text-h6 font-weight-regular">
                  {{ $t("common.virtualLibrary") }}
                </div>
                <div class="d-flex">
                  <div
                    class="text-h4 font-weight-medium"
                    style="word-break: normal"
                  >
                    {{
                      $i18n.locale === "ee" ? library.title : library.title_en
                    }}
                    <v-btn
                      link
                      icon
                      small
                      style="vertical-align: top;"
                      color="deep-orange darken-2"
                      class="d-print-none"
                      :href="
                        `https://edit.geocollections.info/library/${library.id}`
                      "
                      target="_blank"
                      rel="noopener"
                    >
                      <v-icon small>fas fa-edit</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="text-h6 font-weight-regular">
                  {{ $t("common.libraryCreatedBy") }}:
                  {{ library.author_txt }}

                  {{ library.year }}
                </div>
              </v-card-title>
            </v-card>
            <v-card
              class="ml-auto mr-auto px-1 pb-1"
              v-if="library"
              elevation="0"
              outlined
            >
              <v-card-text class="px-2">
                <div class="d-flex align-center pb-3">
                  <div class="text-h6">
                    {{ $t("common.citation") }}
                  </div>

                  <citation-select
                    style="max-width: 150px"
                    id="citationSelect"
                    class="ml-auto  py-0"
                  />
                </div>
                <base-citation-detail
                  class="mb-2"
                  :citation="citation($getWebpageCsl(library))"
                />
                <div
                  class="text-h6 mb-2"
                  v-if="
                    ($i18n.locale === 'ee' && library.abstract) ||
                      ($i18n.locale === 'en' && library.abstract_en)
                  "
                >
                  {{ $t("common.summary") }}
                </div>
                <div
                  v-if="
                    ($i18n.locale === 'ee' && library.abstract) ||
                      ($i18n.locale === 'en' && library.abstract_en)
                  "
                  v-translate="{
                    et: library.abstract,
                    en: library.abstract_en
                  }"
                />
                <div class="text-h6 mb-2">
                  {{ $t("common.libraryReferences") }}
                </div>
                <v-row no-gutters class="flex-nowrap">
                  <v-col v-if="!$vuetify.breakpoint.smAndDown">
                    <search-library-reference
                      :library="parseInt(id)"
                      @reset:search="handleResetSearch"
                      @update:data="handleSearch"
                    />
                  </v-col>
                  <v-col md="9" xl="10" class="ml-md-2">
                    <v-card flat outlined>
                      <reference-viewer
                        :options="options"
                        :count="count"
                        :data="results"
                        :is-loading="isLoading"
                        @update:data="getLibraryReferencesFromApi"
                        @update:options="handleOptionsUpdate"
                        @update:pagination="handlePaginationUpdate"
                      />
                    </v-card>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="auto" class="pt-2 pr-3">
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
            <v-card v-else-if="error">
              <v-card-actions class="libraryTitle">
                <v-col cols="auto" class="py-0 px-0">
                  <v-btn large icon @click="handleBack()" aria-label="back">
                    <v-icon>fas fa-arrow-left</v-icon>
                  </v-btn>
                </v-col>
                <div class="col titleText">
                  {{ $t("error.libraryId", { text: id }) }}
                </div>
              </v-card-actions>
            </v-card>
          </div>
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
      <search-library-reference
        class="my-3 mx-2"
        :library="parseInt(id)"
        @reset:search="handleResetSearch"
        @update:data="handleSearch"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { fetchLibrary, fetchLibraryReferences } from "@/utils/apiCalls";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import dateMixin from "@/mixins/dateMixin";
import isEqual from "lodash/isEqual";
import citationMixin from "@/mixins/citationMixin";
import CitationSelect from "@/components/CitationSelect";
import BaseCitationDetail from "@/components/base/BaseCitationDetail.vue";
import { mapActions, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import SearchLibraryReference from "../components/search/SearchLibraryReference.vue";
export default {
  name: "Library",
  components: {
    ReferenceViewer,
    CitationSelect,
    BaseCitationDetail,
    SearchLibraryReference
  },
  mixins: [dateMixin, citationMixin],
  data() {
    return {
      showSearch: false,
      id: this.$route.params.id,
      library: null,
      isLoading: true,
      error: false
    };
  },
  computed: {
    ...mapFields("search/libraryReference", ["options"]),
    ...mapState("search/libraryReference", ["search", "advancedSearch"]),
    ...mapState("result/libraryReference", ["results", "count"])
  },
  metaInfo() {
    return {
      title: this.library?.title,
      meta: [
        {
          property: "og:title",
          vmid: "og:title",
          content: this.library?.title
        }
      ]
    };
  },
  beforeDestroy() {
    this.resetSearch();
  },
  mounted() {
    this.getLibrary().then(res => {
      this.library = res;

      if (this.library === undefined) {
        this.error = true;
      }
    });
    this.getLibraryReferencesFromApi();
  },
  methods: {
    ...mapActions("result/libraryReference", {
      setLibraryReferenceResult: "setResult"
    }),
    ...mapActions("search/libraryReference", ["resetSearch", "resetPage"]),
    getLibrary() {
      return fetchLibrary(this.$route.params.id);
    },
    getLibraryReferencesFromApi() {
      this.isLoading = true;
      const searchObj = {
        search: this.search,
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      fetchLibraryReferences(this.id, searchObj).then(res => {
        this.setLibraryReferenceResult(res);
        this.isLoading = false;
      });
    },
    handleOptionsUpdate(event) {
      if (isEqual(this.options, event)) return;
      this.options = event;
      this.getLibraryReferencesFromApi();
    },
    handlePaginationUpdate(event) {
      this.options = event;
      this.getLibraryReferencesFromApi();
    },
    handleSearch(event) {
      this.resetPage();
      this.getLibraryReferencesFromApi();
    },
    handleResetSearch(event) {
      this.resetSearch(event);
      this.getLibraryReferencesFromApi();
    }
  }
};
</script>

<style scoped>
.libraryTitle {
  background-color: #a5bac4;
}

.titleText {
  word-break: normal;
}

.roundedBorder {
  border-radius: 12px;
}

.body {
  border-radius: 12px;
  border-width: 4px;
  border-color: #a5bac4;
  border-style: solid;
  background-color: white;
}

.exitButton:hover {
  color: #f44336;
}
</style>
