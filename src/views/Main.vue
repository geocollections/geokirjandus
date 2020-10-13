<template>
  <div class="home">
    <div class="d-print-none">
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
      <v-main>
        <v-expand-transition>
          <router-view :search="search" :advancedSearch="advancedSearch" />
        </v-expand-transition>
        <v-footer
          color="white"
          padless
          :style="{ height: $vuetify.breakpoint.mdAndUp ? '100px' : '125px' }"
        >
        </v-footer>
      </v-main>
    </div>
    <div v-if="isPrint" class="d-none d-print-block">
      <reference-list-view :data="result"></reference-list-view>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { mapState, mapActions } from "vuex";
import Search from "@/components/Search";
import Fabs from "@/components/Fabs";
import ReferenceListView from "@/components/reference/ReferenceListView";

export default {
  name: "Home",
  components: {
    ReferenceListView,
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
.container--fluid {
  max-width: 100%;
}
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}
</style>
