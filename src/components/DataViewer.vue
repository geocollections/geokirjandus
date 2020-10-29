<template>
  <div class="data-viewer">
    <!-- DATA TABLE -->
    <v-card elevation="4" class=" my-1" color="#F6EDDF">
      <slot name="prepend"></slot>
      <!--  TODO: Use slot to add inputs to header  -->
      <v-card-actions
        class="d-print-none d-flex flex-column justify-space-around flex-md-row justify-md-space-between pb-0 pt-2"
      >
        <div
          class="d-flex col-12 pt-0 pb-2 px-2 order-md-2 col-md-auto ml-md-auto"
        >
          <v-radio-group
            class="mt-0 mr-auto"
            v-model="view"
            row
            hide-details
            dense
          >
            <v-radio value="list" :label="$t('common.listView')" />
            <v-radio value="table" :label="$t('common.tableView')" />
          </v-radio-group>

          <export-buttons
            v-if="exportButtons"
            :filename="module"
            :table-data="data"
            :small="$vuetify.breakpoint.mdAndUp"
            clipboard-class="data-viewer-table"
          />
        </div>
        <div class="col-12 col-md order-md-1 px-2 py-0">
          <span v-html="$t(title, { num: count })" style="font-size: 1.25rem">
          </span>
        </div>
      </v-card-actions>
      <v-expand-transition>
        <v-card-actions v-if="view === 'table'">
          <v-select
            class="px-2"
            :value="getHeadersShowing"
            multiple
            dense
            chips
            :label="$t('common.fields')"
            hide-details
            :items="getHeaderOptions"
            @change="setHeaders($event)"
          >
            <template v-slot:selection="{ item }">
              <v-chip outlined small dense color="#F0B67F" text-color="black">
                {{ item.text }}
              </v-chip>
            </template>
          </v-select>
        </v-card-actions>
      </v-expand-transition>

      <view-helper
        v-on="$listeners"
        :page="page"
        :paginate-by="paginateBy"
        :count="count"
      />
      <div style="background-color: white;border-radius: 12px">
        <v-card-text v-if="!isLoading && count <= 0" class="text-center">
          <h3>{{ $t("error.nothingFound") }}</h3>
        </v-card-text>
        <v-card-text v-if="isLoading" class="text-center">
          <v-progress-circular indeterminate :size="50"></v-progress-circular>
        </v-card-text>
        <div v-else>
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
        </div>
      </div>
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
import ViewHelper from "@/components/ViewHelper";
export default {
  name: "DataViewer",
  components: { ViewHelper, ListView, ExportButtons },
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
    isLoading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array[Object]
    },
    page: {
      type: Number
    },
    paginateBy: {
      type: Number
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      view: "list",
      headerProps: {
        sortByText: this.$t("common.sortBy")
      }
    };
  },
  computed: {
    getHeaderOptions() {
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

.data-viewer-table {
  border-radius: 12px;
}
</style>
