<template>
  <data-viewer
    :module="$route.meta.object"
    :data="data"
    :count="count"
    :is-loading="isLoading"
    :headers="getHeaders"
    v-bind="$attrs"
    :nothing-found="$t('error.nothingFoundReference')"
    :title="
      count !== 1
        ? 'viewer.title.reference_html'
        : 'viewer.title.reference_single_html'
    "
    :options="options"
    @open="open"
    @update:headers="handleUpdateTableHeaders"
    @update:options="handleOptionsUpdate"
    @reset:headers="
      resetHeaders({
        module: 'referenceHeaders',
        options: { sortBy: options.sortBy }
      })
    "
  >
    <!--  TABLE VIEW CUSTOM TEMPLATES  -->
    <template v-slot:item.bookJournal="{ item }">
      <div v-if="item.book">{{ item.book }}</div>
      <div v-else-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
    </template>
    <template v-slot:item.date_added="{ item }">
      {{ formatDate(item.date_added) }}
    </template>
    <template v-slot:item.date_changed="{ item }">
      {{ formatDate(item.date_changed) }}
    </template>
    <template v-slot:item.links="{ item }">
      <reference-links small :item="item" />
    </template>
    <!--  LIST VIEW TEMPLATE  -->
    <template v-slot:list-view="{ data }">
      <reference-list-view :data="data"></reference-list-view>
    </template>
  </data-viewer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ReferenceListView from "@/components/reference/ReferenceListView";
import DataViewer from "@/components/DataViewer";
import dateMixin from "@/mixins/dateMixin";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import urlMixin from "@/mixins/urlMixin";
export default {
  name: "ReferenceViewer",
  components: {
    ReferenceLinks,
    ReferenceListView,
    DataViewer
  },
  mixins: [dateMixin, urlMixin],
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isLoading: true
    };
  },
  computed: {
    ...mapState("search/reference", ["search", "advancedSearch"]),
    ...mapState("tableSettings", [
      "referenceHeaders",
      "referenceInLibraryHeaders"
    ]),
    getTranslatedHeaders() {
      return [];
    },
    getHeaders() {
      if (this.$route.name === "library") return this.referenceInLibraryHeaders;
      return this.referenceHeaders;
    }
  },
  watch: {
    data: {
      handler() {
        this.isLoading = false;
      }
    }
  },
  created() {
    this.isLoading = true;
    this.$emit("update:data");
  },
  methods: {
    ...mapActions("tableSettings", [
      "setReferenceHeaders",
      "setReferenceInLibraryHeaders",
      "resetHeaders"
    ]),
    open(event) {
      this.$router.push(`/reference/${event.id}`);
    },
    handleUpdatePage(event) {
      this.$emit("update:options", { ...this.options, page: event });
    },
    handleUpdatePaginateBy(event) {
      this.$emit("update:options", {
        ...this.options,
        page: 1,
        paginateBy: event
      });
    },
    handleOptionsUpdate(event) {
      this.isLoading = true;
      this.$emit("update:options", event);
    },
    handleUpdateTableHeaders(event) {
      this.setReferenceHeaders(event);
    },
    handleReferencesInLibraryResult() {
      this.isLoading = true;
      this.getReferencesInLibrary().then(this.setResults);
    }
  }
};
</script>
