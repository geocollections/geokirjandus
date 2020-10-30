<template>
  <v-tabs grow background-color="#E5C99F" color="#B76315">
    <v-tab
      active-class="active"
      link
      :to="{ path: 'reference', query: this.$route.query }"
      >{{ `${$t("tabs.references")} (${referenceCount})` }}</v-tab
    >
    <v-tab
      active-class="active"
      link
      :to="{ path: 'library', query: this.$route.query }"
      >{{ `${$t("tabs.libraries")} (${libraryCount})` }}</v-tab
    >
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

<style scoped>
.active {
  background-color: #f6eddf;
}
</style>
