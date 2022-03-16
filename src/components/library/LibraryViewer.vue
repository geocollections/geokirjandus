<template>
  <div>
    <data-viewer
      border-color="transparent"
      style="border-width: 0px"
      :module="$route.meta.object"
      :data="results"
      :count="count"
      :is-loading="isLoading"
      :headers="libraryHeaders"
      :nothing-found="$t('error.nothingFoundLibrary')"
      :title="
        count !== 1
          ? 'viewer.title.library_html'
          : 'viewer.title.library_single_html'
      "
      :options.sync="options"
      @open="open"
      @update:paginateBy="handleUpdatePaginateBy"
      @update:page="handleUpdatePage"
      @update:headers="handleUpdateTableHeaders"
      @reset:headers="
        resetHeaders({
          module: 'libraryHeaders',
          options: { sortBy: options.sortBy }
        })
      "
    >
      <!--  TABLE VIEW CUSTOM TEMPLATES  -->
      <template v-slot:item.bookJournal="{ item }">
        <div v-if="item.book">{{ item.book }}</div>
        <div v-else-if="item.journal__journal_name">
          {{ item.journal__journal_name }}
        </div>
      </template>
      <template v-slot:item.date_changed="{ item }">
        {{ formatDate(item.date_changed) }}
      </template>
      <template v-slot:item.date_added="{ item }">
        {{ formatDate(item.date_added) }}
      </template>
      <!--  LIST VIEW TEMPLATE  -->
      <template v-slot:list-view="{ data }">
        <library-list-view :data="data"></library-list-view>
      </template>
    </data-viewer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import LibraryListView from "@/components/library/LibraryListView";
import DataViewer from "@/components/DataViewer";
import dateMixin from "@/mixins/dateMixin";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import { fetchLibraries } from "@/utils/apiCalls";

export default {
  name: "LibraryViewer",
  components: {
    LibraryListView,
    DataViewer
  },
  mixins: [dateMixin, urlMixin, queryMixin],
  props: {
    showLibraries: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: true
    };
  },
  computed: {
    ...mapFields("search/library", ["options"]),
    ...mapState("search/library", ["search", "advancedSearch"]),
    ...mapState("library", ["count", "results"]),
    ...mapState("tableSettings", ["libraryHeaders"])
  },
  watch: {
    options: {
      handler() {
        this.getLibrariesFromApi();
      },
      deep: true
    }
  },
  created() {
    this.getLibrariesFromApi();
  },
  methods: {
    ...mapActions("search/library", [
      "updatePage",
      "updatePaginateBy",
      "updateOptions",
      "resetPage"
    ]),
    ...mapActions("tableSettings", ["setLibraryHeaders"]),
    handleUpdateTableHeaders(event) {
      this.setLibraryHeaders(event);
    },
    handleUpdatePage(event) {
      this.updatePage(event);
    },
    handleUpdatePaginateBy(event) {
      this.updatePaginateBy(event);
    },
    getLibrariesFromApi() {
      const searchObj = {
        search: this.search,
        page: this.options.page,
        paginateBy: this.options.paginateBy,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      fetchLibraries(searchObj).then(res => {
        this.setLibraries(res);
        this.isLoading = false;
      });
    },
    open(event) {
      this.$router.push(`/library/${event.id}`);
    }
  }
};
</script>
