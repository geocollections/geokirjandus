<template>
  <v-app-bar
    clipped-left
    app
    class="appBar"
    style="z-index: 9998"
    :src="require('@/assets/books4.jpg')"
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top, rgba(229, 129, 36, 0.4), rgba(0, 0, 0, 0.40)"
      ></v-img>
    </template>
    <v-btn
      id="showSearch"
      aria-label="show search"
      v-if="$vuetify.breakpoint.mdAndUp"
      @click="$emit('update:showSearch')"
      icon
      dark
    >
      <v-icon class="search">fas fa-search</v-icon>
    </v-btn>
    <v-toolbar-title style="text-shadow: 2px 2px 10px black;">
      <a class="title" @click="goToLanding">
        {{ $t("title2") }}
      </a>
    </v-toolbar-title>
    <v-spacer />
    <tour v-if="$vuetify.breakpoint.smAndUp" />
    <links v-if="$vuetify.breakpoint.smAndUp" />
    <lang-buttons v-if="$vuetify.breakpoint.smAndUp" :is-dark="false" />
    <emaapou-button class="mx-2" />
    <!--  MOBILE MENU  -->
    <v-menu
      v-if="!$vuetify.breakpoint.smAndUp"
      transition="slide-y-transition"
      offset-y
      bottom
      right
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark v-bind="attrs" v-on="on">
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
      </template>
      <v-list color="#F6EDDF" class="text-center">
        <div class="pb-2">
          <tour :isDark="false" />
        </div>
        <div class="pb-2">
          <links :isDark="false" />
        </div>
        <div class="px-3">
          <lang-buttons />
        </div>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import LangButtons from "@/components/LangButtons";
import Links from "@/components/Links";
import Tour from "@/components/Tour";
import EmaapouButton from "./EmaapouButton.vue";
export default {
  name: "AppHeader",
  components: { Tour, Links, LangButtons, EmaapouButton },
  methods: {
    goToLanding() {
      this.$router.replace({ name: "landing" }).catch(() => {});
    },
  },
};
</script>

<style scoped lang="sass">
@import 'src/sass/variables.sass'

.appBar
  background-color: $primary-color !important
  border-color: $primary-color

.title
  color: whitesmoke !important
  cursor: pointer

.search
  color: whitesmoke !important
</style>
