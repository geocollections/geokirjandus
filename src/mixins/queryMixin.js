import {
  fetchLibraries,
  fetchLibraryReferences,
  fetchReferences
} from "@/utils/apiCalls";
import { mapActions, mapState } from "vuex";

const queryMixin = {
  // data() {
  //   return {
  //     isLoading: false
  //   };
  // },
  computed: {
    ...mapState("references", ["facet"]),
    referenceParameters() {
      return {
        ...this.$store.state.search.advancedSearch.byIds,
        search: this.$store.state.search.search
      };
    },
    libraryReferenceParameters() {
      return {
        ...this.$store.state.libraryReferenceSearch.advancedSearch.byIds,
        search: this.$store.state.libraryReferenceSearch.search
      };
    },
    libraryParameters() {
      return {
        search: this.$store.state.search.search,
        title: this.$store.state.search.advancedSearch.byIds.title,
        year: this.$store.state.search.advancedSearch.byIds.year,
        author: this.$store.state.search.advancedSearch.byIds.author
      };
    },
    getSearch() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.search;
      else return this.$store.state.search.search;
    },
    getLibraryReferenceSearch() {
      return this.$store.state.libraryReferenceSearch.search;
    },
    getAdvancedSearch() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.advancedSearch;
      else return this.$store.state.search.advancedSearch;
    },
    getLibraryReferenceAdvancedSearch() {
      return this.$store.state.libraryReferenceSearch.advancedSearch;
    },
    getPage() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.page;
      else return this.$store.state.search.page;
    },
    getPaginateBy() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.paginateBy;
      else return this.$store.state.search.paginateBy;
    },
    getSortBy() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.sortBy;
      else return this.$store.state.search.sortBy;
    },
    getSortDesc() {
      if (this.$route.name === "library")
        return this.$store.state.libraryReferenceSearch.sortDesc;
      else return this.$store.state.search.sortDesc;
    }
  },
  methods: {
    ...mapActions("references", ["setReferences"]),
    ...mapActions("library", ["setLibraries"]),
    handleFetchReferences(res) {
      this.setReferences(res);
      return res;
    },
    getReferences() {
      const state = this.$store.state.search.reference;

      const searchObj = {
        search: state.search,
        page: state.options.page,
        paginateBy: state.options.paginateBy,
        sortBy: state.options.sortBy,
        sortDesc: state.options.sortDesc,
        advancedSearch: state.advancedSearch.byIds
      };
      return fetchReferences(searchObj).then(this.handleFetchReferences);
    },
    getReferencesInLibrary() {
      const state = this.$store.state.libraryReferenceSearch;

      const searchObj = {
        search: state.search,
        page: state.page,
        paginateBy: state.paginateBy,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        advancedSearch: state.advancedSearch.byIds
      };

      return fetchLibraryReferences(this.$route.params.id, searchObj).then(
        this.handleFetchReferences
      );
    },
    getLibraries() {
      const state = this.$store.state.search.library;

      const libraryParams = {
        search: state.search,
        page: state.page,
        paginateBy: state.paginateBy,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        advancedSearch: state.advancedSearch.byIds
      };
      return fetchLibraries(libraryParams).then(res => {
        this.setLibraries(res);
        return res;
      });
    }
  }
};

export default queryMixin;
