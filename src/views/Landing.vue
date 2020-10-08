<template>
  <v-container fluid class="landing pa-0">
    <v-row class="header d-flex justify-center pb-5">
      <lang-buttons style="position: absolute" class="d-block ma-4"/>
      <v-col cols="4" class="text-center">
        <h1 class="white--text">{{ $t("title") }}</h1>
        <p class="white--text">{{ $t("subtitle") }}</p>
        <v-text-field
          v-model="searchStr"
          :label="$t('common.search')"
          prepend-inner-icon="fas fa-search"
          class="shrink"
          solo
        >
        </v-text-field>
        <v-btn class="mr-3" @click="search()">{{ $t("common.search") }}</v-btn>
        <v-btn to="/reference">View all references</v-btn>
      </v-col>
    </v-row>



  </v-container>
</template>

<script>
import LangButtons from "@/components/LangButtons";
export default {
  name: "Landing",
  components: {LangButtons},
  data() {
    return {
      searchStr: ""
    };
  },
  methods: {
    search() {
      this.$router.push({
        path: "/reference",
        query: { search: this.searchStr }
      });
    }
  }
};
</script>

<style scoped>
.header {
  background-image: url("https://files.geocollections.info/img/sarv-edit/background_1.jpg");
}
</style>
