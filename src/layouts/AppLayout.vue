<template>
  <div>
    <app-header
      class="d-print-none"
      @toggle:navigationDrawer="showMobileNavigation = !showMobileNavigation"
    />
    <app-navigation-mobile
      :show="showMobileNavigation"
      @update:navigationDrawer="showMobileNavigation = $event"
    />
    <v-main class="main fill-height mt-2 mt-md-5">
      <scroll-to-top />
      <router-view style="min-height: 100vh" />
    </v-main>
    <app-footer />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "../components/AppFooter.vue";
import Fabs from "@/components/Fabs";
import queryMixin from "@/mixins/queryMixin";
import ScrollToTop from "@/components/ScrollToTop.vue";
import AppNavigationMobile from "../components/AppNavigationMobile.vue";

export default {
  name: "AppLayout",
  components: { AppHeader, AppFooter, ScrollToTop, AppNavigationMobile },
  mixins: [queryMixin],
  data() {
    return {
      showMobileNavigation: false
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
  background-color: #fffcf8;
}
</style>
