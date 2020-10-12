<template>
  <div class="table-view-search">
    <v-list class="mt-0">
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
      <v-list-group :value="true">
        <template v-slot:activator>
          <v-list-item-title>{{
            $t("common.advancedSearch")
          }}</v-list-item-title>
        </template>

        <v-list-item
          dense
          class=""
          :key="index"
          v-for="(id, index) in advancedSearch.allIds"
        >
          <!-- REGULAR SEARCH FIELD -->
          <v-row class="pa-1" v-if="advancedSearch.byIds[id].type === 'text'">
            <v-col cols="3" class="py-0 px-1">
              <v-select
                :value="advancedSearch.byIds[id].lookUpType || 'contains'"
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
                hide-details
                @input="
                  $emit('update:advancedSearch', {
                    value: $event,
                    id: id,
                    type: advancedSearch.byIds[id].type
                  })
                "
              ></v-text-field>
            </v-col>
          </v-row>

          <!--  RANGE  -->
          <v-row
            class="pa-1"
            v-else-if="advancedSearch.byIds[id].type === 'range'"
          >
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
                    :placeholder="$t(advancedSearch.byIds[id].placeholders[0])"
                    hide-details
                    type="number"
                    @input="
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
                    :placeholder="$t(advancedSearch.byIds[id].placeholders[1])"
                    single-line
                    type="number"
                    @input="
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
          <v-row
            v-if="advancedSearch.byIds[id].type === 'checkbox'"
            class="px-1"
          >
            <v-col class="py-0">
              <v-checkbox
                dense
                :label="$t(advancedSearch.byIds[id].label)"
                class="mt-0 pr-6"
                :false-value="null"
                true-value="1"
                hide-details
                :input-value="advancedSearch.byIds[id].value"
                @change="updateCheckbox($event, id)"
              />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list-group>
      <v-list-item>
        <v-btn @click="$emit('reset:parameters')" color="red" dark>
          <v-icon left>fas fa-trash</v-icon>
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
    search: {
      type: Object
    },
    searchParameters: {
      type: Object
    },
    advancedSearch: {
      type: Object
    },
    colSize: {
      type: Number,
      default: 6
    }
  },
  computed: {
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
    updateCheckbox(event, id) {
      this.$emit("update:advancedSearch", {
        value: event,
        id: id
      });
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
