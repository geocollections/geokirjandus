<template>
  <v-container>
    <v-row>
      <v-col>
        <data-viewer
          :module="$route.meta.object"
          :data="result"
          :count="count"
          :parameters="parameters"
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
                class="px-2 pb-0"
              >
                <span class="subheading pl-3">Libraries</span>
                <v-chip-group
                  :show-arrows="$vuetify.breakpoint.smAndUp"
                  :column="$vuetify.breakpoint.smAndDown"
                >
                  <v-chip
                    v-for="(library, index) in libraries"
                    :key="index"
                    @click="$router.push(`/library/${library.id}`)"
                  >
                    {{ library.title }}
                  </v-chip>
                  <v-chip
                    v-if="librariesCount > libraryPage * librariesBy"
                    @click="getLibraries"
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

export default {
  name: "ReferenceViewer",
  components: {
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
        }
      ]
    };
  },
  watch: {
    parameters: {
      handler() {
        this.resetPage();
        this.fetch();
      },
      deep: true
    },
    page: {
      handler() {
        this.fetch();
      },
      immediate: true,
      deep: true
    },
    paginateBy: {
      handler() {
        this.resetPage();
        this.fetch();
      },
      deep: true
    },
    sortBy: {
      handler() {
        this.fetch();
      },
      deep: true
    },
    sortDesc: {
      handler() {
        this.fetch();
      },
      deep: true
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
    getDateLocale() {
      if (this.$i18n.locale === "ee") {
        return "et-EE";
      } else {
        return "en-GB";
      }
    },
    parameters() {
      return { ...this.advancedSearch.byIds, search: this.search };
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
    formatDate(date) {
      return date
        ? new Date(date).toLocaleString(this.getDateLocale, {
            dateStyle: "medium"
          })
        : null;
    },
    getLibraries() {
      this.libraryPage++;

      const libraryParams = {
        search: this.search,
        page: this.libraryPage,
        paginateBy: this.librariesBy,
        advancedSearch: {
          author: this.advancedSearch.byIds["author"],
          year: this.advancedSearch.byIds["year"],
          title: this.advancedSearch.byIds["title"]
        }
      };

      fetchLibraries(libraryParams).then(res => {
        this.libraries = [...this.libraries, ...res.results];
        this.librariesCount = res.count;
      });
    },
    detailView(item) {
      this.$router.push(`/reference/${item.id}`);
    },
    fetch: debounce(function() {
      this.isLoading = true;
      fetchReferences({
        search: this.search,
        page: this.page,
        paginateBy: this.paginateBy,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        advancedSearch: this.advancedSearch.byIds
      })
        .then(
          response => {
            this.setReferences(response);
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        )
        .finally(() => {
          let q = Object.fromEntries(
            Object.entries(this.parameters)
              .filter(([_, v]) => {
                if (!v.hidden) {
                  switch (v.type) {
                    case "range": {
                      return isNaN(v.value[0]) && isNaN(v.value[1])
                        ? null
                        : v.value;
                    }
                    default: {
                      return v.value;
                    }
                  }
                }
              })
              .map(([k, v]) => {
                switch (v.type) {
                  case "range": {
                    const start = isNaN(v.value[0]) ? "" : `${v.value[0]}`;
                    const end = isNaN(v.value[1]) ? "" : `${v.value[1]}`;

                    return [k, `${start}-${end}`];
                  }
                  case "checkbox": {
                    return [k, v.value];
                  }
                  default: {
                    return k === "search"
                      ? [k, v.value]
                      : [`${k}_${v.lookUpType}`, v.value];
                  }
                }
              })
          );
          if (this.page > 1) {
            q.page = this.page;
          }
          if (this.paginateBy !== 50) {
            q.paginateBy = this.paginateBy;
          }
          this.$router.replace({ query: q }).catch(() => {});
        });

      const libraryParams = {
        search: this.search,
        page: this.libraryPage,
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
    }, 500)
  }
};
</script>

<style scoped></style>
