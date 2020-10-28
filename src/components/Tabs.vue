<template>
  <v-tabs grow background-color="#F2E4CF" color="#ECA15B">
    <v-tab :to="{ path: 'reference', query: this.$route.query }">{{
      `${$t("tabs.references")} (${referenceCount})`
    }}</v-tab>
    <v-tab :to="{ path: 'library', query: this.$route.query }">{{
      `${$t("tabs.libraries")} (${libraryCount})`
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
    })
  }
};
</script>

<style scoped></style>
