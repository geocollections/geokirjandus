<template>
  <div class="data-viewer">
    <!-- DATA TABLE -->
    <v-card elevation="4" class=" my-1" :loading="isLoading" color="#F8FBEF">
      <template v-slot:progress>
        <v-progress-linear indeterminate color="#F0B67F"></v-progress-linear>
      </template>

      <v-card-title class="d-print-none pt-1 pb-0">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span v-if="isLoading">{{ $t("common.loading") }}</span>
        <span v-else id="table-title">
          <span>{{ $t("common.found") }}</span>
          <span class="font-weight-bold">{{ ` ${count} ` }}</span>
          <span>{{ $t("common.records") }}</span>
        </span>
        <!--  TODO: Use slot to add inputs to header  -->
        <div class="ml-auto d-flex col-md-2">
          <citation-select />
        </div>
        <div class="d-flex">
          <v-radio-group
            class="radio-buttons mt-0 align-self-center"
            v-model="view"
            row
            hide-details
          >
            <v-radio value="list" :label="$t('common.listView')" />
            <v-radio value="table" :label="$t('common.tableView')" />
          </v-radio-group>
        </div>
        <!-- EXPORT -->
        <div v-if="exportButtons">
          <export-buttons
            :filename="module"
            :table-data="data"
            clipboard-class="data-viewer-table"
          />
        </div>
      </v-card-title>
      <slot name="prepend"></slot>
      <v-expand-transition>
        <v-card-text v-if="view === 'table'" class="px-2 py-0">
          <v-select
            class="pa-2"
            :value="getHeadersShowing"
            multiple
            dense
            chips
            :label="$t('common.fields')"
            hide-details
            :items="getSelectItems"
            @change="setHeaders($event)"
          >
            <template v-slot:selection="{ item }">
              <v-chip outlined dense color="#F0B67F" text-color="black">
                {{ item.text }}
              </v-chip>
            </template>
          </v-select>
        </v-card-text>
      </v-expand-transition>

      <view-helper
        v-on="$listeners"
        :page="page"
        :paginate-by="paginateBy"
        :count="count"
      />
      <!--  LIST VIEW  -->
      <v-expand-transition>
        <list-view
          v-if="view === 'list' && count > 0"
          :module="module"
          class="py-2"
        >
          <template>
            <slot name="list-view" v-bind:data="data"></slot>
          </template>
        </list-view>
      </v-expand-transition>
      <!--  TABLE VIEW  -->

      <v-data-table
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
        :header-props="headerProps"
        class=" data-viewer-table"
      >
        <template
          v-for="(_, slotName) in $scopedSlots"
          v-slot:[slotName]="context"
        >
          <slot :name="slotName" v-bind="context" />
        </template>
      </v-data-table>
      <view-helper
        v-on="$listeners"
        :page="page"
        :paginate-by="paginateBy"
        :count="count"
      />
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/ExportButtons";
import ListView from "@/components/ListView";
import CitationSelect from "@/components/CitationSelect";
import ViewHelper from "@/components/ViewHelper";
export default {
  name: "DataViewer",
  components: { ViewHelper, CitationSelect, ListView, ExportButtons },
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
    },
    headers: {
      type: Array[Object]
    },
    detailView: {
      type: Function
    },
    page: {
      type: Number
    },
    paginateBy: {
      type: Number
    }
  },
  data() {
    return {
      filterTable: "",
      view: "list",
      headerProps: {
        sortByText: this.$t("common.sortBy")
      }
    };
  },
  computed: {
    getRange() {
      return `${
        this.count > 0 ? this.paginateBy * this.page - (this.paginateBy - 1) : 0
      } - ${
        this.paginateBy * this.page > this.count
          ? this.count
          : this.paginateBy * this.page
      } (${this.count})`;
    },
    getSelectItems() {
      return this.headers
        .filter(header => {
          return !header.fixed;
        })
        .map(header => {
          return { value: header.value, text: header.text };
        });
    },
    getHeadersShowing() {
      return this.headers.filter(header => {
        return header.show;
      });
    },
    getSortBy() {
      return this.sortBy;
    },
    getSortDesc() {
      return this.sortDesc;
    }
  },
  methods: {
    setHeaders(event) {
      const headers = this.headers.map(header => {
        if (event.includes(header.value)) return { ...header, show: true };
        return { ...header, show: false };
      });

      this.$emit("update:headers", headers);
    }
  }
};
</script>
<style scoped>
.mobile-row >>> .v-data-table__mobile-row {
  height: initial !important;
}
</style>
