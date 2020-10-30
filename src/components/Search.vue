<template>
  <div class="search fill-height " style="background-color: #F6EDDF">
    <v-list class="mt-0 pb-10 pa-0">
      <v-list-item v-if="infoAlert" class="py-2">
        <v-alert
          class="ma-0"
          width="100%"
          dense
          colored-border
          border="right"
          type="info"
          color="#F1CDA7"
        >
          {{ $t(infoAlert) }}
        </v-alert>
      </v-list-item>

      <v-list-item class="py-4">
        <v-text-field
          solo
          hide-details
          :value="search.value"
          :label="$t('common.search')"
          @change="$emit('update:search', $event)"
        />
      </v-list-item>

      <v-list-group color="#B76315" v-model="showAdvancedSearch">
        <template v-slot:activator>
          <v-list-item-title>{{
            $t("common.advancedSearch")
          }}</v-list-item-title>
        </template>
        <div :key="index" v-for="(id, index) in advancedSearch.allIds">
          <!-- REGULAR SEARCH FIELD -->
          <v-list-item v-if="advancedSearch.byIds[id].type === 'text'" dense>
            <v-row class="pa-1">
              <!--              <v-col cols="3" class="py-0 px-1">-->
              <!--                <v-select-->
              <!--                  :value="advancedSearch.byIds[id].lookUpType || 'contains'"-->
              <!--                  disable-lookup-->
              <!--                  hide-details-->
              <!--                  :items="translatedLookUpTypes"-->
              <!--                  @change="-->
              <!--                    $emit('update:advancedSearch', {-->
              <!--                      lookUpType: $event,-->
              <!--                      id: id-->
              <!--                    })-->
              <!--                  "-->
              <!--                >-->
              <!--                  <template v-slot:selection="{ item }">-->
              <!--                    <div class="font-weight-bold">-->
              <!--                      {{ item.symbol }}-->
              <!--                    </div>-->
              <!--                  </template>-->
              <!--                </v-select>-->
              <!--              </v-col>-->

              <v-col cols="12" class="py-0 px-1">
                <v-text-field
                  :value="advancedSearch.byIds[id].value"
                  :label="$t(advancedSearch.byIds[id].label)"
                  hide-details
                  @change="
                    $emit('update:advancedSearch', {
                      value: $event,
                      id: id,
                      type: advancedSearch.byIds[id].type
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
                  multiple
                  :label="$t('reference.type')"
                  :value="advancedSearch.byIds[id].value"
                  :items="getReferenceTypes"
                  :menu-props="{ bottom: true, offsetY: true }"
                  hide-details
                  @change="
                    $emit('update:advancedSearch', {
                      value: $event,
                      id: id,
                      type: advancedSearch.byIds[id].type
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
                            advancedSearch.byIds[id].value[1]
                          ],
                          id: id,
                          type: advancedSearch.byIds[id].type
                        })
                      "
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0 px-1">
                    <v-text-field
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
                            isNaN($event) ? NaN : parseInt($event)
                          ],
                          id: id,
                          type: advancedSearch.byIds[id].type
                        })
                      "
                    />
                  </v-col>
                </v-row>
              </div>
            </v-row>
          </v-list-item>
        </div>
      </v-list-group>
      <v-list-item>
        <v-btn
          icon
          small
          tile
          style="border-radius: 4px"
          class="deleteSearch ml-auto mr-3"
          @click="$emit('reset:parameters')"
          dark
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
        <v-btn color="primary">
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
            :false-value="null"
            true-value="1"
            hide-details
            :input-value="advancedSearch.byIds[id].value"
            @change="updateCheckbox($event, id)"
          />
        </v-list-item>
      </div>
      <v-list-item>
        <citation-select />
      </v-list-item>
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

export default {
  name: "Search",
  components: { CitationSelect },
  props: {
    colSize: {
      type: Number,
      default: 6
    }
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
    count: {
      handler() {
        if (this.count === 1) {
          this.$router.push(`/reference/${this.result[0].id}`);
        }
      }
    },
    $route: {
      handler(to, from) {
        if (to.name === "library" && to.params.id) {
          this.resetSearch();
          this.infoAlert = "alert.infoLibrarySearch";
          if (this.$route.query) {
            this.setSearchFromURL(this.$route.query);
          }
        } else if (
          from !== undefined &&
          from.name === "library" &&
          to.name === "reference"
        ) {
          this.infoAlert = "alert.infoLibrarySearch";
        } else if (
          (to.name === "search" || to.name === "searchLib") &&
          from === undefined
        ) {
          this.resetSearch();
          this.infoAlert = null;
          if (this.$route.query) {
            this.setSearchFromURL(this.$route.query);
          }
        } else {
          this.infoAlert = null;
        }
      },
      immediate: true
    }
  },
  // created() {
  //   this.resetSearch();
  // },
  computed: {
    ...mapState("search", ["lookUpTypes"]),
    ...mapState("references", ["facet", "result", "count"]),
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
    translatedLookUpTypes() {
      return this.lookUpTypes.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    },
    getReferenceTypes() {
      let types = [];

      if (!this.facet.facet_fields) return types;

      for (let i = 0; i < this.facet.facet_fields.type.length; i += 2) {
        types.push({
          value: this.facet.facet_fields.type[i],
          text: `${
            this.$i18n.locale === "ee"
              ? this.facet.facet_fields.reference_type[i]
              : this.facet.facet_fields.reference_type_en[i]
          } [${this.facet.facet_fields.reference_type[i + 1]}]`
        });
      }

      return types;
    }
  },
  data: () => ({
    range: [1900, 2000],
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"],
    referenceTypeValue: [],
    showAdvancedSearch: false,
    infoAlert: null
  }),
  mixins: [urlMixin, queryMixin],
  methods: {
    ...mapActions("search", ["resetSearch", "resetPage", "setSearchFromURL"]),
    updateCheckbox(event, id) {
      this.$emit("update:advancedSearch", {
        value: event,
        id: id
      });
    }
  }
};
</script>

<style scoped lang="sass">
@import 'src/sass/variables.sass'

.deleteSearch
  background-color: $danger !important
</style>
