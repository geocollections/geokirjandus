<template>
  <!-- COLORS: #eba142,#A44A3F, #FF9F1C, #D36135, #FF8C42, #F7934C -->
  <v-app-bar
    elevation="0"
    v-bind="$attrs"
    flat
    app
    clipped-right
    hide-on-scroll
    class="mx-1 mx-auto"
    :color="color"
    style="z-index: 9998"
    extension-height="48"
    height="48"
  >
    <template #extension v-if="isMobile">
      <v-toolbar-items class="py-1 px-0" style="width: 100%" v-if="isMobile">
        <v-btn
          class="text-capitalize text-body-1 mr-1 rounded font-weight-medium"
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
          class="text-capitalize text-body-1 rounded font-weight-medium"
          style="font-family: 'Exo 2' !important"
          active-class="active-app-bar-btn"
          :ripple="false"
          dark
          text
          link
          :to="{ name: 'searchLibrary' }"
        >
          <v-icon left>fas fa-warehouse</v-icon>
          {{ $t("tabs.libraries") }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="rounded"
          icon
          dark
          :ripple="false"
          aria-label="Open navigation drawer"
          @click.stop="$emit('toggle:navigationDrawer')"
        >
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
      </v-toolbar-items>
    </template>
    <v-toolbar-title
      tag="a"
      @click="goToLanding"
      class="title white--text text-capitalize d-flex align-center font-weight-medium text-h6 pr-4"
    >
      {{ $t("title2") }}
    </v-toolbar-title>
    <v-toolbar-items v-if="!isMobile" class="ml-4 py-1">
      <v-btn
        class="text-capitalize text-body-1 mr-1 rounded font-weight-medium"
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
        class="text-capitalize text-body-1  rounded font-weight-medium"
        style="font-family: 'Exo 2' !important"
        active-class="active-app-bar-btn "
        :ripple="false"
        dark
        text
        link
        :to="{ name: 'searchLibrary' }"
      >
        <v-icon left>fas fa-warehouse</v-icon>
        {{ $t("tabs.libraries") }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items class="py-1">
      <!-- <tour v-if="$vuetify.breakpoint.mdAndUp" class="rounded mr-1" /> -->
      <links v-if="$vuetify.breakpoint.mdAndUp" />
      <lang-buttons v-if="$vuetify.breakpoint.mdAndUp" :is-dark="false" />
      <emaapou-button v-if="$vuetify.breakpoint.mdAndUp" class="rounded" />
      <v-btn
        v-if="$vuetify.breakpoint.smOnly"
        class="rounded"
        icon
        dark
        :ripple="false"
        aria-label="Open navigation drawer"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <v-icon>fas fa-bars</v-icon>
      </v-btn>
    </v-toolbar-items>
    <!--  MOBILE MENU  -->
    <!-- <v-menu
      v-if="!$vuetify.breakpoint.mdAndUp"
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
    </v-menu> -->
  </v-app-bar>
</template>

<script>
import LangButtons from "@/components/LangButtons";
import Links from "@/components/Links";
import EmaapouButton from "./EmaapouButton.vue";
export default {
  name: "AppHeader",
  components: { Links, LangButtons, EmaapouButton },
  props: {
    color: {
      type: String,
      default: "#FF9F1C"
    }
  },
  computed: {
    maxWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return "1785px";
      if (this.$vuetify.breakpoint.lgOnly) return "1185px";
      if (this.$vuetify.breakpoint.mdOnly) return "900px";
      return "2000px";
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
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

// .v-toolbar ::v-deep .v-toolbar__extension {
//   background-color: #ff9f1c;
// }

.active-app-bar-btn::after {
  position: absolute;
  content: "";
  bottom: 0%;
  height: 3px;
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  background-color: #135ebf;

  // border-color: #135ebf;
  // border-bottom-style: solid;
  // border-bottom-width: 2px;
}
.v-toolbar ::v-deep .v-toolbar__extension {
  padding-right: 5px;
  padding-left: 5px;
  &.v-btn {
    height: 40px;
  }
}
.app-bar-btn {
  border-radius: 4px;
  height: 40px !important;
}
</style>
