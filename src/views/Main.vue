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
            :search="search"
            :advanced-search="advancedSearch"
            v-on:update:search="updateSearch"
            v-on:update:advancedSearch="updateAdvancedSearch"
            v-on:reset:parameters="resetSearch"
          />
        </template>
      </v-navigation-drawer>
      <fabs
        :show-search="showSearch"
        v-on:update:showSearch="showSearch = !showSearch"
      />
      <v-main class="fill-height" style="background-color: #F6EDDF">
        <div class="fill-height d-flex flex-wrap align-content-space-between">
          <router-view :search="search" :advancedSearch="advancedSearch" />
          <app-footer />
        </div>
      </v-main>
    </div>
    <div v-if="isPrint" class="d-none d-print-block">
      <reference-list-print-view :data="result"></reference-list-print-view>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { mapState, mapActions } from "vuex";
import Search from "@/components/Search";
import Fabs from "@/components/Fabs";
import ReferenceListPrintView from "@/components/reference/ReferenceListPrintView";
import AppFooter from "@/components/AppFooter";

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
    };
    window.onafterprint = () => {
      this.isPrint = false;
    };
  },
  data() {
    return {
      showSearch: this.$vuetify.breakpoint.mdAndUp,
      showAdvancedSearch: true,
      isPrint: false
    };
  },
  computed: {
    ...mapState("search", ["search", "advancedSearch"]),
    ...mapState("references", ["result"]),
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
      "setSearchFromURL",
      "updateSearch",
      "updateAdvancedSearch",
      "resetSearch",
      "resetPage"
    ]),
    ...mapActions("references", ["setReferences"])
  }
};
</script>

<style scoped>
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}
</style>
