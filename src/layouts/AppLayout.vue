<template>
  <div>
    <app-header
      class="d-print-none"
      v-on:update:showSearch="showSearch = !showSearch"
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
    <v-main class="main fill-height">
      <router-view style="min-height: 100vh" />
      <app-footer />
    </v-main>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "../components/AppFooter.vue";
import Fabs from "@/components/Fabs";
import Search from "@/components/Search";
import queryMixin from "@/mixins/queryMixin";

export default {
  name: "AppLayout",
  components: { AppHeader, Search, AppFooter, Fabs },
  mixins: [queryMixin],
  data() {
    return {
      showSearch: this.$vuetify.breakpoint.mdAndUp,
      showAdvancedSearch: true
    };
  },
  metaInfo: {
    title: "Otsing"
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
.main {
  background-color: #f6eddf;
}
</style>
