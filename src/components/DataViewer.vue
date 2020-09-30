<template>
  <div class="data-viewer">

    <!-- DATA TABLE -->
    <v-card elevation="4" class=" my-1" :loading="isLoading">
      <template v-slot:progress>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </template>

      <v-card-title class="d-print-none pb-2">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("common.found") }}</span>
          <span class="font-weight-bold">{{ ` ${count} ` }}</span>
          <span>{{ $t("common.records") }}</span>
        </span>

        <v-spacer></v-spacer>
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
          <span class="subheading pl-3">{{ $t("common.fields") }}</span>

          <v-select
            class="pa-2"
            :value="getHeadersShowing"
            multiple
            dense
            chips
            outlined
            hide-details
            :items="getSelectItems"
            @change="setHeaders($event)"
          >
          </v-select>
        </v-card-text>
      </v-expand-transition>
      <v-card-actions
        v-if="count > 0"
        class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between py-0"
      >
        <div class="col-md-3 px-2">
          <v-select
            :value="paginateBy"
            color="primary"
            dense
            outlined
            :items="paginateByOptionsTranslated"
            item-color="black"
            :label="$t('common.paginateBy')"
            hide-details
            @change="$emit('update:paginateBy', $event)"
          />
        </div>
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
      </v-card-actions>

      <!--  LIST VIEW  -->
      <v-expand-transition>
        <list-view v-if="view === 'list' && count > 0" :module="module">
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
        class="mobile-row data-viewer-table"
      >
        <template
          v-for="(_, slotName) in $scopedSlots"
          v-slot:[slotName]="context"
        >
          <slot :name="slotName" v-bind="context" />
        </template>
      </v-data-table>
      <v-card-actions
        v-if="count > 0"
        class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between py-0"
      >
        <div class="col-md-3">
          <v-select
            :value="paginateBy"
            color="primary"
            dense
            outlined
            :items="paginateByOptionsTranslated"
            item-color="black"
            :label="$t('common.paginateBy')"
            hide-details
            @change="$emit('update:paginateBy', $event)"
          />
        </div>
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
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/ExportButtons";
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
      headerProps: {
        sortByText: this.$t("common.sortBy"),
        outlined: true
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
.radio-buttons >>> .form-group {
  margin-bottom: unset;
}

.radio-buttons >>> .v-label {
  margin-bottom: 0;
}

.tableHeaderCell {
  white-space: nowrap;
}
.mobile-row >>> .v-data-table__mobile-row {
  height: initial !important;
}
</style>
