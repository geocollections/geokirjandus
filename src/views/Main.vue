<template>
  <div class="home fill-height">
    <div class="d-print-none fill-height">
      <app-header
        class="d-print-none"
        v-on:update:showSearch="showSearch = !showSearch"
        v-on:home="resetSearch"
      />
      <v-navigation-drawer
        v-model="showSearch"
        app
        bottom
        clipped
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
          <div class="container">
            <v-card
              v-if="
                $route.name === 'searchReference' ||
                  $route.name === 'searchLibrary'
              "
              elevation="4"
              class=" my-1 roundedBorder"
              color="#EEDBBF"
            >
              <router-view name="tabs" />
              <router-view />
            </v-card>
            <router-view v-else />
          </div>
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
      this.getReferences().then(res => {
        this.printResult = res.results;
      });
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
        this.$store.dispatch("librarySearch/updateSearch", event);
      else this.updateSearch(event);
    },
    handleUpdateAdvancedSearch(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("librarySearch/updateAdvancedSearch", event);
      else this.updateAdvancedSearch(event);
    },
    handleResetSearch(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("librarySearch/resetSearch", event);
      else this.resetSearch(event);
    }
  }
};
</script>

<style scoped>
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}

.main {
  background-color: #f6eddf;
}

.roundedBorder {
  border-radius: 12px;
}
</style>
