<template>
  <div class="px-1 px-sm-2">
    <data-viewer
      :module="$route.meta.object"
      :data="result"
      :count="count"
      :page="1"
      :is-loading="isLoading"
      :paginate-by="100"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :headers="libraryHeaders"
      :title="
        count !== 1
          ? 'viewer.title.library_html'
          : 'viewer.title.library_single_html'
      "
      :copy-button="false"
      :helpers="false"
      v-on:open="open"
      v-on:update:paginateBy="updatePaginateBy"
      v-on:update:page="updatePage"
      v-on:update:sortBy="updateSortBy"
      v-on:update:sortDesc="updateSortDesc"
      v-on:update:headers="handleUpdateTableHeaders"
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
import debounce from "lodash/debounce";
import LibraryListView from "@/components/library/LibraryListView";
import DataViewer from "@/components/DataViewer";
import dateMixin from "@/mixins/dateMixin";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";

export default {
  name: "LibraryViewer",
  components: {
    LibraryListView,
    DataViewer,
  },
  mixins: [dateMixin, urlMixin, queryMixin],
  props: {
    showLibraries: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoading: false,
      result: [],
    };
  },
  computed: {
    ...mapState("librarySearch", ["sortBy", "sortDesc"]),
    ...mapState("library", ["count"]),
    ...mapState("tableSettings", ["libraryHeaders"]),
  },
  watch: {
    page: {
      handler: debounce(function() {
        this.handleLibrariesResult();
      }, 300),
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.handleLibrariesResult();
      },
    },
    sortDesc: {
      handler() {
        this.handleLibrariesResult();
      },
    },
    libraryParameters: {
      handler: debounce(function() {
        this.handleLibrariesResult();
      }, 300),
      deep: true,
    },
    referenceParameters: {
      handler: debounce(function() {
        this.getReferences();
      }, 300),
      deep: true,
    },
  },
  created() {
    this.handleLibrariesResult();
    this.getReferences();
  },
  methods: {
    ...mapActions("librarySearch", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetPage",
    ]),
    ...mapActions("tableSettings", ["setLibraryHeaders"]),
    handleLibrariesResult() {
      this.isLoading = true;

      this.getLibraries().then((res) => {
        this.result = res.results;
        this.isLoading = false;
      });
    },
    handleUpdateTableHeaders(event) {
      this.setLibraryHeaders(event);
    },
    open(event) {
      this.$router.push(`/library/${event.id}`);
    },
  },
};
</script>
