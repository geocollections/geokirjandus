<template>
  <div>
    <v-card class="roundedBorder libraryTitle" v-if="library">
      <v-card-title class="pt-1 pb-1 d-flex text-center libraryTitle">
        <v-col cols="auto" class="py-0 px-0">
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
            {{ $t("common.libraryCreatedBy") }}: {{ library.author }}
            {{ library.year }}
          </h6>
        </div>
      </v-card-title>
      <div class="body elevation-4">
        <v-card-actions
          class="pr-2 px-4 d-flex justify-end flex-column flex-sm-row"
        >
          <v-chip
            outlined
            color="blue-grey darken-3"
            class="d-print-none mr-auto mr-sm-1 my-1"
            :href="`https://edit.geocollections.info/library/${library.id}`"
            target="_blank"
            rel="noopener"
          >
            <v-icon small class="pr-1">fas fa-edit</v-icon>
            <b>{{ $t("common.edit") }}</b>
          </v-chip>
        </v-card-actions>

        <v-card-text class="pt-0">
          <div class="d-flex pb-3">
            <h3 class="align-self-center">
              <b>{{ $t("common.citation") }}</b>
            </h3>
            <copy-button clipboard-class="libraryCitation" id="libraryCopy" />
          </div>
          <v-card flat outlined>
            <div class="pa-4">
              <library-citation class="libraryCitation" :library="library" />
            </div>
          </v-card>
        </v-card-text>
        <v-card-text v-if="library.abstract" class="pt-0">
          <h3>
            <b>{{ $t("common.summary") }}</b>
          </h3>
        </v-card-text>
        <v-card-text v-if="library.abstract" class="py-0">
          <div
            v-translate="{ et: library.abstract, en: library.abstract_en }"
          />
        </v-card-text>
        <v-card-text class="pb-0">
          <h3>
            <b>{{ $t("common.libraryReferences") }}</b>
          </h3>
        </v-card-text>
        <v-card
          elevation="4"
          class="mx-2 my-3 mx-sm-3 roundedBorder"
          color="#F3D3A5"
        >
          <reference-viewer />
        </v-card>
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
      </div>
    </v-card>
    <v-card v-if="error">
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
</template>

<script>
import { fetchLibrary } from "@/utils/apiCalls";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import dateMixin from "@/mixins/dateMixin";
import citationMixin from "@/mixins/citationMixin";
import LibraryCitation from "@/components/library/LibraryCitation";
import queryMixin from "@/mixins/queryMixin";
import CopyButton from "@/components/CopyButton";

export default {
  name: "Library",
  components: { CopyButton, LibraryCitation, ReferenceViewer },
  mixins: [dateMixin, citationMixin, queryMixin],
  data() {
    return {
      id: this.$route.params.id,
      library: null,
      isLoading: true,
      error: false
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "searchLibrary")
        vm.$store.dispatch(
          `libraryReferenceSearch/resetLibraryReferenceSearch`
        );
      vm.getLibrary().then(res => {
        vm.library = res.results[0];

        if (vm.library === undefined) {
          vm.error = true;
        }
      });
      vm.$store.dispatch(`libraryReferenceSearch/resetPage`);
      vm.$store.dispatch(`libraryReferenceSearch/updateSortBy`, [
        "author",
        "year"
      ]);
      vm.$store.dispatch(`libraryReferenceSearch/updateSortDesc`, [
        false,
        false
      ]);
    });
  },
  methods: {
    getLibrary() {
      return fetchLibrary(this.$route.params.id);
    },
    handleBack() {
      if (window.history.state === null) {
        this.$router.replace({ name: "searchLibrary" });
      } else {
        this.$router.back();
      }
    }
  }
};
</script>

<style scoped>
.libraryTitle {
  background-color: #cfc7b5;
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
</style>
