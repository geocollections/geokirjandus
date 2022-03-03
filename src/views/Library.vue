<template>
  <v-container>
    <v-row justify="center">
      <v-col class="px-2 px-sm-3">
        <v-fade-transition :hide-on-leave="true">
          <v-card
            class="ml-auto mr-auto  card roundedBorder libraryTitle px-1 pb-1 px-sm-2 pb-sm-2"
            v-if="library"
          >
            <v-card-title
              class="pt-1 pb-1 pr-1 d-flex text-center libraryTitle"
            >
              <v-col cols="auto" class="px-0">
                <v-btn large icon @click="handleBack()" aria-label="back">
                  <v-icon>fas fa-arrow-left</v-icon>
                </v-btn>
              </v-col>
              <div class="d-flex flex-column col">
                <h5>{{ $t("common.virtualLibrary") }}</h5>
                <div
                  class="col titleText"
                  v-translate="{ et: library.title, en: library.title_en }"
                />

                <h6 class="">
                  {{ $t("common.libraryCreatedBy") }}:
                  {{ library.author_txt }}
                  {{ library.year }}
                </h6>
              </div>
              <v-col cols="auto" class="py-0 px-0 d-flex align-self-start">
                <v-btn @click="exit" class="exitButton" icon>
                  <v-icon>fas fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-card-title>
            <div class="body elevation-0">
              <v-card-actions
                class="pr-2 px-4 d-flex justify-end flex-column flex-sm-row"
              >
                <v-chip
                  outlined
                  color="blue-grey darken-3"
                  class="d-print-none mr-auto mr-sm-1 my-1"
                  :href="
                    `https://edit.geocollections.info/library/${library.id}`
                  "
                  target="_blank"
                  rel="noopener"
                >
                  <v-icon small class="pr-1">fas fa-edit</v-icon>
                  <b>{{ $t("common.edit") }}</b>
                </v-chip>
              </v-card-actions>

              <v-card-text class="pt-0">
                <div class="d-flex align-center pb-3">
                  <h3 class="">
                    <b>{{ $t("common.citation") }}</b>
                  </h3>

                  <citation-select id="citationSelect" class="col-sm-3 py-0" />
                </div>
                <base-citation-detail
                  :citation="citation($getWebpageCsl(library))"
                />
                <h3
                  class="mt-3"
                  v-if="
                    ($i18n.locale === 'ee' && library.abstract) ||
                      ($i18n.locale === 'en' && library.abstract_en)
                  "
                >
                  <b>{{ $t("common.summary") }}</b>
                </h3>
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
                <h3>
                  <b>{{ $t("common.libraryReferences") }}</b>
                </h3>
              </v-card-text>

              <v-card class="mx-2 mx-sm-3 roundedBorder" color="#a5bac4">
                <reference-viewer />
              </v-card>
              <v-card-text class="">
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
            </div>
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
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fetchLibrary } from "@/utils/apiCalls";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import dateMixin from "@/mixins/dateMixin";
import citationMixin from "@/mixins/citationMixin";
import LibraryCitation from "@/components/library/LibraryCitation";
import queryMixin from "@/mixins/queryMixin";
import CopyButton from "@/components/CopyButton";
import CitationSelect from "@/components/CitationSelect";
import BaseCitationDetail from "@/components/base/BaseCitationDetail.vue";
export default {
  name: "Library",
  components: {
    ReferenceViewer,
    CitationSelect,
    BaseCitationDetail
  },
  mixins: [dateMixin, citationMixin, queryMixin],
  data() {
    return {
      id: this.$route.params.id,
      library: null,
      isLoading: true,
      error: false
    };
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
  created() {
    this.getLibrary().then(res => {
      this.library = res;

      if (this.library === undefined) {
        this.error = true;
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "searchLibrary")
        vm.$store.dispatch(
          `libraryReferenceSearch/resetLibraryReferenceSearch`
        );
      const currentLibrary = vm.$store.state.library.currentLibrary;

      if (to.params.id !== currentLibrary) {
        vm.$store.dispatch(`libraryReferenceSearch/resetPage`);
        vm.$store.dispatch(`libraryReferenceSearch/updateSortBy`, [
          "author",
          "year"
        ]);
        vm.$store.dispatch(`libraryReferenceSearch/updateSortDesc`, [
          false,
          false
        ]);

        vm.$store.dispatch("library/setCurrentLibrary", to.params.id);
      }
    });
  },
  methods: {
    exit() {
      this.$router.replace({ name: "searchLibrary" }).catch(() => {});
    },
    getLibrary() {
      return fetchLibrary(this.$route.params.id);
    },
    handleBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
@media (min-width: 1904px) {
  .card {
    max-width: 1400px !important;
  }
}

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
  background-color: white;
}

.exitButton:hover {
  color: #f44336;
}
</style>
