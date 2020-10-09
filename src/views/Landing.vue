<template>
  <v-container fluid class="landing pa-0">
    <v-row class="header d-flex justify-center pb-5">
      <lang-buttons style="position: absolute" class="d-block ma-4" />
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
        <v-btn to="/reference">{{$t("common.viewReferences")}}</v-btn>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center ">
      <v-col cols="6">
        <v-card>
          <v-card-title>{{ $t("common.newest") }}</v-card-title>
          <v-expand-transition>
            <reference-list-view
              v-if="references"
              :data="references"
            ></reference-list-view>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LangButtons from "@/components/LangButtons";
import { fetchReferences } from "@/utils/apiCalls";
import ReferenceListView from "@/components/reference/ReferenceListView";
export default {
  name: "Landing",
  components: { ReferenceListView, LangButtons },
  data() {
    return {
      searchStr: "",
      references: null
    };
  },
  created() {
    this.getReferences();
  },
  methods: {
    search() {
      this.$router.push({
        path: "/reference",
        query: { search: this.searchStr }
      });
    },
    getReferences() {
      return fetchReferences({
        search: { id: "search", value: this.searchStr },
        paginateBy: 10
      }).then(res => {
        this.references = res.results;
      });
    }
  }
};
</script>

<style scoped>
.header {
  background-size: cover;
  background-image: url("https://files.geocollections.info/img/sarv-edit/background_1.jpg");
}
</style>
