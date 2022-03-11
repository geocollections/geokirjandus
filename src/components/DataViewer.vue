<template>
  <div
    id="dataViewer"
    :style="{
      'border-radius': '12px',
      'border-width': '4px',
      'border-style': 'solid',
      'border-color': borderColor,
      overflow: 'hidden'
    }"
    class="elevation-2 content"
  >
    <div class="d-sm-flex py-2 px-2" style="background-color: whitesmoke">
      <v-card-actions class="d-print-none py-0 px-0">
        <v-btn-toggle
          id="viewChanger"
          :value="view"
          color="#fd8719"
          @change="updateView"
          class="mx-1 ml-auto"
          dense
          mandatory
          group
        >
          <v-tooltip top z-index="10000" open-delay="250">
            <template #activator="{on, attrs}">
              <v-btn
                small
                v-bind="attrs"
                v-on="on"
                class="rounded-lg"
                value="list"
              >
                <v-icon small>fas fa-list</v-icon>
              </v-btn>
            </template>
            List view
          </v-tooltip>
          <v-tooltip top z-index="10000" open-delay="250">
            <template #activator="{on, attrs}">
              <v-btn
                small
                v-bind="attrs"
                v-on="on"
                class="rounded-lg"
                value="table"
              >
                <v-icon small>fas fa-table</v-icon>
              </v-btn>
            </template>
            Table view
          </v-tooltip>
        </v-btn-toggle>
        <v-divider vertical />

        <v-scroll-y-transition hide-on-leave>
          <citation-select
            style="width: 120px"
            id="citationSelect"
            v-if="view === 'list'"
            class="px-2"
          />
          <div v-else-if="view === 'table'" class="mx-2">
            <base-data-table-header-menu
              :headers="getHeaderOptions"
              :visibleHeaders="getHeadersShowing"
              :sortBy="options.sortBy"
              @change="setHeaders($event)"
              @reset="$emit('reset:headers')"
            />
          </div>
        </v-scroll-y-transition>
        <v-divider vertical />
        <copy-button
          v-if="copyButton"
          button-class="mx-2"
          id="viewerCopyButton"
          :table-data="data"
          small
          :clipboard-class="view === 'list' ? 'list-view' : 'data-viewer-table'"
        />
      </v-card-actions>

      <view-helper
        class="ml-auto justify-end"
        v-if="helpers"
        v-on="$listeners"
        :page="options.page"
        :paginate-by="options.paginateBy"
        :count="count"
      />
    </div>
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
          class="data-viewer-table pb-3"
          hide-default-footer
          multi-sort
          mobile-breakpoint="0"
          :options="options"
          :headers="getHeadersShowing"
          :items="data"
          :server-items-length="count"
          :header-props="headerProps"
          @click:row="$emit('open', $event)"
          @update:options="$emit('update:options', $event)"
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
    <view-helper
      style="background-color: whitesmoke"
      class="justify-end px-2 pb-2"
      v-if="helpers"
      v-on="$listeners"
      :page="options.page"
      :paginate-by="options.paginateBy"
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
import CitationSelect from "./CitationSelect.vue";
import BaseDataTableHeaderMenu from "@/components/base/BaseDataTableHeaderMenu";
export default {
  name: "DataViewer",
  components: {
    ViewHelper,
    ListView,
    CopyButton,
    CitationSelect,
    BaseDataTableHeaderMenu
  },
  props: {
    options: { type: Object, default: () => {} },
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
    isLoading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array[Object]
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
    },
    borderColor: {
      type: String,
      default: "#f3d3a5"
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
            disabled: this.options.sortBy.includes(header.value),
            show: header.show
          };
        });
    },
    getHeadersShowing() {
      return this.getHeadersTranslated.filter(header => {
        return header.show;
      });
    }
  },
  methods: {
    ...mapActions("settings", ["updateView"]),
    setHeaders(event) {
      const headers = this.headers.map(header => {
        if (event.value == header.value)
          return { ...header, show: !header.show };
        return header;
      });
      this.$emit("update:headers", headers);
    }
    // handleUpdateSortBy(e) {
    //   console.log("sortBy");
    //   this.$emit("update:sortBy", e);
    // },
    // handleUpdateSortDesc(e) {
    //   console.log("sortDesc");
    //   this.$emit("update:sortDesc", e);
    // }
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
.v-data-table {
  max-width: 100%;
}
</style>
