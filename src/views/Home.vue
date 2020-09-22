<template>
  <div class="home">
    <app-header />
    <v-navigation-drawer
      app
      bottom
      clipped
      mobile-breakpoint="960"
      width="400px"
    >
      <template v-slot:default>
        <table-view-search
          :show-advanced-search="showAdvancedSearch"
          v-on:update:showAdvancedSearch="showAdvancedSearch = $event"
          :col-size="12"
          :search="search"
          :advanced-search="advancedSearch"
          v-on:update:search="updateSearch"
          v-on:update:advancedSearch="updateAdvancedSearch"
          v-on:reset:parameters="resetSearch"
        />
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <v-row>
          <v-col class="">
            <list-module-core
              :module="$route.meta.object"
              :api-call="fetchReferences"
              :parameters="parameters"
              :page="page"
              :paginateBy="paginateBy"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              v-on:update:paginateBy="updatePaginateBy"
              v-on:update:page="updatePage"
              v-on:reset:page="resetPage"
              v-on:update:sortBy="updateSortBy"
              v-on:update:sortDesc="updateSortDesc"
            >
            </list-module-core>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { fetchReferences } from "@/utils/apiCalls";
import ListModuleCore from "@/components/ListModuleCore";
import { mapState, mapActions } from "vuex";
import TableViewSearch from "@/components/TableViewSearch";
export default {
  name: "Home",
  components: {
    TableViewSearch,
    ListModuleCore,
    AppHeader
  },
  data() {
    return {
      showAdvancedSearch: true
    };
  },
  computed: {
    ...mapState("search", [
      "search",
      "advancedSearch",
      "page",
      "paginateBy",
      "sortBy",
      "sortDesc"
    ]),
    parameters() {
      return { ...this.advancedSearch.byIds, search: this.search };
    },
    fields() {
      return this.advancedSearch.allIds.map(id => {
        return this.advancedSearch.byIds[id];
      });
    }
  },
  created() {
    if (this.$route.query) {
      this.setSearchFromURL(this.$route.query);
    }
  },
  methods: {
    ...mapActions("search", [
      "setSearchFromURL",
      "updateSearch",
      "updateAdvancedSearch",
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetSearch",
      "resetPage"
    ]),
    fetchReferences() {
      return fetchReferences({
        search: this.search,
        page: this.page,
        paginateBy: this.paginateBy,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      });
    }
  }
};
</script>

<style scoped>
@media (min-width: 1904px) {
  .container {
    max-width: 1264px !important;
  }
}
</style>
