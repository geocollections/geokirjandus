<template>
  <div class="search fill-height ">
    <v-list class="mt-0 pb-10 pa-0">
      <v-fade-transition>
        <v-list-item v-if="showAlert" class="pt-2 ">
          <v-alert
            dense
            colored-border
            border="right"
            type="info"
            color="#F9C980"
            class="mb-0"
          >
            <v-row align="center">
              <v-col class="grow py-0">
                {{ $t("alert.infoLibrarySearch") }}
              </v-col>
              <v-col class="shrink">
                <v-btn x-small icon @click="handleExitLibrary()"
                  ><v-icon>fa fa-times</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-alert>
        </v-list-item>
      </v-fade-transition>

      <v-list-item class="py-4">
        <v-text-field
          solo
          hide-details
          :value="getSearch.value"
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
          aria-label="delete"
          @click="$emit('reset:parameters')"
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
        <share-button />
        <v-spacer />
        <search-help-dialog />
        <v-btn color="#1C9BDE" dark>
          <v-icon class="pr-2" small>fas fa-search</v-icon>
          {{ $t("common.searchCommand") }}
        </v-btn>
      </v-list-item>
      <div :key="index" v-for="(id, index) in getAdvancedSearch.allIds">
        <v-list-item
          v-if="getAdvancedSearch.byIds[id].type === 'checkbox'"
          dense
        >
          <v-checkbox
            dense
            :label="$t(getAdvancedSearch.byIds[id].label)"
            class="checkbox mt-0 py-0"
            color="#E58124"
            :false-value="null"
            true-value="1"
            hide-details
            :input-value="getAdvancedSearch.byIds[id].value"
            @change="updateCheckbox($event, id)"
          />
        </v-list-item>
      </div>
      <v-list-item>
        <citation-select />
      </v-list-item>
      <v-list-group
        color="#924f11"
        v-model="showAdvancedSearch"
        class="advancedSearch mt-3"
      >
        <template v-slot:activator>
          <v-list-item-title class="d-flex">
            <v-col cols="auto" class="px-0">
              {{ $t("common.advancedSearch") }}
            </v-col>
            <v-spacer />
            <v-col
              v-if="getAdvancedSearchParametersAppliedCount > 0"
              cols="auto"
              class="px-0"
            >
              <small>{{ getAdvancedSearchParametersAppliedCount }}</small>
              <v-icon small color="#E58124">fas fa-filter</v-icon>
            </v-col>
          </v-list-item-title>
        </template>
        <div class="pb-3">
          <div :key="index" v-for="(id, index) in getAdvancedSearch.allIds">
            <!-- REGULAR SEARCH FIELD -->
            <v-list-item
              v-if="getAdvancedSearch.byIds[id].type === 'text'"
              dense
            >
              <v-row class="pa-1">
                <v-col cols="12" class="py-0 px-1">
                  <v-text-field
                    class="searchField"
                    color="#B76315"
                    :value="getAdvancedSearch.byIds[id].value"
                    :label="$t(getAdvancedSearch.byIds[id].label)"
                    hide-details
                    @change="
                      $emit('update:advancedSearch', {
                        value: $event,
                        id: id,
                        type: getAdvancedSearch.byIds[id].type
                      })
                    "
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item
              class="px-3"
              v-else-if="getAdvancedSearch.byIds[id].type === 'select'"
            >
              <!--  SELECT  -->
              <v-row class="">
                <div class="col py-1">
                  <v-select
                    class="searchField"
                    multiple
                    color="#B76315"
                    :label="$t(getAdvancedSearch.byIds[id].label)"
                    :value="getAdvancedSearch.byIds[id].value"
                    :items="getSelectItems(id)"
                    item-color="#E58124"
                    :menu-props="{ bottom: true, offsetY: true }"
                    hide-details
                    @change="
                      $emit('update:advancedSearch', {
                        value: $event,
                        id: id,
                        type: getAdvancedSearch.byIds[id].type
                      })
                    "
                  >
                  </v-select>
                </div>
              </v-row>
            </v-list-item>
            <v-list-item
              v-else-if="getAdvancedSearch.byIds[id].type === 'range'"
              dense
            >
              <!--  RANGE  -->
              <v-row class="pa-1">
                <div class="col py-0">
                  <v-row>
                    <v-col cols="6" class="py-0 px-1">
                      <v-text-field
                        class="searchField"
                        color="#B76315"
                        :value="
                          isNaN(getAdvancedSearch.byIds[id].value[0])
                            ? ''
                            : getAdvancedSearch.byIds[id].value[0]
                        "
                        :label="$t(getAdvancedSearch.byIds[id].label)"
                        :placeholder="
                          $t(getAdvancedSearch.byIds[id].placeholders[0])
                        "
                        hide-details
                        type="number"
                        @change="
                          $emit('update:advancedSearch', {
                            value: [
                              isNaN($event) ? NaN : parseInt($event),
                              getAdvancedSearch.byIds[id].value[1]
                            ],
                            id: id,
                            type: getAdvancedSearch.byIds[id].type
                          })
                        "
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0 px-1">
                      <v-text-field
                        class="searchField"
                        color="#B76315"
                        :value="
                          isNaN(getAdvancedSearch.byIds[id].value[1])
                            ? ''
                            : getAdvancedSearch.byIds[id].value[1]
                        "
                        hide-details
                        :placeholder="
                          $t(getAdvancedSearch.byIds[id].placeholders[1])
                        "
                        single-line
                        type="number"
                        @change="
                          $emit('update:advancedSearch', {
                            value: [
                              getAdvancedSearch.byIds[id].value[0],
                              isNaN($event) ? NaN : parseInt($event)
                            ],
                            id: id,
                            type: getAdvancedSearch.byIds[id].type
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
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CitationSelect from "@/components/CitationSelect";
import { fetchLibraries, fetchReferences } from "@/utils/apiCalls";
import debounce from "lodash/debounce";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import ShareButton from "@/components/ShareButton";
import SearchHelpDialog from "@/components/SearchHelpDialog";

export default {
  name: "Search",
  components: { SearchHelpDialog, ShareButton, CitationSelect },
  props: {
    colSize: {
      type: Number,
      default: 6
    }
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
      immediate: true
    }
  },
  computed: {
    ...mapState("references", ["facet", "result", "count"]),
    getAdvancedSearchParametersAppliedCount() {
      let count = 0;

      this.getAdvancedSearch.allIds.forEach(id => {
        const obj = this.getAdvancedSearch.byIds[id];
        if (obj.type === "text") {
          if (this.getAdvancedSearch.byIds[id].value?.length > 0) {
            count++;
          }
        } else if (obj.type === "select") {
          if (this.getAdvancedSearch.byIds[id].value.length > 0) {
            count++;
          }
        } else if (obj.type === "range") {
          const start = this.getAdvancedSearch.byIds[id].value[0];
          const end = this.getAdvancedSearch.byIds[id].value[1];

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
                ].find(o => o.value === this.facet.facet_fields.type[i])
                  .pivot[0].value
              : this.facet.facet_pivot[
                  "type,reference_type,reference_type_en"
                ].find(o => o.value === this.facet.facet_fields.type[i])
                  .pivot[0].pivot[0].value
          } [${this.facet.facet_fields.type[i + 1]}]`
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
                  o =>
                    o.value.toString() === this.facet.facet_fields.language[i]
                ).pivot[0].value
              : this.facet.facet_pivot[
                  "language,reference_language,reference_language_en"
                ].find(
                  o =>
                    o.value.toString() === this.facet.facet_fields.language[i]
                ).pivot[0].pivot[0].value
          } [${this.facet.facet_fields.language[i + 1]}]`
        });
      }
      return languages;
    }
  },
  data: () => ({
    range: [1900, 2000],
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"],
    referenceTypeValue: [],
    showAdvancedSearch: false,
    infoAlert: null,
    filterCount: 2,
    showAlert: false
  }),
  mixins: [urlMixin, queryMixin],
  methods: {
    ...mapActions("search", ["resetSearch", "resetPage"]),
    handleExitLibrary() {
      this.$router.replace({ name: "searchReference" });
    },
    updateCheckbox(event, id) {
      this.$emit("update:advancedSearch", {
        value: event,
        id: id
      });
    },
    getSelectItems(id) {
      if (id === "referenceType") return this.getReferenceTypes;
      else if (id === "language") return this.getReferenceLanguages;
      return [];
    }
  }
};
</script>

<style scoped>
.search {
  background-color: #f6eddf;
}

.advancedSearch {
  background-color: #eedbbf;
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
