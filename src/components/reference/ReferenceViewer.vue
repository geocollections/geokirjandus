<template>
  <v-container>
    <v-row>
      <v-col class="py-0">
        <data-viewer
          :module="$route.meta.object"
          :data="result"
          :count="count"
          :page="page"
          :is-loading="isLoading"
          :paginate-by="paginateBy"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :headers="headers"
          title="viewer.title.reference_html"
          v-on:update:paginateBy="updatePaginateBy"
          v-on:update:page="updatePage"
          v-on:update:sortBy="updateSortBy"
          v-on:update:sortDesc="updateSortDesc"
          v-on:update:headers="headers = $event"
        >
          <template v-if="tabs" v-slot:prepend>
            <tabs />
          </template>

          <!--  TABLE VIEW CUSTOM TEMPLATES  -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="$router.push(`/reference/${item.id}`)">
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
          <template v-slot:item.links="{ item }">
            <reference-links small :item="item" />
          </template>
          <!--  LIST VIEW TEMPLATE  -->
          <template v-slot:list-view="{ data }">
            <reference-list-view :data="data"></reference-list-view>
          </template>
        </data-viewer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import debounce from "lodash/debounce";
import ReferenceListView from "@/components/reference/ReferenceListView";
import DataViewer from "@/components/DataViewer";
import dateMixin from "@/mixins/dateMixin";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import Tabs from "@/components/Tabs";

export default {
  name: "ReferenceViewer",
  components: {
    Tabs,
    ReferenceLinks,
    ReferenceListView,
    DataViewer
  },
  data() {
    return {
      headers: [
        {
          text: `${this.$t("common.actions")}`,
          sortable: false,
          value: "actions",
          show: true,
          fixed: true
        },
        {
          text: `${this.$t("reference.id")}`,
          value: "id",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.author")}`,
          value: "author",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.year")}`,
          value: "year",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.title")}`,
          value: "title",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.journalName")}`,
          value: "journal__journal_name",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.book")}`,
          value: "book",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.pages")}`,
          value: "pages",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.keywords")}`,
          value: "keywords",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.dateChanged")}`,
          value: "date_changed",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("common.links")}`,
          sortable: false,
          value: "links",
          show: true,
          fixed: true
        }
      ]
    };
  },
  props: {
    tabs: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("search", ["page", "paginateBy", "sortBy", "sortDesc"]),
    ...mapState("references", ["result", "count"])
  },
  watch: {
    page: {
      handler: debounce(function() {
        this.getReferences();
      }, 300)
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.getReferences();
      }
    },
    sortDesc: {
      handler() {
        this.getReferences();
      }
    }
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
