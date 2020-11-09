import { fetchLibraries, fetchReferences } from "@/utils/apiCalls";
import { mapActions, mapState } from "vuex";

const queryMixin = {
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapState("references", ["facet", "count"]),
    referenceParameters() {
      return {
        ...this.$store.state.search.advancedSearch.byIds,
        search: this.$store.state.search.search
      };
    },
    libraryReferenceParameters() {
      return {
        ...this.$store.state.librarySearch.advancedSearch.byIds,
        search: this.$store.state.librarySearch.search
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
        return this.$store.state.librarySearch.search;
      else return this.$store.state.search.search;
    },
    getAdvancedSearch() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.advancedSearch;
      else return this.$store.state.search.advancedSearch;
    },
    getPage() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.page;
      else return this.$store.state.search.page;
    },
    getPaginateBy() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.paginateBy;
      else return this.$store.state.search.paginateBy;
    },
    getSortBy() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.sortBy;
      else return this.$store.state.search.sortBy;
    },
    getSortDesc() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.sortDesc;
      else return this.$store.state.search.sortDesc;
    }
  },
  methods: {
    ...mapActions("references", ["setReferences"]),
    ...mapActions("library", ["setLibraries"]),
    getReferences() {
      const state = this.$store.state.search;

      const searchObj = {
        search: state.search,
        page: state.page,
        paginateBy: state.paginateBy,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        advancedSearch: state.advancedSearch.byIds
      };
      return fetchReferences(searchObj).then(response => {
        this.setReferences(response);
        return response;
      });
    },
    getReferencesInLibrary() {
      const state = this.$store.state.librarySearch;
      const librariesObj = {
        type: "text",
        id: "libraries",
        lookUpType: null,
        value: `${this.$route.params.id}`,
        label: "reference.libraries",
        fields: ["libraries"],
        hidden: true
      };

      const searchObj = {
        search: state.search,
        page: state.page,
        paginateBy: state.paginateBy,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        advancedSearch: {
          ...state.advancedSearch.byIds,
          libraries: librariesObj
        }
      };
      return fetchReferences(searchObj).then(response => {
        this.setReferences(response);
        return response;
      });
    },
    getLibraries(page = 1) {
      const state = this.$store.state.search;

      const { search, ...advancedSearch } = this.libraryParameters;

      const libraryParams = {
        search: search,
        page: 1,
        paginateBy: 100,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        advancedSearch: advancedSearch
      };
      return fetchLibraries(libraryParams).then(res => {
        this.setLibraries(res);
        return res;
      });
    }
  }
};

export default queryMixin;
