import { fetchLibraries, fetchReferences } from "@/utils/apiCalls";
import { mapActions, mapState } from "vuex";

const queryMixin = {
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapState("search", [
      "lookUpTypes",
      "page",
      "paginateBy",
      "sortBy",
      "sortDesc",
      "search",
      "advancedSearch"
    ]),
    ...mapState("references", ["facet", "result", "count"]),
    referenceParameters() {
      return {
        ...this.advancedSearch.byIds,
        search: this.search
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
        search: this.search,
        title: this.advancedSearch.byIds.title,
        year: this.advancedSearch.byIds.year,
        author: this.advancedSearch.byIds.author
      };
    },
    getSearch() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.search;
      else return this.search;
    },
    getAdvancedSearch() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.advancedSearch;
      else return this.advancedSearch;
    },
    getPage() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.page;
      else return this.page;
    },
    getPaginateBy() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.paginateBy;
      else return this.paginateBy;
    },
    getSortBy() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.sortBy;
      else return this.sortBy;
    },
    getSortDesc() {
      if (this.$route.name === "library")
        return this.$store.state.librarySearch.sortDesc;
      else return this.sortDesc;
    }
  },
  methods: {
    ...mapActions("references", ["setReferences"]),
    ...mapActions("library", ["setLibraries"]),
    getReferences() {
      const searchObj = {
        search: this.search,
        page: this.page,
        paginateBy: this.paginateBy,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      };
      this.isLoading = true;
      fetchReferences(searchObj).then(
        response => {
          this.setReferences(response);

          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    },
    getReferencesInLibrary() {
      const state = this.$store.state.librarySearch;
      const librariesObj =
        this.$route.name === "library"
          ? {
              type: "text",
              id: "libraries",
              lookUpType: null,
              value: `${this.$route.params.id}`,
              label: "reference.libraries",
              fields: ["libraries"],
              hidden: true
            }
          : null;

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

      this.isLoading = true;
      fetchReferences(searchObj).then(
        response => {
          this.setReferences(response);

          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    },
    getLibraries(page = 1) {
      const libraryParams = {
        search: this.search,
        page: 1,
        paginateBy: 100,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: {
          author: this.advancedSearch.byIds["author"],
          year: this.advancedSearch.byIds["year"],
          title: this.advancedSearch.byIds["title"]
        }
      };
      this.isLoading = true;
      fetchLibraries(libraryParams).then(
        res => {
          this.setLibraries(res);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }
};

export default queryMixin;
