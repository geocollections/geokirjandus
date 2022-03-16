<template>
  <v-app-bar
    elevation="2"
    app
    absolute
    class=" mx-1 mx-auto"
    color="#eba142"
    style="z-index: 9998"
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top, rgba(225, 159, 61, 0.9), rgba(225, 159, 61, 0.9)"
      ></v-img>
    </template>
    <v-toolbar-title
      tag="a"
      @click="goToLanding"
      class="title white--text text-capitalize d-flex align-center font-weight-medium text-h6 pr-4"
    >
      {{ $t("title2") }}
    </v-toolbar-title>
    <v-toolbar-items class="ml-4">
      <v-btn
        class="text-capitalize text-body-1 font-weight-medium"
        style="font-family: 'Exo 2' !important"
        active-class="active-app-bar-btn "
        :ripple="false"
        dark
        text
        link
        :to="{ name: 'searchReference' }"
      >
        <v-icon left>fas fa-book</v-icon>
        {{ $t("tabs.references") }}
      </v-btn>

      <v-btn
        class="text-capitalize text-body-1 font-weight-medium"
        style="font-family: 'Exo 2' !important"
        active-class="active-app-bar-btn "
        :ripple="false"
        dark
        text
        link
        :to="{ name: 'searchLibrary' }"
      >
        {{ $t("tabs.libraries") }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <tour v-if="$vuetify.breakpoint.smAndUp" />
      <links v-if="$vuetify.breakpoint.smAndUp" />
      <lang-buttons v-if="$vuetify.breakpoint.smAndUp" :is-dark="false" />
      <emaapou-button />
    </v-toolbar-items>
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
          <tour :isDark="false" class="pb-2" />
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
  computed: {
    maxWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return "1785px";
      if (this.$vuetify.breakpoint.lgOnly) return "1185px";
      if (this.$vuetify.breakpoint.mdOnly) return "900px";
      return "2000px";
    }
  },
  methods: {
    goToLanding() {
      this.$router.replace({ name: "landing" }).catch(() => {});
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/sass/variables.sass";

@media (min-width: 960px) {
  .v-toolbar ::v-deep .v-toolbar__content {
    max-width: 900px;
    padding-right: 0px;
    padding-left: 0px;
  }
}

@media (min-width: 1264px) {
  .v-toolbar ::v-deep .v-toolbar__content {
    max-width: 1185px;
  }
}
@media (min-width: 1905px) {
  .v-toolbar ::v-deep .v-toolbar__content {
    max-width: 1785px;
  }
}
.appBar {
  background-color: $primary-color !important;
  border-color: $primary-color;
}
.title {
  // color: white !important
  // text-shadow: 1px 1px 1px #F6EDDF
  cursor: pointer;
  font-family: "Exo 2", "Roboto", sans-serif !important;
}
.search {
  color: whitesmoke !important;
}
.v-toolbar ::v-deep .v-toolbar__content {
  margin-left: auto;
  margin-right: auto;
}

.active-app-bar-btn::after {
  position: absolute;
  content: "";
  bottom: 0%;
  height: 3px;
  width: 100%;
  // border-radius: 5px;
  background-color: #135ebf;
  // border-color: #135ebf;
  // border-bottom-style: solid;
  // border-bottom-width: 2px;
}
</style>
