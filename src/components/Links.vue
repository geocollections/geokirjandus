<template>
  <v-menu
    transition="slide-y-transition"
    offset-y
    bottom
    right
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-3" text :dark="isDark" v-bind="attrs" v-on="on">
        {{ $t("common.links") }}
      </v-btn>
    </template>
    <v-list color="#F6EDDF">
      <div v-for="(link, idx) in links" :key="idx">
        <v-list-item :href="link.url" target="_blank">
          <v-list-item-title>{{ $t(link.name) }}</v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "Links",
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
        { name: "link.sarvAPI", url: "https://api.geocollections.info" },
        { name: "link.sarvDOI", url: "https://doi.geocollections.info" },
        {
          name: "link.sarvEdit",
          url: "https://edit2.geocollections.info"
        },
        { name: "link.egt", url: "https://fond.egt.ee/fond" },
        { name: "link.natarc", url: "https://natarc.ut.ee" }
      ]
    };
  }
};
</script>
