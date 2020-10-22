<template>
  <v-container>
    <v-row>
      <v-col class="py-0">
        <data-viewer
          :module="$route.meta.object"
          :data="result"
          :count="count"
          :page="page"
          :is-loading="isLoading"
          :paginate-by="paginateBy"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :headers="headers"
          :detail-view="detailView"
          v-on:update:paginateBy="updatePaginateBy"
          v-on:update:page="updatePage"
          v-on:reset:page="resetPage"
          v-on:update:sortBy="updateSortBy"
          v-on:update:sortDesc="updateSortDesc"
          v-on:update:headers="headers = $event"
        >
          <template v-slot:prepend>
            <v-expand-transition>
              <v-card-text
                v-if="showLibraries && libraries && libraries.length > 0"
                class="px-2 py-2"
                style="background-color: #F2E4CF; border-radius: 6px"
              >
                <span class="subheading pl-3">{{
                  $t("common.libraries")
                }}</span>
                <v-chip-group
                  :show-arrows="$vuetify.breakpoint.smAndUp"
                  :column="$vuetify.breakpoint.smAndDown"
                >
                  <v-chip
                    v-for="library in libraries"
                    :key="library.id"
                    outlined
                    color="#F0B67F"
                    text-color="black"
                    @click="$router.push(`/library/${library.id}`)"
                  >
                    {{ library.title }}
                  </v-chip>
                  <v-chip
                    v-if="librariesCount > libraryPage * librariesBy"
                    color="#F0B67F"
                    text-color="black"
                    @click="getNextLibraries"
                    >{{
                      `+${librariesCount - libraryPage * librariesBy}`
                    }}</v-chip
                  >
                </v-chip-group>
              </v-card-text>
            </v-expand-transition>
          </template>

          <!--  TABLE VIEW CUSTOM TEMPLATES  -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="detailView(item)">
              <v-icon>fas fa-eye</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.bookJournal="{ item }">
            <div v-if="item.book">{{ item.book }}</div>
            <div v-else-if="item.journal__journal_name">
              {{ item.journal__journal_name }}
            </div>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { fetchLibraries, fetchReferences } from "@/utils/apiCalls";
import debounce from "lodash/debounce";
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
  data() {
    return {
      isLoading: false,
      libraries: null,
      libraryPage: 1,
      librariesCount: 0,
      librariesBy: 5,
      headers: [
        {
          text: `${this.$t("common.actions")}`,
          sortable: false,
          value: "actions",
          show: true,
          fixed: true
        },
        {
          text: `${this.$t("reference.id")}`,
          value: "id",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.author")}`,
          value: "author",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.year")}`,
          value: "year",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.title")}`,
          value: "title",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.journalName")}`,
          value: "journal__journal_name",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.book")}`,
          value: "book",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.pages")}`,
          value: "pages",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.keywords")}`,
          value: "keywords",
          show: false,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("reference.dateChanged")}`,
          value: "date_changed",
          show: true,
          fixed: false,
          class: "text-no-wrap"
        },
        {
          text: `${this.$t("common.links")}`,
          sortable: false,
          value: "links",
          show: true,
          fixed: true
        }
      ]
    };
  },
  watch: {
    referenceParameters: {
      handler: debounce(function() {
        this.getReferences();
      }, 300),
      deep: true
    },
    libraryParameters: {
      handler: debounce(function() {
        this.getLibraries(this.libraryPage);
      }, 300),
      deep: true
    },
    page: {
      handler: debounce(function() {
        this.getReferences();
      }, 300)
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.getReferences();
      }
    },
    // sortBy: {
    //   handler() {
    //     this.getReferences();
    //   }
    // },
    sortDesc: {
      handler() {
        this.getReferences();
      }
    },
    count: {
      handler() {
        if (this.count === 1) {
          this.$router.push(`/reference/${this.result[0].id}`);
        }
      }
    }
  },
  props: {
    search: {
      type: Object
    },
    advancedSearch: {
      type: Object
    },
    showLibraries: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState("search", ["page", "paginateBy", "sortBy", "sortDesc"]),
    ...mapState("references", ["result", "count"]),
    referenceParameters() {
      return { ...this.advancedSearch.byIds, search: this.search };
    },
    libraryParameters() {
      return {
        search: this.search,
        title: this.advancedSearch.byIds.title,
        year: this.advancedSearch.byIds.year,
        author: this.advancedSearch.byIds.author
      };
    },
    fields() {
      return this.advancedSearch.allIds.map(id => {
        return this.advancedSearch.byIds[id];
      });
    }
  },
  created() {
    if (this.$route.query) {
      this.setSearchFromURL(this.$route.query);
    }
  },
  mixins: [dateMixin, urlMixin],
  methods: {
    ...mapActions("search", [
      "setSearchFromURL",
      "updateSearch",
      "updateAdvancedSearch",
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "resetSearch",
      "resetPage"
    ]),
    ...mapActions("references", ["setReferences"]),
    getNextLibraries() {
      this.libraryPage++;

      this.getLibraries(this.libraryPage);
    },
    detailView(item) {
      this.$router.push(`/reference/${item.id}`);
    },
    getLibraries(page = 1) {
      if (this.showLibraries) {
        const libraryParams = {
          search: this.search,
          page: page,
          paginateBy: this.librariesBy,
          advancedSearch: {
            author: this.advancedSearch.byIds["author"],
            year: this.advancedSearch.byIds["year"],
            title: this.advancedSearch.byIds["title"]
          }
        };

        fetchLibraries(libraryParams).then(res => {
          this.libraries = res.results;
          this.librariesCount = res.count;
        });
      }
    },
    getReferences() {
      this.isLoading = true;
      fetchReferences({
        search: this.search,
        page: this.page,
        paginateBy: this.paginateBy,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      }).then(
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
    }
  }
};
</script>
