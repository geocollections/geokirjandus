<template>
  <v-container>
    <v-row>
      <v-col>
        <v-fade-transition :hide-on-leave="true">
          <v-card id="view" elevation="2" class="roundedBorder">
            <tabs id="tabs" />
            <library-viewer style="background-color: #a5bac4" />
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import queryMixin from "@/mixins/queryMixin";
import Tabs from "@/components/Tabs";
import LibraryViewer from "@/components/library/LibraryViewer";
export default {
  name: "Home",
  components: { Tabs, LibraryViewer },
  mixins: [queryMixin],
  data() {
    return {
      showSearch: this.$vuetify.breakpoint.mdAndUp,
      showAdvancedSearch: true,
      isPrint: false,
      printResult: []
    };
  },
  metaInfo: {
    title: "Otsing"
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
    ...mapActions("search", [
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
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/resetSearch", event);
      else this.resetSearch(event);
    }
  }
};
</script>

<style scoped>
/* @media (min-width: 1904px) {
  .card {
    max-width: 1400px !important;
  }
} */

.main {
  background-color: #f6eddf;
}

.roundedBorder {
  border-radius: 12px;
}
.roundedBorderMobile {
  border-radius: 0 12px 12px 12px;
}
</style>
