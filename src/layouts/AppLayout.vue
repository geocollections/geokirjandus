<template>
  <div>
    <app-header
      class="d-print-none"
      :color="$vuetify.theme.themes.light.secondary"
      @toggle:navigationDrawer="showMobileNavigation = !showMobileNavigation"
    />
    <app-navigation-mobile
      :show="showMobileNavigation"
      @update:navigationDrawer="showMobileNavigation = $event"
    />
    <v-main class="main mt-2 mt-md-5" style="min-height: 100vh">
      <scroll-to-top />
      <router-view />
    </v-main>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppFooter from "../components/AppFooter.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import AppNavigationMobile from "../components/AppNavigationMobile.vue";

export default {
  name: "AppLayout",
  components: { AppHeader, AppFooter, ScrollToTop, AppNavigationMobile },
  data() {
    return {
      showMobileNavigation: false
    };
  }
};
</script>

<style scoped>
.main {
  background-color: var(--v-primary-base);
}
</style>
