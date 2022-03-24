<template>
  <v-form @submit.prevent="handleSearch">
    <v-text-field
      id="searchField"
      solo
      hide-details
      v-model="query"
      clearable
      clear-icon="fa-times"
      :label="$t('common.search')"
    />
    <div class="d-flex align-center pt-2">
      <v-spacer />
      <search-help-dialog />
      <v-btn
        class="font-family-exo-2"
        type="submit"
        id="searchButton"
        color="#135ebf"
        dark
      >
        <v-icon left small>fas fa-search</v-icon>
        {{ $t("common.searchCommand") }}
      </v-btn>
    </div>

    <v-card flat color="transparent" class="rounded-lg">
      <v-card-title
        style="font-size: 1rem;font-family: 'Exo 2' !important"
        class="text-h6 pt-3 px-0 pb-2"
      >
        {{ $t("common.advancedSearch") }} [{{ count }}]
        <v-spacer />
        <v-hover v-slot="{ hover }">
          <v-chip
            color="#ea9219"
            outlined
            :class="{ 'pr-2': hover }"
            v-if="getAdvancedSearchParametersAppliedCount > 0"
          >
            <div class="pr-1 black--text">
              {{ getAdvancedSearchParametersAppliedCount }}
            </div>
            <v-icon x-small color="#ea9219">fas fa-filter</v-icon>

            <v-tooltip bottom open-delay="250">
              <template #activator="{on, attrs}">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="ml-1"
                  v-show="hover"
                  icon
                  x-small
                  @click="$emit('reset:search')"
                >
                  <v-icon x-small>fas fa-times</v-icon>
                </v-btn>
              </template>
              {{ $t("tooltip.removeFilters") }}
            </v-tooltip>
          </v-chip>
        </v-hover>
      </v-card-title>
      <div>
        <input-text
          v-model="author"
          :label="$t(advancedSearch.byIds.author.label)"
          @blur="handleSearch"
        />
        <input-range
          v-model="year"
          :label="$t(advancedSearch.byIds.year.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="title"
          :label="$t(advancedSearch.byIds.title.label)"
          @blur="handleSearch"
        />
      </div>
    </v-card>
  </v-form>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapActions, mapState } from "vuex";
import { isEqual } from "lodash";
import urlMixin from "@/mixins/urlMixin";
import SearchHelpDialog from "@/components/SearchHelpDialog";
import InputText from "../input/InputText.vue";
import InputRange from "../input/InputRange.vue";

export default {
  name: "SearchLibrary",
  components: {
    SearchHelpDialog,
    InputText,
    InputRange
  },
  mixins: [urlMixin],
  props: {
    colSize: {
      type: Number,
      default: 6
    }
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
    showAlert: false
  }),
  computed: {
    ...mapFields("search/library", {
      author: "advancedSearch.byIds.author.value",
      year: "advancedSearch.byIds.year.value",
      title: "advancedSearch.byIds.title.value",
      query: "search.value"
    }),
    ...mapState("result/library", ["facet", "count"]),
    ...mapState("search/library", ["advancedSearch"]),

    getAdvancedSearchParametersAppliedCount() {
      let count = 0;

      this.advancedSearch.allIds.forEach(id => {
        const obj = this.advancedSearch.byIds[id];
        if (obj.type === "text") {
          if (obj.value?.length > 0) {
            count++;
          }
        } else if (obj.type === "select") {
          if (obj.value.length > 0) {
            count++;
          }
        } else if (obj.type === "range") {
          const start = obj.value[0];
          const end = obj.value[1];

          if (
            (typeof start === "number" && isFinite(start)) ||
            (typeof end === "number" && isFinite(end))
          ) {
            count++;
          }
        } else if (obj.type === "checkbox") {
          if (obj.value === "1") count++;
        }
      });

      return count;
    }
  },
  created() {
    Object.entries(this.$route.query).forEach(([key, value]) => {
      if (key === "query") {
        this.query = value;
        return;
      }
      const type = this.advancedSearch.byIds[key].type;

      if (type === "text") {
        this[key] = value;
        return;
      }

      if (type === "range") {
        if (!value.includes("-")) return;

        const [start, end] = value.split("-");

        if (!isNaN(Number(start))) this[key][0] = start;
        if (!isNaN(Number(end))) this[key][1] = end;

        return;
      }
      if (type === "select") {
        const values = value.split(",").filter(strValue => {
          return !isNaN(Number(strValue));
        });

        this[key] = values;
      }
      if (type === "checkbox") {
        this[key] = "1";
      }
    });
  },
  methods: {
    ...mapActions("library", ["setLibraries"]),

    handleExitLibrary() {
      this.$router.replace({ name: "searchReference" });
    },
    isEmpty(str) {
      return !str || str.length === 0;
    },
    updateQueryParams() {
      const query = {};
      if (!this.isEmpty(this.query)) {
        query.query = this.query;
      }

      if (!this.isEmpty(this.author)) {
        query.author = this.author;
      }

      if (!this.isEmpty(this.title)) {
        query.title = this.title;
      }

      if (this.year[0] !== null || this.year[1] !== null) {
        const start = this.year[0] !== null ? this.year[0] : "*";
        const end = this.year[1] !== null ? this.year[1] : "*";

        query.year = `${start}-${end}`;
      }

      if (!isEqual(this.$route.query, query)) {
        this.$router.push({ ...this.$route, query: query });
      }
    },
    async handleSearch() {
      this.updateQueryParams();
      this.$emit("update:data");
    }
  }
};
</script>

<style scoped>
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
