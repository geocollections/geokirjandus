<template>
  <div class="list-module-core">
    <ScrollToTop class="d-print-none" />

    <v-row align="center" justify="start" class="px-4 d-print-none">
      <!-- OPTIONS -->
      <div class="mb-2">
        <v-radio-group
          class="radio-buttons mt-0"
          v-model="view"
          row
          hide-details
        >
          <v-radio value="list" class="mb-2" :label="$t('common.listView')" />
          <v-radio value="table" class="mb-2" :label="$t('common.tableView')" />
        </v-radio-group>
      </div>
    </v-row>
    <div>
      <v-select
        :label="$t('common.fields')"
        v-if="view === 'table'"
        :value="getHeadersShowing"
        multiple
        chips
        :items="getSelectItems"
        @change="setHeaders($event)"
      >
      </v-select>
    </div>
    <!-- PAGINATION -->
    <div
      v-if="response.count > 0"
      class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none"
    >
      <div class="mr-3 mb-3">
        <v-select
          :value="paginateBy"
          color="primary"
          dense
          :items="paginateByOptionsTranslated"
          item-color="black"
          label="Paginate by"
          hide-details
          @change="$emit('update:paginateBy', $event)"
        />
      </div>

      <div>
        <v-pagination
          :value="page"
          color="black"
          circle
          prev-icon="fas fa-angle-left"
          next-icon="fas fa-angle-right"
          :length="Math.ceil(response.count / paginateBy)"
          :total-visible="5"
          @input="$emit('update:page', $event)"
        />
      </div>
    </div>
    <!-- DATA TABLE -->
    <v-card
      elevation="4"
      color="primary"
      class="table-card my-1"
      :loading="isLoading"
    >
      <template v-slot:progress>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </template>

      <v-card-title class="d-print-none">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("common.found") }}</span>
          <span class="font-weight-bold">{{ ` ${response.count} ` }}</span>
          <span>{{ $t("common.records") }}</span>
        </span>
        <div class="flex-grow-1"></div>
        <!-- EXPORT -->
        <div class="mr-4 mb-2" v-if="exportButtons">
          <export-buttons :filename="module" :table-data="response.results" />
        </div>
      </v-card-title>
      <!--  LIST VIEW  -->
      <list-view
        v-if="view === 'list' && response.count > 0"
        :module="module"
        :data="response.results"
        body-color="white"
        body-active-color="black"
      />

      <!--  TABLE VIEW  -->
      <v-data-table
        v-if="view === 'table' && response.count > 0"
        :headers="getHeadersShowing"
        :items="response.results"
        hide-default-footer
        :items-per-page="paginateBy"
        :page="page"
        :sort-by="getSortBy"
        :sort-desc="getSortDesc"
        v-on:update:sort-by="$emit('update:sortBy', $event)"
        v-on:update:sort-desc="$emit('update:sortDesc', $event)"
        multi-sort
      >
        <template v-slot:item.bookJournal="{ item }">
          <div v-if="item.book">{{ item.book }}</div>
          <div v-else-if="item.journal__journal_name">
            {{ item.journal__journal_name }}
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="detailView(item)">
            <v-icon>fas fa-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/ExportButtons";
import ScrollToTop from "@/components/ScrollToTop";
import debounce from "lodash/debounce";
import { mapActions, mapState } from "vuex";
import ListView from "@/components/ListView";
export default {
  components: { ListView, ExportButtons, ScrollToTop },
  props: {
    apiCall: {
      type: Function
    },
    module: {
      type: String,
      default: null
    },
    parameters: {
      type: Object
    },
    exportButtons: {
      type: Boolean,
      default: true
    },
    sortBy: {
      type: Array[String],
      default: ["id"]
    },
    sortDesc: {
      type: Array[String],
      default: [false]
    },
    useListView: {
      type: Boolean,
      default: false
    },
    useImageView: {
      type: Boolean,
      default: false
    }
  },
  name: "ListModuleCore",
  data() {
    return {
      paginateByOptions: [
        { text: "pagination", value: 10 },
        { text: "pagination", value: 25 },
        { text: "pagination", value: 50 },
        { text: "pagination", value: 100 },
        { text: "pagination", value: 250 },
        { text: "pagination", value: 500 },
        { text: "pagination", value: 1000 }
      ],
      filterTable: "",
      view: "table",
      noResults: null,
      isLoading: false,
      response: {
        count: 0,
        results: []
      },
      // TODO: Look at maybe normalizing headers
      headers: [
        {
          text: "common.actions",
          sortable: false,
          value: "actions",
          show: true,
          fixed: true
        },
        { text: "reference.id", value: "id", show: true, fixed: false },
        { text: "reference.author", value: "author", show: true, fixed: false },
        { text: "reference.year", value: "year", show: true, fixed: false },
        { text: "reference.title", value: "title", show: true, fixed: false },
        {
          text: "reference.bookJournal",
          value: "bookJournal",
          show: true,
          fixed: false
        },
        { text: "reference.pages", value: "pages", show: false, fixed: false },
        {
          text: "reference.keywords",
          value: "keywords",
          show: false,
          fixed: false
        }
      ]
    };
  },

  computed: {
    ...mapState("search", ["paginateBy", "page"]),
    getSelectItems() {
      return this.translatedHeaders
        .filter(header => {
          return !header.fixed;
        })
        .map(header => {
          return { value: header.value, text: header.text };
        });
    },
    getHeadersShowing() {
      return this.translatedHeaders.filter(header => {
        return header.show;
      });
    },
    getSortBy() {
      return this.sortBy;
    },
    getSortDesc() {
      return this.sortDesc;
    },
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    },
    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },
  watch: {
    parameters: {
      handler() {
        this.$emit("reset:page");
        this.search();
      },
      deep: true
    },
    page: {
      handler() {
        this.search();
      },
      immediate: true,
      deep: true
    },
    paginateBy: {
      handler() {
        this.$emit("reset:page");
        this.search();
      },
      deep: true
    },
    sortBy: {
      handler() {
        this.search();
      },
      deep: true
    },
    sortDesc: {
      handler() {
        this.search();
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["updatePaginateBy", "updatePage"]),
    detailView(item) {
      this.$router.push(`/reference/${item.id}`);
    },
    setHeaders(event) {
      this.headers.forEach(header => {
        if (event.includes(header.value)) {
          header.show = true;
        } else {
          header.show = false;
        }
      });
    },
    search: debounce(function() {
      this.isLoading = true;

      this.apiCall()
        .then(
          response => {
            if (response.count === 0) this.noResults = true;
            if (response.count > 0) this.noResults = false;
            this.response.count = response.count;
            this.response.results = response.results;

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
.radio-buttons >>> .form-group {
  margin-bottom: unset;
}

.radio-buttons >>> .v-label {
  margin-bottom: 0;
}
</style>
