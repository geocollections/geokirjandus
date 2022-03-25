<template>
  <div
    id="dataViewer"
    :style="{
      overflow: 'hidden'
    }"
    class="content"
  >
    <div class="d-sm-flex py-2 px-2" style="background-color: whitesmoke">
      <v-card-actions class="d-print-none py-0 px-0">
        <v-btn-toggle
          id="viewChanger"
          :value="view"
          color="#135ebf"
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
          <div v-else-if="view === 'table'" id="fieldSelect" class="mx-2">
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
        <div id="viewerCopyButton">
          <copy-button
            v-if="copyButton"
            button-class="mx-2"
            :table-data="data"
            small
            :clipboard-class="
              view === 'list' ? 'list-view' : 'data-viewer-table'
            "
          />
        </div>
        <share-button v-if="showShare" :count="count" />
      </v-card-actions>
      <base-pagination
        class="ml-auto justify-end pt-2 pt-sm-0"
        :options="{ ...options }"
        :count="count"
        :items-per-page-options="footerProps['items-per-page-options']"
        :items-per-page-text="footerProps['items-per-page-text']"
        :page-select-text="
          $t('common.pageSelect', {
            current: options.page,
            count: Math.ceil(this.count / this.options.itemsPerPage)
          })
        "
        :go-to-text="$t('common.goTo')"
        :go-to-button-text="$t('common.goToBtn')"
        @update:pagination="$emit('update:pagination', $event)"
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
      <div key="view" v-else>
        <list-view v-if="view === 'list' && count > 0" :module="module">
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
          disable-pagination
          :loading="isLoading"
          :server-items-length="count"
          :header-props="headerProps"
          @click:row="$emit('open', $event)"
          @update:options="handleOptionsUpdate"
        >
          <template #loading>
            <v-progress-linear color="#135ebf" indeterminate />
          </template>
          <template
            v-for="(_, slotName) in $scopedSlots"
            v-slot:[slotName]="context"
          >
            <slot :name="slotName" v-bind="context" />
          </template>
        </v-data-table>
      </div>
    </v-scroll-y-transition>
    <base-pagination
      style="background-color: whitesmoke"
      class="justify-end px-2 py-2"
      :options="options"
      :count="count"
      :items-per-page-options="footerProps['items-per-page-options']"
      :items-per-page-text="footerProps['items-per-page-text']"
      :page-select-text="
        $t('common.pageSelect', {
          current: options.page,
          count: Math.ceil(this.count / this.options.itemsPerPage)
        })
      "
      :go-to-text="$t('common.goTo')"
      :go-to-button-text="$t('common.goToBtn')"
      @update:pagination="$emit('update:pagination', $event)"
    />
  </div>
</template>

<script>
import CopyButton from "./CopyButton";
import ListView from "@/components/ListView";
import { mapState, mapActions } from "vuex";
import CitationSelect from "./CitationSelect.vue";
import BaseDataTableHeaderMenu from "@/components/base/BaseDataTableHeaderMenu";
import ShareButton from "./ShareButton.vue";
import BasePagination from "./base/BasePagination.vue";
export default {
  name: "DataViewer",
  components: {
    ListView,
    CopyButton,
    CitationSelect,
    BaseDataTableHeaderMenu,
    ShareButton,
    BasePagination
  },
  props: {
    options: { type: Object, require: true },
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
      default: true
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
    showShare: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headerProps: {
        sortByText: this.$t("common.sortBy")
      },
      footerProps: {
        showFirstLastPage: true,
        "items-per-page-options": [10, 25, 50, 100],
        "items-per-page-text": this.$t("common.paginateBy")
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
    },
    handleOptionsUpdate(event) {
      console.log("dataviewer options update");
      this.$emit("update:options", event);
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
  /* border-radius: 12px; */
}

.mobile-row >>> .v-data-table__mobile-row {
  height: initial !important;
}

.data-viewer-table {
  /* border-radius: 12px; */
}
.v-data-table {
  max-width: 100%;
}
</style>
