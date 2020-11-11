<template>
  <v-container class="py-0">
    <v-row>
      <v-col class="px-1 pb-1 px-sm-2 pb-sm-2">
        <data-viewer
          :module="$route.meta.object"
          :data="result"
          :count="count"
          :page="1"
          :is-loading="isLoading"
          :paginate-by="100"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :headers="headers"
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
          v-on:update:headers="headers = $event"
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
          <!--  LIST VIEW TEMPLATE  -->
          <template v-slot:list-view="{ data }">
            <library-list-view :data="data"></library-list-view>
          </template>
        </data-viewer>
      </v-col>
    </v-row>
  </v-container>
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
    DataViewer
  },
  data() {
    return {
      isLoading: false,
      headers: [
        {
          text: `${this.$t("common.actions")}`,
          sortable: false,
          value: "actions",
          show: true,
          fixed: true
        },
        {
          text: `${this.$t("library.id")}`,
          value: "id",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("library.author")}`,
          value: "author",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("library.year")}`,
          value: "year",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("library.title")}`,
          value: "title",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("library.dateChanged")}`,
          value: "date_changed",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        }
      ],
      result: []
    };
  },
  created() {
    this.handleLibrariesResult();
    this.getReferences();
  },
  watch: {
    page: {
      handler: debounce(function() {
        this.handleLibrariesResult();
      }, 300)
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.handleLibrariesResult();
      }
    },
    sortDesc: {
      handler() {
        this.handleLibrariesResult();
      }
    },
    libraryParameters: {
      handler: debounce(function() {
        this.handleLibrariesResult();
      }, 300),
      deep: true
    },
    referenceParameters: {
      handler: debounce(function() {
        this.getReferences();
      }, 300),
      deep: true
    }
  },
  props: {
    showLibraries: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState("search", ["page", "paginateBy", "sortBy", "sortDesc"]),
    ...mapState("library", ["count"])
  },
  mixins: [dateMixin, urlMixin, queryMixin],
  methods: {
    ...mapActions("search", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetPage"
    ]),
    handleLibrariesResult() {
      this.isLoading = true;
      this.getLibraries(this.libraryPage).then(res => {
        this.result = res.results;
        this.isLoading = false;
      });
    },
    open(event) {
      this.$router.push(`/library/${event.id}`);
    }
  }
};
</script>
