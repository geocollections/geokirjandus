<template>
  <div class="home fill-height">
    <div class="d-print-none fill-height">
      <app-header
        class="d-print-none"
        v-on:update:showSearch="showSearch = !showSearch"
        v-on:home="resetSearch"
      />
      <v-navigation-drawer
        id="searchDrawer"
        v-model="showSearch"
        app
        bottom
        clipped
        width="276"
        disable-route-watcher
        mobile-breakpoint="960"
        class="d-print-none"
      >
        <template v-slot:default>
          <search
            :col-size="12"
            v-on:update:search="handleUpdateSearch"
            v-on:update:advancedSearch="handleUpdateAdvancedSearch"
            v-on:reset:parameters="handleResetSearch"
          />
        </template>
      </v-navigation-drawer>
      <fabs
        :show-search="showSearch"
        v-on:update:showSearch="showSearch = !showSearch"
      />
      <v-main class="fill-height main">
        <div class="fill-height d-flex flex-wrap align-content-space-between">
          <v-container fluid>
            <v-row class="d-flex justify-center">
              <v-col class="card py-0 px-2 px-sm-3">
                <v-fade-transition :hide-on-leave="true">
                  <v-card
                    id="view"
                    v-if="
                      $route.name === 'searchReference' ||
                        $route.name === 'searchLibrary'
                    "
                    elevation="4"
                    class="roundedBorder"
                    color="#F3D3A5"
                  >
                    <router-view id="tabs" name="tabs" />
                    <router-view />
                  </v-card>
                  <router-view v-else />
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-container>
          <app-footer />
        </div>
      </v-main>
    </div>
    <div v-if="isPrint" class="d-none d-print-block">
      <reference-list-print-view
        :data="printResult"
      ></reference-list-print-view>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { mapActions } from "vuex";
import Search from "@/components/Search";
import Fabs from "@/components/Fabs";
import ReferenceListPrintView from "@/components/reference/ReferenceListPrintView";
import AppFooter from "@/components/AppFooter";
import queryMixin from "@/mixins/queryMixin";

export default {
  name: "Home",
  components: {
    AppFooter,
    ReferenceListPrintView,
    Fabs,
    Search,
    AppHeader
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
  mixins: [queryMixin],
  data() {
    return {
      showSearch: this.$vuetify.breakpoint.mdAndUp,
      showAdvancedSearch: true,
      isPrint: false,
      printResult: []
    };
  },
  computed: {
    getDateLocale() {
      if (this.$i18n.locale === "ee") {
        return "et-EE";
      } else {
        return "en-GB";
      }
    }
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
@media (min-width: 1904px) {
  .card {
    max-width: 1400px !important;
  }
}

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
