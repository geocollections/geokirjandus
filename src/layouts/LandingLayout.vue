<template>
  <div>
    <app-header
      absolute
      color="transparent"
      class="d-print-none"
      @toggle:navigationDrawer="showMobileNavigation = !showMobileNavigation"
    />
    <app-navigation-mobile
      :show="showMobileNavigation"
      @update:navigationDrawer="showMobileNavigation = $event"
    />
    <v-main class="main pt-0" style="min-height: 100vh">
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
  name: "LandingLayout",
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
  background-color: #fffcf8;
}
</style>
