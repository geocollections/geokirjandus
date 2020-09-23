<template>
  <div class="home">
    <div class="d-print-none">
      <app-header class="d-print-none" />
      <v-navigation-drawer
        v-model="showSearch"
        app
        bottom
        clipped
        disable-route-watcher
        mobile-breakpoint="960"
        width="400px"
        class="d-print-none"
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
      <fabs
        :show-search="showSearch"
        v-on:update:showSearch="showSearch = !showSearch"
      />
      <v-main>
        <v-container>
          <v-row>
            <v-col class="">
              <list-module-core
                :module="$route.meta.object"
                :data="result"
                :count="count"
                :parameters="parameters"
                :page="page"
                :is-loading="isLoading"
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
    <div class="d-none d-print-block">
      <list-view :data="result"></list-view>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { fetchReferences } from "@/utils/apiCalls";
import ListModuleCore from "@/components/ListModuleCore";
import { mapState, mapActions } from "vuex";
import TableViewSearch from "@/components/TableViewSearch";

import Fabs from "@/components/Fabs";
import ListView from "@/components/ListView";
import debounce from "lodash/debounce";
export default {
  name: "Home",
  components: {
    ListView,
    Fabs,
    TableViewSearch,
    ListModuleCore,
    AppHeader
  },
  data() {
    return {
      showSearch: true,
      showAdvancedSearch: true,
      isLoading: false
    };
  },
  watch: {
    parameters: {
      handler() {
        this.resetPage();
        this.fetch();
      },
      deep: true
    },
    page: {
      handler() {
        this.fetch();
      },
      immediate: true,
      deep: true
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.fetch();
      },
      deep: true
    },
    sortBy: {
      handler() {
        this.fetch();
      },
      deep: true
    },
    sortDesc: {
      handler() {
        this.fetch();
      },
      deep: true
    }
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
    ...mapState("references", ["result", "count"]),
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
    ...mapActions("references", ["setReferences"]),
    fetch: debounce(function() {
      this.isLoading = true;
      fetchReferences({
        search: this.search,
        page: this.page,
        paginateBy: this.paginateBy,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      })
        .then(
          response => {
            this.setReferences(response);
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        )
        .finally(() => {
          let q = Object.fromEntries(
            Object.entries(this.parameters)
              .filter(([_, v]) => {
                return v.active ? v.value : null;
              })
              .map(([k, v]) => {
                if (k === "year") {
                  return [k, `${v.value[0]}-${v.value[1]}`];
                }

                return k === "search"
                  ? [k, v.value]
                  : [`${k}_${v.lookUpType}`, v.value];
              })
          );
          console.log(q);
          if (this.page > 1) {
            q.page = this.page;
          }
          q.paginateBy = this.paginateBy;
          this.$router.push({ query: q }).catch(() => {});
        });
    }, 500)
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
