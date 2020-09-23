<template>
  <div class="list-module-core">
    <v-row class="px-4 d-print-none">
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
    <v-row> </v-row>

    <!-- DATA TABLE -->
    <v-card elevation="4" class=" my-1" :loading="isLoading">
      <template v-slot:progress>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </template>

      <v-card-title class="d-print-none">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("common.found") }}</span>
          <span class="font-weight-bold">{{ ` ${count} ` }}</span>
          <span>{{ $t("common.records") }}</span>
        </span>
        <div class="flex-grow-1"></div>
        <!-- EXPORT -->
        <div class="mr-4 mb-2" v-if="exportButtons">
          <export-buttons :filename="module" :table-data="data" />
        </div>
      </v-card-title>
      <div
        v-if="count > 0"
        class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none"
      >
        <div class="mx-3 mb-3 ">
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
            :length="Math.ceil(count / paginateBy)"
            :total-visible="5"
            @input="$emit('update:page', $event)"
          />
        </div>
      </div>
      <v-select
        class="pa-2"
        v-if="view === 'table'"
        :value="getHeadersShowing"
        multiple
        dense
        chips
        outlined
        hide-details
        :items="getSelectItems"
        @change="setHeaders($event)"
      >
        <template v-slot:prepend>
          <div>{{ $t("common.fields") }}</div>
        </template>
      </v-select>
      <!--  LIST VIEW  -->
      <list-view
        v-if="view === 'list' && count > 0"
        :module="module"
        body-color="white"
        body-active-color="black"
      >
        <template>
          <slot name="list-view" v-bind:data="data"></slot>
        </template>
      </list-view>

      <!--  TABLE VIEW  -->

      <v-data-table
        class="d-inline-block"
        style="width: 100%"
        v-if="view === 'table' && count > 0"
        :headers="getHeadersShowing"
        :items="data"
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
import { mapActions, mapState } from "vuex";
import ListView from "@/components/ListView";
export default {
  components: { ListView, ExportButtons },
  props: {
    data: {
      type: Array[Object]
    },
    count: {
      type: Number,
      default: 0
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
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  name: "DataViewer",
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
      view: "list",
      // TODO: Look at maybe normalizing headers
      headers: [
        {
          text: "common.actions",
          sortable: false,
          value: "actions",
          show: true,
          fixed: true
        },
        {
          text: "reference.id",
          value: "id",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.author",
          value: "author",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.year",
          value: "year",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.title",
          value: "title",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.bookJournal",
          value: "bookJournal",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.pages",
          value: "pages",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: "reference.keywords",
          value: "keywords",
          show: false,
          fixed: false,
          class: "text-no-wrap"
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
  methods: {
    ...mapActions("search", ["updatePaginateBy", "updatePage"]),
    ...mapActions("references", ["setReferences"]),
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
    }
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

.tableHeaderCell {
  white-space: nowrap;
}
</style>
