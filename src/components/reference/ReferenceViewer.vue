<template>
  <div class="px-1 px-sm-2">
    <data-viewer
      :module="$route.meta.object"
      :data="result"
      :count="count"
      :page="getPage"
      :is-loading="isLoading"
      :paginate-by="getPaginateBy"
      :sort-by="getSortBy"
      :sort-desc="getSortDesc"
      :headers="getHeaders"
      :title="
        count !== 1
          ? 'viewer.title.reference_html'
          : 'viewer.title.reference_single_html'
      "
      v-on:open="open"
      v-on:update:paginateBy="handleUpdatePaginateBy"
      v-on:update:page="handleUpdatePage"
      v-on:update:sortBy="handleUpdateSortBy"
      v-on:update:sortDesc="handleUpdateSortDesc"
      v-on:update:headers="handleUpdateTableHeaders"
    >
      <template v-if="tabs" v-slot:prepend>
        <tabs />
      </template>

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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import debounce from "lodash/debounce";
import ReferenceListView from "@/components/reference/ReferenceListView";
import DataViewer from "@/components/DataViewer";
import dateMixin from "@/mixins/dateMixin";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import Tabs from "@/components/Tabs";

export default {
  name: "ReferenceViewer",
  components: {
    Tabs,
    ReferenceLinks,
    ReferenceListView,
    DataViewer
  },
  mixins: [dateMixin, urlMixin, queryMixin],
  props: {
    tabs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      result: []
    };
  },
  computed: {
    ...mapState("search", ["page", "paginateBy", "sortBy", "sortDesc"]),
    ...mapState("references", ["count"]),
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
  created() {
    if (this.$route.name === "library") this.handleReferencesInLibraryResult();
    else {
      this.handleReferencesResult();
      this.getLibraries();
    }
  },
  watch: {
    referenceParameters: {
      handler: debounce(function() {
        this.handleReferencesResult();
      }, 300),
      deep: true
    },
    libraryReferenceParameters: {
      handler: debounce(function() {
        this.handleReferencesInLibraryResult();
      }, 300),
      deep: true
    },
    libraryParameters: {
      handler: debounce(function() {
        this.getLibraries();
      }, 300),
      deep: true
    },
    getPage: {
      handler: debounce(function() {
        if (this.$route.name === "library")
          this.handleReferencesInLibraryResult();
        else this.handleReferencesResult();
      }, 300)
    },
    getPaginateBy: {
      handler() {
        this.resetPage();
        if (this.$route.name === "library")
          this.handleReferencesInLibraryResult();
        else this.handleReferencesResult();
      }
    },
    getSortDesc: {
      handler() {
        if (this.$route.name === "library")
          this.handleReferencesInLibraryResult();
        else this.handleReferencesResult();
      }
    }
  },
  methods: {
    ...mapActions("search", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetPage"
    ]),
    ...mapActions("tableSettings", [
      "setReferenceHeaders",
      "setReferenceInLibraryHeaders"
    ]),
    open(event) {
      this.$router.push(`/reference/${event.id}`);
    },
    handleUpdatePage(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/updatePage", event);
      else this.updatePage(event);
    },
    handleUpdatePaginateBy(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/updatePaginateBy", event);
      else this.updatePaginateBy(event);
    },
    handleUpdateSortBy(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/updateSortBy", event);
      else this.updateSortBy(event);
    },
    handleUpdateSortDesc(event) {
      if (this.$route.name === "library")
        this.$store.dispatch("libraryReferenceSearch/updateSortDesc", event);
      else this.updateSortDesc(event);
    },
    handleUpdateTableHeaders(event) {
      if (this.$route.name === "library")
        this.setReferenceInLibraryHeaders(event);
      else this.setReferenceHeaders(event);
    },
    setResults(res) {
      this.result = res.results;
      this.isLoading = false;
    },
    handleReferencesResult() {
      this.isLoading = true;
      this.getReferences().then(this.setResults);
    },
    handleReferencesInLibraryResult() {
      this.isLoading = true;
      this.getReferencesInLibrary().then(this.setResults);
    }
  }
};
</script>
