<template>
  <v-tabs
    :vertical="$vuetify.breakpoint.xsOnly"
    grow
    background-color="#F6EDDF"
    color="#924F11"
    ref="tabs"
  >
    <v-tab active-class="active" link :to="{ name: 'searchReference' }">{{
      referenceTabTitle
    }}</v-tab>
    <v-tab active-class="active" link :to="{ name: 'searchLibrary' }">{{
      libraryTabTitle
    }}</v-tab>
  </v-tabs>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Tabs",
  computed: {
    ...mapState({
      referenceCount: state => state.references.count,
      libraryCount: state => state.library.count
    }),
    referenceTabTitle() {
      return `${this.$t("tabs.references")} (${this.referenceCount})`;
    },
    libraryTabTitle() {
      return `${this.$t("tabs.libraries")} (${this.libraryCount})`;
    }
  },
  watch: {
    referenceTabTitle: {
      handler() {
        this.$refs.tabs.callSlider();
      }
    },
    libraryTabTitle: {
      handler() {
        this.$refs.tabs.callSlider();
      }
    }
  }
};
</script>

<style scoped>
.active {
  background-color: #eedbbf;
  border-radius: 12px 12px 0px 0px;
}

.v-tab:hover::before {
  border-radius: 12px 12px 0px 0px;
}
</style>
