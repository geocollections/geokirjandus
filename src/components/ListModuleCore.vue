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

      <list-view
        v-if="view === 'list' && response.count > 0"
        :module="module"
        :data="response.results"
        body-color="white"
        body-active-color="black"
      />
      <v-data-table
        v-if="view === 'table' && response.count > 0"
        :headers="translatedHeaders"
        :items="response.results"
        hide-default-footer
        :items-per-page="paginateBy"
        :page="page"
      >
        <template v-slot:item.bookJournal="{item}">
              <div v-if="item.book">{{item.book}}</div>
          <div v-else-if="item.journal__journal_name">{{item.journal__journal_name}}</div>
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
      headers: [
        { text: "reference.id", value: "id" },
        { text: "reference.author", value: "author" },
        { text: "reference.year", value: "year" },
        { text: "reference.title", value: "title" },
        { text: "reference.bookJournal", value: "bookJournal"}
      ]
    };
  },

  computed: {
    ...mapState("search", ["paginateBy", "page"]),
    currentViewType() {
      return "list";
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
    }
  },

  methods: {
    ...mapActions("search", ["updatePaginateBy", "updatePage"]),
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
