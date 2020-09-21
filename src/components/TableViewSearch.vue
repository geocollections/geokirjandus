<template>
  <div class="table-view-search">
    <v-row>
      <v-col>
        <v-text-field
          :value="search.value"
          :label="$t('common.search')"
          @input="$emit('update:search', $event)"
        />
      </v-col>
    </v-row>
    <v-row class="d-print-none" v-if="advancedSearch.allIds.length > 0">
      <v-col class="py-4">
        <!--   ADVANCED SEARCH   -->
        <v-card color="white" elevation="4">
          <v-card-title class="pb-0">
            <div
              class="card-title--clickable"
              @click="$emit('update:showAdvancedSearch', !showAdvancedSearch)"
            >
              <span>{{ $t("common.advancedSearch") }}</span>
              <!--              <v-icon right :color="bodyActiveColor">fas fa-search</v-icon>-->
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="$emit('update:showAdvancedSearch', !showAdvancedSearch)"
              :color="bodyActiveColor"
            >
              <v-icon>{{
                showAdvancedSearch ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pt-0">
            <transition enter-active-class="animated zoomIn faster">
              <div v-show="showAdvancedSearch">
                <v-row>
                  <v-col
                    cols="12"
                    :md="colSize"
                    v-for="(id, index) in advancedSearch.allIds"
                    :key="index + 'field'"
                    class="py-0"
                  >
                    <!--                    &lt;!&ndash; DATEPICKER &ndash;&gt;-->
                    <!--                    <v-row v-if="field.isDate" class="pa-2">-->
                    <!--                      <v-col cols="12" class="py-0 px-1">-->
                    <!--                        <v-menu-->
                    <!--                          v-model="calendarMenus[field.id]"-->
                    <!--                          :close-on-content-click="false"-->
                    <!--                          :nudge-right="40"-->
                    <!--                          transition="scale-transition"-->
                    <!--                          offset-y-->
                    <!--                          min-width="290px"-->
                    <!--                        >-->
                    <!--                          <template v-slot:activator="{ on }">-->
                    <!--                            <v-text-field-->
                    <!--                              hide-details-->
                    <!--                              :value="searchParameters[field.id]"-->
                    <!--                              :label="$t(field.title)"-->
                    <!--                              prepend-inner-icon="far fa-calendar-alt"-->
                    <!--                              :color="bodyActiveColor"-->
                    <!--                              clearable-->
                    <!--                              @click:clear="-->
                    <!--                                $emit('update:searchParameters', null, field.id)-->
                    <!--                              "-->
                    <!--                              clear-icon="fas fa-times"-->
                    <!--                              readonly-->
                    <!--                              :class="bodyActiveColor + '&#45;&#45;text'"-->
                    <!--                              v-on="on"-->
                    <!--                            ></v-text-field>-->
                    <!--                          </template>-->
                    <!--                          <v-date-picker-->
                    <!--                            :value="searchParameters[field.id]"-->
                    <!--                            @input="updateDate($event, field.id)"-->
                    <!--                            :color="bodyActiveColor"-->
                    <!--                            :header-color="`${bodyActiveColor} darken-3`"-->
                    <!--                            scrollable-->
                    <!--                          ></v-date-picker>-->
                    <!--                        </v-menu>-->
                    <!--                      </v-col>-->
                    <!--                    </v-row>-->

                    <!-- REGULAR SEARCH FIELD -->
                    <v-row
                      class="pa-2"
                      v-if="advancedSearch.byIds[id].type === 'text'"
                    >
                      <v-col cols="3" xl="2" class="py-0 px-1">
                        <!--  TODO: change emit field key to id  -->
                        <v-select
                          :value="
                            advancedSearch.byIds[id].lookUpType || 'contains'
                          "
                          :color="bodyActiveColor"
                          :item-color="bodyActiveColor"
                          disable-lookup
                          hide-details
                          :items="translatedLookUpTypes"
                          :label="$t('common.lookUpType')"
                          @input="
                            $emit('update:advancedSearch', {
                              lookUpType: $event,
                              id: id
                            })
                          "
                        >
                          <template v-slot:selection="{ item }">
                            <div class="font-weight-bold">
                              {{ item.symbol }}
                            </div>
                          </template>

                          <!--                        <template v-slot:item="{item}">-->
                          <!--                          <div class="v-list-item__content">-->
                          <!--                            <div class="v-list-item__title">-->
                          <!--                              <b>{{ item.text.split(" ")[0] }}</b>-->
                          <!--                              {{ item.text.split(" ")[1] }}-->
                          <!--                            </div>-->
                          <!--                          </div>-->
                          <!--                        </template>-->
                        </v-select>
                      </v-col>

                      <v-col cols="9" xl="10" class="py-0 px-1">
                        <v-text-field
                          :value="advancedSearch.byIds[id].value"
                          :label="$t(advancedSearch.byIds[id].label)"
                          :color="bodyActiveColor"
                          hide-details
                          :class="bodyActiveColor + '--text'"
                          @input="
                            $emit('update:advancedSearch', {
                              value: $event,
                              id: id
                            })
                          "
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!--  RANGE  -->
                    <v-row
                      class="pa-2"
                      v-else-if="advancedSearch.byIds[id].type === 'range'"
                    >
                      <v-col cols="3" xl="2" class="py-0">
                        <v-switch
                          :input-value="advancedSearch.byIds[id].active"
                          hide-details
                          @change="
                            $emit('update:advancedSearch', {
                              id: id,
                              active: $event
                            })
                          "
                        >
                        </v-switch>
                      </v-col>

                      <div class="col py-0">
                        <v-row>
                          <v-col cols="6" class="py-0 px-1">
                            <v-text-field

                              :value="advancedSearch.byIds[id].value[0]"
                              :disabled="!advancedSearch.byIds[id].active"
                              :label="$t(advancedSearch.byIds[id].label)"
                              hide-details
                              type="number"
                              @change="
                                $emit('update:advancedSearch', {
                                  value: [
                                    parseInt($event),
                                    advancedSearch.byIds[id].value[1]
                                  ],
                                  id: id
                                })
                              "
                            />

                          </v-col>

                          <v-col cols="6" class="py-0 px-1">
                            <v-text-field
                              :value="advancedSearch.byIds[id].value[1]"
                              :disabled="!advancedSearch.byIds[id].active"
                              hide-details
                              single-line
                              type="number"
                              @change="
                                $emit('update:advancedSearch', {
                                  value: [
                                    advancedSearch.byIds[id].value[0],
                                    parseInt($event)
                                  ],
                                  id: id
                                })
                              "
                            />
                          </v-col>
                        </v-row>
                      </div>

                      <!--  TODO: Get year dynamically  -->

                      <!--                        <v-range-slider-->
                      <!--                            :max="2020"-->
                      <!--                            :min="1700"-->
                      <!--                            hide-details-->
                      <!--                            class="align-center"-->
                      <!--                            :value="advancedSearch.byIds[id].value"-->

                      <!--                            @mousemove="test"-->
                      <!--                            @change="-->
                      <!--                            $emit('update:advancedSearch', {-->
                      <!--                              value: $event,-->
                      <!--                              id: id-->
                      <!--                            })-->
                      <!--                          "-->
                      <!--                        >-->
                      <!--                          <template v-slot:prepend>-->
                      <!--                            <v-text-field-->
                      <!--                                :value="advancedSearch.byIds[id].value[0]"-->
                      <!--                                class="mt-0 pt-0"-->
                      <!--                                hide-details-->
                      <!--                                single-line-->
                      <!--                                type="number"-->
                      <!--                                style="width: 60px"-->
                      <!--                                @change="$emit('update:advancedSearch', {-->
                      <!--                              value: [parseInt($event), advancedSearch.byIds[id].value[1]],-->
                      <!--                              id: id-->
                      <!--                            })"-->
                      <!--                            ></v-text-field>-->
                      <!--                          </template>-->
                      <!--                          <template v-slot:append>-->
                      <!--                            <v-text-field-->
                      <!--                                :value="advancedSearch.byIds[id].value[1]"-->
                      <!--                                class="mt-0 pt-0"-->
                      <!--                                hide-details-->
                      <!--                                single-line-->
                      <!--                                type="number"-->
                      <!--                                style="width: 60px"-->
                      <!--                                @change="$emit('update:advancedSearch', {-->
                      <!--                              value: [advancedSearch.byIds[id].value[0], parseInt($event)],-->
                      <!--                              id: id-->
                      <!--                            })"-->
                      <!--                            ></v-text-field>-->
                      <!--                          </template>-->
                      <!--                        </v-range-slider>-->
                    </v-row>
                  </v-col>
                </v-row>
                <!-- CHECKBOXES -->
                <v-row class="px-3 mt-3 checkboxes">
                  <v-col
                    cols="12"
                    class="py-0"
                    v-for="(id, idx) in advancedSearch.allIds"
                    :key="idx + 'check'"
                  >
                    <v-row v-if="advancedSearch.byIds[id].type === 'checkbox'">
                      <v-checkbox
                        :label="$t(advancedSearch.byIds[id].label)"
                        class="mt-0 pr-6"
                        :color="bodyActiveColor"
                        false-value="0"
                        true-value="1"
                        :indeterminate="
                          isIndeterminate(advancedSearch.byIds[id].value)
                        "
                        hide-details
                        :value="advancedSearch.byIds[id].value"
                        @change="updateCheckbox($event, id)"
                      ></v-checkbox>
                    </v-row>
                  </v-col>
                </v-row>

                <!-- RESET SEARCH PREFERENCES -->
                <v-row class="mt-3">
                  <v-col cols="12">
                    <v-btn
                      @click="$emit('reset:parameters')"
                      color="red"
                      dark
                    >
                      <v-icon left>fas fa-filter</v-icon>
                      {{ $t("common.deleteSearch") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Slider from "@/components/Slider";

export default {
  name: "TableViewSearch",
  props: {
    showAdvancedSearch: {
      type: Boolean,
      required: true
    },
    search: {
      type: Object
    },
    searchParameters: {
      type: Object
    },
    advancedSearch: {
      type: Object,
      default: function() {
        return [];
      }
    },
    colSize: {
      type: Number,
      default: 6
    }
  },
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["lookUpTypes"]),
    translatedLookUpTypes() {
      return this.lookUpTypes.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    }
  },
  data: () => ({
    range: [1900, 2000],
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"]
  }),
  methods: {
    test(event) {
      console.log(event);
    },
    isIndeterminate(value) {
      return !value ? true : false;
    },
    updateCheckbox(event, id) {
      if (this.advancedSearch.byIds[id].value === "0") {
        this.$emit("update:advancedSearch", {
          value: null,
          id: id
        });
      } else {
        this.$emit("update:advancedSearch", {
          value: event,
          id: id
        });
      }
    },
    updateDate(event, fieldId, index) {
      this.$emit("update:searchParameters", event, fieldId);
      this.calendarMenus[fieldId] = false;
    }
  }
};
</script>

<style scoped>
.checkboxes >>> .v-label {
  margin-bottom: 0;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

.table-view-search >>> .v-text-field__slot input {
  color: unset;
  font-weight: bold;
}
</style>
