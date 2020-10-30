<template>
  <v-container>
    <v-row>
      <v-col class="py-0">
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
          title="viewer.title.library_html"
          :export-buttons="false"
          v-on:update:paginateBy="updatePaginateBy"
          v-on:update:page="updatePage"
          v-on:update:sortBy="updateSortBy"
          v-on:update:sortDesc="updateSortDesc"
          v-on:update:headers="headers = $event"
        >
          <template v-slot:prepend>
            <tabs />
          </template>

          <!--  TABLE VIEW CUSTOM TEMPLATES  -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="$router.push(`/library/${item.id}`)">
              <v-icon>fas fa-eye</v-icon>
            </v-btn>
          </template>
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
import Tabs from "@/components/Tabs";

export default {
  name: "LibraryViewer",
  components: {
    Tabs,
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
      ]
    };
  },
  watch: {
    page: {
      handler: debounce(function() {
        this.getLibraries();
      }, 300)
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.getLibraries();
      }
    },
    sortDesc: {
      handler() {
        this.getLibraries();
      }
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
    ...mapState("library", ["result", "count"])
  },
  mixins: [dateMixin, urlMixin, queryMixin],
  methods: {
    ...mapActions("search", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetPage"
    ])
  }
};
</script>
