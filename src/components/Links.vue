<template>
  <v-menu
    content-class="mt-2"
    transition="slide-y-transition"
    offset-y
    bottom
    right
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mr-1 text-capitalize text-body-1 font-weight-medium rounded"
        style="font-family: 'Exo 2' !important"
        :class="btnClasses"
        text
        :dark="isDark"
        v-bind="attrs"
        v-on="on"
      >
        {{ $t("common.links") }}
      </v-btn>
    </template>
    <v-list class="py-1 px-2">
      <v-list-item class="header-menu-item pa-0 my-1">
        <emaapou-button
          black
          withText
          style="height: 48px;color: rgb(0, 0, 0, 0.87);width: 100%"
        />
      </v-list-item>
      <v-list-item
        v-for="(link, idx) in links"
        :key="idx"
        :href="link.url"
        target="_blank"
        class="header-menu-item rounded my-1"
      >
        <v-list-item-title class="font-family-exo-2">{{
          $t(link.name)
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import EmaapouButton from "./EmaapouButton.vue";
export default {
  name: "Links",
  components: { EmaapouButton },
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      links: [
        { name: "link.geocollections", url: "https://geocollections.info" },
        { name: "link.fossiilid", url: "https://fossiilid.info" },
        { name: "link.kivid", url: "https://kivid.info" },
        { name: "link.sarvAPI", url: "https://api.geoloogia.info" },
        { name: "link.sarvDOI", url: "https://doi.geocollections.info" },
        {
          name: "link.sarvEdit",
          url: "https://edit2.geocollections.info"
        },
        { name: "link.egt", url: "https://fond.egt.ee/fond" },
        { name: "link.natarc", url: "https://natarc.ut.ee" }
      ]
    };
  },
  computed: {
    btnClasses() {
      return {
        linksButton: this.isDark
      };
    }
  }
};
</script>

<style scoped>
/* .linksButton {
  backdrop-filter: blur(1px);
}
.linksButton::before {
  opacity: 0.1;
}
.linksButton:hover::before {
  opacity: 0.22;
} */
</style>
