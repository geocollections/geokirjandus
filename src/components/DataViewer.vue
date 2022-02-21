<template>
  <div id="dataViewer" class="data-viewer pb-1">
    <v-card-actions
      class="d-print-none d-flex flex-column justify-space-around flex-sm-row justify-sm-space-between py-2 px-0"
    >
      <div class="col-12 col-sm px-2 py-0 d-flex align-center">
        <span v-html="$t(title, { num: count })" class="title" />
        <copy-button
          v-if="copyButton"
          class="ml-2"
          id="viewerCopyButton"
          :table-data="data"
          :clipboard-class="view === 'list' ? 'list-view' : 'data-viewer-table'"
        />
      </div>
      <div class="d-flex justify-end col-12 py-0 px-2 col-sm-auto ml-sm-auto">
        <v-radio-group
          class="mt-0"
          id="viewChanger"
          :value="view"
          @change="updateView"
          row
          hide-details
          dense
        >
          <v-radio
            color="#fd8719"
            value="list"
            :label="$t('common.listView')"
          />
          <v-radio
            color="#fd8719"
            value="table"
            :label="$t('common.tableView')"
          />
        </v-radio-group>
      </div>
    </v-card-actions>
    <v-scroll-y-transition>
      <v-card-actions v-if="view === 'table'" id="fieldSelect" class="px-0">
        <v-select
          class="px-2"
          :value="getHeadersShowing"
          multiple
          dense
          chips
          color="grey darken-3"
          :menu-props="{
            bottom: true,
            offsetY: true,
            offsetOverflow: true
          }"
          :label="$t('common.fields')"
          hide-details
          :items="getHeaderOptions"
          @change="setHeaders($event)"
        >
          <template v-slot:selection="{ item }">
            <v-chip outlined small dense color="#fd8719" text-color="black">
              {{ item.text }}
            </v-chip>
          </template>
        </v-select>
      </v-card-actions>
    </v-scroll-y-transition>

    <view-helper
      v-if="helpers"
      v-on="$listeners"
      :page="page"
      :paginate-by="paginateBy"
      :count="count"
      class="px-0"
    />
    <div class="content mb-2">
      <v-scroll-y-transition leave-absolute group>
        <v-card-text
          key="noResults"
          v-if="!isLoading && count <= 0"
          class="text-center"
        >
          <h3>{{ nothingFound }}</h3>
        </v-card-text>
        <v-card-text key="loading" v-if="isLoading" class="text-center">
          <v-progress-circular indeterminate :size="50"></v-progress-circular>
        </v-card-text>
        <!--  LIST VIEW  -->
        <div key="view" v-else>
          <list-view
            v-if="view === 'list' && count > 0"
            :module="module"
            class="py-2"
          >
            <template>
              <slot name="list-view" v-bind:data="data"></slot>
            </template>
          </list-view>
          <!--  TABLE VIEW  -->

          <v-data-table
            v-if="view === 'table' && count > 0"
            :headers="getHeadersShowing"
            :items="data"
            hide-default-footer
            :server-items-length="paginateBy"
            :page="page"
            :sort-by="getSortBy"
            :sort-desc="getSortDesc"
            v-on:update:sort-by="$emit('update:sortBy', $event)"
            v-on:update:sort-desc="$emit('update:sortDesc', $event)"
            multi-sort
            mobile-breakpoint="0"
            @click:row="$emit('open', $event)"
            :header-props="headerProps"
            class="data-viewer-table pb-3"
          >
            <template
              v-for="(_, slotName) in $scopedSlots"
              v-slot:[slotName]="context"
            >
              <slot :name="slotName" v-bind="context" />
            </template>
          </v-data-table>
        </div>
      </v-scroll-y-transition>
    </div>
    <view-helper
      class="px-0"
      v-if="helpers"
      v-on="$listeners"
      :page="page"
      :paginate-by="paginateBy"
      :count="count"
    />
  </div>
</template>

<script>
import CopyButton from "./CopyButton";
import ListView from "@/components/ListView";
import ViewHelper from "@/components/ViewHelper";
import { mapState, mapActions } from "vuex";
import i18n from "vue-i18n";
export default {
  name: "DataViewer",
  components: { ViewHelper, ListView, CopyButton },
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
    copyButton: {
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
    },
    helpers: {
      type: Boolean,
      default: true
    },
    nothingFound: {
      type: String,
      default: function() {
        return this.$t("error.nothingFound");
      }
    }
  },
  data() {
    return {
      headerProps: {
        sortByText: this.$t("common.sortBy")
      }
    };
  },
  computed: {
    ...mapState("settings", ["view"]),
    getHeadersTranslated() {
      return this.headers.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    },
    getHeaderOptions() {
      return this.getHeadersTranslated
        .filter(header => {
          return !header.fixed;
        })
        .map(header => {
          return {
            value: header.value,
            text: header.text,
            disabled: this.sortBy.includes(header.value)
          };
        });
    },
    getHeadersShowing() {
      return this.getHeadersTranslated.filter(header => {
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
    ...mapActions("settings", ["updateView"]),
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
.title {
  font-size: 1.25rem;
}

.content {
  background-color: white;
  border-radius: 12px;
}

.mobile-row >>> .v-data-table__mobile-row {
  height: initial !important;
}

.data-viewer-table {
  border-radius: 12px;
}
</style>
