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
      "sortDesc"
    ]),
    ...mapState("references", ["facet", "result", "count"]),
    referenceParameters() {
      return {
        ...this.advancedSearch.byIds,
        search: this.search
      };
    },
    libraryParameters() {
      return {
        search: this.search,
        title: this.advancedSearch.byIds.title,
        year: this.advancedSearch.byIds.year,
        author: this.advancedSearch.byIds.author
      };
    }
  },
  methods: {
    ...mapActions("references", ["setReferences"]),
    ...mapActions("library", ["setLibraries"]),
    getReferences() {
      const librariesObj =
        this.$route.name === "library"
          ? {
              type: "text",
              id: "libraries",
              lookUpType: "contains",
              value: `|${this.$route.params.id}|`,
              label: "reference.libraries",
              fields: ["libraries"],
              hidden: true
            }
          : null;

      const searchObj =
        this.$route.name === "library"
          ? {
              search: this.search,
              page: this.page,
              paginateBy: this.paginateBy,
              sortBy: this.sortBy,
              sortDesc: this.sortDesc,
              advancedSearch: {
                ...this.advancedSearch.byIds,
                libraries: librariesObj
              }
            }
          : {
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
          if (response.count === 1) {
            this.$router.push(`/reference/${response.results[0].id}`);
          } else {
            this.setReferences(response);
            this.setURLParameters(
              this.referenceParameters,
              this.page,
              this.paginateBy
            );
          }
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
          this.setURLParameters(
            this.referenceParameters,
            this.page,
            this.paginateBy
          );
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
