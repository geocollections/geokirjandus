<template>
  <v-tabs
    :vertical="$vuetify.breakpoint.xsOnly"
    grow
    background-color="#E5C99F"
    color="#B76315"
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
  background-color: #f6eddf;
}
</style>
