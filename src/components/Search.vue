<template>
  <div class="table-view-search">
    <v-list rounded>
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            hide-details
            :value="search.value"
            :label="$t('common.search')"
            @input="$emit('update:search', $event)"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-item-title>{{
            $t("common.advancedSearch")
          }}</v-list-item-title>
        </template>
        <v-list-item dense :key="index" v-for="(id, index) in advancedSearch.allIds">
          <!-- REGULAR SEARCH FIELD -->
          <v-row class="pa-2" v-if="advancedSearch.byIds[id].type === 'text'">
            <v-col cols="3" class="py-0 px-1">
              <v-select
                :value="advancedSearch.byIds[id].lookUpType || 'contains'"
                :color="bodyActiveColor"
                :item-color="bodyActiveColor"
                disable-lookup
                hide-details
                :items="translatedLookUpTypes"
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
              </v-select>
            </v-col>

            <v-col cols="9" class="py-0 px-1">
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
            <v-col cols="3" class="py-0">
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
          </v-row>
          <v-row
            v-if="advancedSearch.byIds[id].type === 'checkbox'"
            class="px-2"
          >
            <v-checkbox
              :label="$t(advancedSearch.byIds[id].label)"
              class="mt-0 pr-6"
              :color="bodyActiveColor"
              false-value="0"
              true-value="1"
              :indeterminate="isIndeterminate(advancedSearch.byIds[id].value)"
              hide-details
              :value="advancedSearch.byIds[id].value"
              @change="updateCheckbox($event, id)"
            ></v-checkbox>
          </v-row>
        </v-list-item>
      </v-list-group>
      <v-list-item>
        <v-btn @click="$emit('reset:parameters')" color="red" dark>
          <v-icon left>fas fa-filter</v-icon>
          {{ $t("common.deleteSearch") }}
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Search",
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