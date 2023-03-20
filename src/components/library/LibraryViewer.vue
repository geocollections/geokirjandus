<template>
  <div>
    <data-viewer
      border-color="transparent"
      style="border-width: 0px"
      :module="$route.meta.object"
      :data="data"
      :count="count"
      :is-loading="isLoading"
      :headers="libraryHeaders"
      :nothing-found="$t('error.nothingFoundLibrary')"
      :title="
        count !== 1
          ? 'viewer.title.library_html'
          : 'viewer.title.library_single_html'
      "
      :options="options"
      :show-share="false"
      @open="open"
      @update:headers="handleUpdateTableHeaders"
      @update:options="$emit('update:options', $event)"
      @update:pagination="$emit('update:pagination', $event)"
      @reset:headers="
        resetHeaders({
          module: 'libraryHeaders',
          options: { sortBy: options.sortBy },
        })
      "
    >
      <template v-slot:item.title="{ item }">
        <div>
          {{ $i18n.locale === "ee" ? item.title : item.title_en }}
        </div>
      </template>
      <!--  TABLE VIEW CUSTOM TEMPLATES  -->
      <template v-slot:item.bookJournal="{ item }">
        <div v-if="item.book">{{ item.book }}</div>
        <div v-else-if="item.journal__journal_name">
          {{ item.journal__journal_name }}
        </div>
      </template>
      <template v-slot:item.date_changed="{ item }">
        {{ formatDate(item.date_changed) }}
      </template>
      <template v-slot:item.date_added="{ item }">
        {{ formatDate(item.date_added) }}
      </template>
      <!--  LIST VIEW TEMPLATE  -->
      <template v-slot:list-view="{ data }">
        <library-list-view
          :data="data"
          :is-loading="isLoading"
        ></library-list-view>
      </template>
    </data-viewer>
  </div>
</template>

<script>
import DataViewer from "@/components/DataViewer";
import LibraryListView from "@/components/library/LibraryListView";
import dateMixin from "@/mixins/dateMixin";
import urlMixin from "@/mixins/urlMixin";
import { mapActions, mapState } from "vuex";

export default {
  name: "LibraryViewer",
  components: {
    LibraryListView,
    DataViewer,
  },
  mixins: [dateMixin, urlMixin],
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    showLibraries: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState("search/library", ["search", "advancedSearch"]),
    ...mapState("tableSettings", ["libraryHeaders"]),
  },
  created() {
    this.$emit("update:data");
  },
  methods: {
    ...mapActions("tableSettings", ["setLibraryHeaders"]),
    handleUpdateTableHeaders(event) {
      this.setLibraryHeaders(event);
    },

    open(event) {
      this.$router.push(`/library/${event.id}`);
    },
  },
};
</script>
