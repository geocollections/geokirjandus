<template>
  <div :class="`fill-height ${showAlert ? 'searchLibrary' : 'search'}`">
    <v-list class="mt-0 pb-4 pb-md-10 pa-0">
      <v-fade-transition>
        <v-list-item v-if="showAlert" class="pt-3 d-flex justify-end">
          <v-alert
            id="libraryAlert"
            dense
            colored-border
            border="right"
            type="info"
            color="#95A8B1"
            class="mb-0"
          >
            <v-row align="center">
              <v-col class="grow py-0">
                {{ $t("alert.infoLibrarySearch") }}
              </v-col>
              <v-col class="shrink">
                <v-btn x-small icon @click="handleExitLibrary()">
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-list-item>
      </v-fade-transition>

      <v-list-item id="searchField" class="py-3">
        <v-text-field
          solo
          hide-details
          :value="search.value"
          :label="$t('common.search')"
          @change="$emit('update:search', $event)"
        />
      </v-list-item>
      <v-list-item>
        <v-btn
          icon
          small
          outlined
          tile
          color="red"
          class="deleteSearch"
          id="deleteSearchButton"
          aria-label="delete"
          @click="$emit('reset:parameters')"
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>

        <share-button />
        <v-spacer />
        <search-help-dialog />
        <v-btn id="searchButton" color="#1C9BDE" dark>
          <v-icon class="pr-2" small>fas fa-search</v-icon>
          {{ $t("common.searchCommand") }}
        </v-btn>
      </v-list-item>
      <div :key="index" v-for="(id, index) in advancedSearch.allIds">
        <v-list-item v-if="advancedSearch.byIds[id].type === 'checkbox'" dense>
          <v-checkbox
            dense
            :label="$t(advancedSearch.byIds[id].label)"
            class="checkbox mt-0 py-0"
            color="#fd8719"
            :false-value="null"
            true-value="1"
            hide-details
            :input-value="advancedSearch.byIds[id].value"
            @change="updateCheckbox($event, id)"
          />
        </v-list-item>
      </div>
      <v-list-item>
        <citation-select id="citationSelect" />
      </v-list-item>
      <div id="advancedSearch">
        <v-list-group
          color="grey darken-3"
          v-model="showAdvancedSearch"
          :class="
            `${showAlert ? 'advancedSearchLibrary' : 'advancedSearch'} mt-3`
          "
        >
          <template v-slot:activator>
            <v-list-item-title id="advancedSearchActivator" class="d-flex">
              <v-col cols="auto" class="px-0">
                {{ $t("common.advancedSearch") }}
              </v-col>
              <v-spacer />
              <v-col
                v-if="getAdvancedSearchParametersAppliedCount > 0"
                cols="auto"
                class="px-0"
              >
                <small>
                  <b>{{ getAdvancedSearchParametersAppliedCount }}</b>
                </small>
                <v-icon small color="#fd8719">fas fa-filter</v-icon>
              </v-col>
            </v-list-item-title>
          </template>
          <div
            :class="
              `pb-3 ${
                showAlert
                  ? 'advancedSearchLibraryContent'
                  : 'advancedSearchContent'
              }`
            "
          >
            <div :key="index" v-for="(id, index) in advancedSearch.allIds">
              <!-- REGULAR SEARCH FIELD -->
              <v-list-item
                v-if="advancedSearch.byIds[id].type === 'text'"
                dense
              >
                <v-row class="pa-1">
                  <v-col cols="12" class="py-0 px-1">
                    <v-text-field
                      class="searchField"
                      color="grey darken-3"
                      :value="advancedSearch.byIds[id].value"
                      :label="$t(advancedSearch.byIds[id].label)"
                      hide-details
                      @change="
                        $emit('update:advancedSearch', {
                          value: $event,
                          id: id,
                          type: advancedSearch.byIds[id].type,
                        })
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item
                class="px-3"
                v-else-if="advancedSearch.byIds[id].type === 'select'"
              >
                <!--  SELECT  -->
                <v-row class="">
                  <div class="col py-1">
                    <v-select
                      class="searchField"
                      multiple
                      color="grey darken-3"
                      :label="$t(advancedSearch.byIds[id].label)"
                      :value="advancedSearch.byIds[id].value"
                      :items="getSelectItems(id)"
                      item-color="#fd8719"
                      :menu-props="{
                        bottom: true,
                        offsetY: true,
                        offsetOverflow: true,
                      }"
                      hide-details
                      @change="
                        $emit('update:advancedSearch', {
                          value: $event,
                          id: id,
                          type: advancedSearch.byIds[id].type,
                        })
                      "
                    >
                    </v-select>
                  </div>
                </v-row>
              </v-list-item>
              <v-list-item
                v-else-if="advancedSearch.byIds[id].type === 'range'"
                dense
              >
                <!--  RANGE  -->
                <v-row class="pa-1">
                  <div class="col py-0">
                    <v-row>
                      <v-col cols="6" class="py-0 px-1">
                        <v-text-field
                          class="searchField"
                          color="grey darken-3"
                          :value="
                            isNaN(advancedSearch.byIds[id].value[0])
                              ? ''
                              : advancedSearch.byIds[id].value[0]
                          "
                          :label="$t(advancedSearch.byIds[id].label)"
                          :placeholder="
                            $t(advancedSearch.byIds[id].placeholders[0])
                          "
                          hide-details
                          type="number"
                          @change="
                            $emit('update:advancedSearch', {
                              value: [
                                isNaN($event) ? NaN : parseInt($event),
                                advancedSearch.byIds[id].value[1],
                              ],
                              id: id,
                              type: advancedSearch.byIds[id].type,
                            })
                          "
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" class="py-0 px-1">
                        <v-text-field
                          class="searchField"
                          color="grey darken-3"
                          :value="
                            isNaN(advancedSearch.byIds[id].value[1])
                              ? ''
                              : advancedSearch.byIds[id].value[1]
                          "
                          hide-details
                          :placeholder="
                            $t(advancedSearch.byIds[id].placeholders[1])
                          "
                          single-line
                          type="number"
                          @change="
                            $emit('update:advancedSearch', {
                              value: [
                                advancedSearch.byIds[id].value[0],
                                isNaN($event) ? NaN : parseInt($event),
                              ],
                              id: id,
                              type: advancedSearch.byIds[id].type,
                            })
                          "
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-row>
              </v-list-item>
            </div>
          </div>
        </v-list-group>
      </div>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CitationSelect from "@/components/CitationSelect";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import ShareButton from "@/components/ShareButton";
import SearchHelpDialog from "@/components/SearchHelpDialog";

export default {
  name: "Search",
  components: { SearchHelpDialog, ShareButton, CitationSelect },
  mixins: [urlMixin, queryMixin],
  props: {
    colSize: {
      type: Number,
      default: 6,
    },
  },
  data: () => ({
    range: [1900, 2000],
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"],
    referenceTypeValue: [],
    showAdvancedSearch: true,
    infoAlert: null,
    filterCount: 2,
    showAlert: false,
  }),
  computed: {
    ...mapState("references", ["facet", "result", "count"]),
    search() {
      return this.showAlert ? this.getLibraryReferenceSearch : this.getSearch;
    },
    advancedSearch() {
      return this.showAlert
        ? this.getLibraryReferenceAdvancedSearch
        : this.getAdvancedSearch;
    },
    getAdvancedSearchParametersAppliedCount() {
      let count = 0;

      this.advancedSearch.allIds.forEach((id) => {
        const obj = this.advancedSearch.byIds[id];
        if (obj.type === "text") {
          if (this.advancedSearch.byIds[id].value?.length > 0) {
            count++;
          }
        } else if (obj.type === "select") {
          if (this.advancedSearch.byIds[id].value.length > 0) {
            count++;
          }
        } else if (obj.type === "range") {
          const start = this.advancedSearch.byIds[id].value[0];
          const end = this.advancedSearch.byIds[id].value[1];

          if (
            (typeof start === "number" && isFinite(start)) ||
            (typeof end === "number" && isFinite(end))
          ) {
            count++;
          }
        }
      });

      return count;
    },

    getReferenceTypes() {
      let types = [];

      if (!this.facet.facet_fields && !this.facet.facet_pivot) return types;

      for (let i = 0; i < this.facet.facet_fields.type.length; i += 2) {
        // TODO: Query from pivot only once. Remove the need for using find function.
        types.push({
          value: this.facet.facet_fields.type[i],
          text: `${
            this.$i18n.locale === "ee"
              ? this.facet.facet_pivot[
                  "type,reference_type,reference_type_en"
                ].find((o) => o.value === this.facet.facet_fields.type[i])
                  .pivot[0].value
              : this.facet.facet_pivot[
                  "type,reference_type,reference_type_en"
                ].find((o) => o.value === this.facet.facet_fields.type[i])
                  .pivot[0].pivot[0].value
          } [${this.facet.facet_fields.type[i + 1]}]`,
        });
      }

      return types;
    },

    getReferenceLanguages() {
      let languages = [];

      if (!this.facet.facet_fields && !this.facet.facet_pivot) return languages;

      for (let i = 0; i < this.facet.facet_fields.language.length; i += 2) {
        languages.push({
          value: this.facet.facet_fields.language[i],
          text: `${
            this.$i18n.locale === "ee"
              ? this.facet.facet_pivot[
                  "language,reference_language,reference_language_en"
                ].find(
                  (o) =>
                    o.value.toString() === this.facet.facet_fields.language[i]
                ).pivot[0].value
              : this.facet.facet_pivot[
                  "language,reference_language,reference_language_en"
                ].find(
                  (o) =>
                    o.value.toString() === this.facet.facet_fields.language[i]
                ).pivot[0].pivot[0].value
          } [${this.facet.facet_fields.language[i + 1]}]`,
        });
      }
      return languages;
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        if (
          to.name === "library" &&
          to.params.id &&
          from &&
          from.name === "searchLibrary"
        ) {
          this.showAlert = true;
        } else if (to.name === "library" && to.params.id) {
          this.showAlert = true;
        } else if (
          from !== undefined &&
          from.name === "library" &&
          to.name === "reference"
        ) {
          this.showAlert = true;
        } else if (
          (to.name === "searchReference" || to.name === "searchLibrary") &&
          from === undefined
        ) {
          this.showAlert = false;
        } else if (
          from &&
          from.name === "library" &&
          to.name === "searchLibrary"
        ) {
          this.showAlert = false;
        } else {
          this.showAlert = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions("search", ["resetSearch", "resetPage"]),
    handleExitLibrary() {
      this.$router.replace({ name: "searchReference" });
    },
    updateCheckbox(event, id) {
      this.$emit("update:advancedSearch", {
        value: event,
        id: id,
      });
    },
    getSelectItems(id) {
      if (id === "referenceType") return this.getReferenceTypes;
      else if (id === "language") return this.getReferenceLanguages;
      return [];
    },
  },
};
</script>

<style scoped>
.search {
  background-color: #f6eddf;
}

.searchLibrary {
  background-color: #e8ecee;
}

.advancedSearch {
  background-color: #ecc285;
}

.advancedSearchLibrary {
  background-color: #95a8b1;
}

.advancedSearchContent {
  background-color: #f6eddf;
}

.advancedSearchLibraryContent {
  background-color: #e8ecee;
}

.deleteSearch {
  border-radius: 4px;
}

.searchField >>> input {
  font-weight: bold;
}

.searchField >>> .v-select__selection {
  font-weight: bold;
}

.searchField >>> input::placeholder {
  font-weight: normal;
}
</style>
