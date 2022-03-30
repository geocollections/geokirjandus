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

    <v-card id="advancedSearch" flat color="transparent" class="rounded-lg">
      <v-card-title
        style="font-size: 1rem;font-family: 'Exo 2' !important"
        class="text-h6 pt-3 px-0 pb-2 d-block mb-2"
      >
        {{ $t("common.advancedSearch") }}
        [{{ count }}]
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
        <input-checkbox
          class="mb-3"
          :label="$t(advancedSearch.byIds.isEstonianReference.label)"
          v-model="isEstonianReference"
          @input="handleSearch"
        />
        <input-checkbox
          class="mb-3"
          :label="$t(advancedSearch.byIds.isEstonianAuthor.label)"
          v-model="isEstonianAuthor"
          @input="handleSearch"
        />
        <input-text
          v-model="author"
          :label="$t(advancedSearch.byIds.author.label)"
          @blur="handleSearch"
        />
        <input-range
          v-model="year"
          :label="$t(advancedSearch.byIds.year.label)"
          :fieldLabels="{ min: $t('common.start'), max: $t('common.end') }"
          @blur="handleSearch"
        />
        <input-text
          v-model="title"
          :label="$t(advancedSearch.byIds.title.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="book"
          :label="$t(advancedSearch.byIds.book.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="journal"
          :label="$t(advancedSearch.byIds.journal.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="abstract"
          :label="$t(advancedSearch.byIds.abstract.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="keywords"
          :label="$t(advancedSearch.byIds.keywords.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="publisher"
          :label="$t(advancedSearch.byIds.publisher.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="volumeAndNumber"
          :label="$t(advancedSearch.byIds.volumeAndNumber.label)"
          @blur="handleSearch"
        />

        <input-select
          v-model="type"
          :label="$t(advancedSearch.byIds.type.label)"
          :items="getSelectItems('referenceType')"
          @blur="handleSearch"
        />

        <input-select
          v-model="language"
          :label="$t(advancedSearch.byIds.language.label)"
          :items="getSelectItems('language')"
          @blur="handleSearch"
        />

        <input-text
          v-model="localities"
          :label="$t(advancedSearch.byIds.localities.label)"
          @blur="handleSearch"
        />
        <input-text
          v-model="taxa"
          :label="$t(advancedSearch.byIds.taxa.label)"
          @blur="handleSearch"
        />
      </div>
    </v-card>
  </v-form>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
import isEqual from "lodash/isEqual";
import urlMixin from "@/mixins/urlMixin";
import SearchHelpDialog from "@/components/SearchHelpDialog";
import InputText from "../input/InputText.vue";
import InputRange from "../input/InputRange.vue";
import InputSelect from "../input/InputSelect.vue";
import InputCheckbox from "../input/InputCheckbox.vue";

export default {
  name: "SearchReference",
  components: {
    SearchHelpDialog,
    InputText,
    InputRange,
    InputSelect,
    InputCheckbox
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
    ...mapFields("search/reference", {
      author: "advancedSearch.byIds.author.value",
      year: "advancedSearch.byIds.year.value",
      title: "advancedSearch.byIds.title.value",
      localities: "advancedSearch.byIds.localities.value",
      book: "advancedSearch.byIds.book.value",
      type: "advancedSearch.byIds.type.value",
      language: "advancedSearch.byIds.language.value",
      journal: "advancedSearch.byIds.journal.value",
      abstract: "advancedSearch.byIds.abstract.value",
      isEstonianAuthor: "advancedSearch.byIds.isEstonianAuthor.value",
      isEstonianReference: "advancedSearch.byIds.isEstonianReference.value",
      keywords: "advancedSearch.byIds.keywords.value",
      volumeAndNumber: "advancedSearch.byIds.volumeAndNumber.value",
      publisher: "advancedSearch.byIds.publisher.value",
      taxa: "advancedSearch.byIds.taxa.value",
      query: "search.value"
    }),
    ...mapState("result/reference", ["facet", "result", "count"]),
    ...mapState("search/reference", ["advancedSearch"]),

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
    getSelectItems(id) {
      if (id === "referenceType") return this.getReferenceTypes;
      else if (id === "language") return this.getReferenceLanguages;
      return [];
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
      if (!this.isEmpty(this.book)) {
        query.book = this.book;
      }
      if (!this.isEmpty(this.journal)) {
        query.journal = this.journal;
      }
      if (!this.isEmpty(this.abstract)) {
        query.abstract = this.abstract;
      }
      if (!this.isEmpty(this.keywords)) {
        query.keywords = this.keywords;
      }
      if (!this.isEmpty(this.volumeAndNumber)) {
        query.volumeAndNumber = this.volumeAndNumber;
      }
      if (!this.isEmpty(this.localities)) {
        query.localities = this.localities;
      }
      if (!this.isEmpty(this.taxa)) {
        query.taxa = this.taxa;
      }
      if (this.isEstonianAuthor === "1") {
        query.isEstonianAuthor = null;
      }
      if (this.isEstonianReference === "1") {
        query.isEstonianReference = null;
      }
      if (this.year[0] !== null || this.year[1] !== null) {
        const start = this.year[0] !== null ? this.year[0] : "*";
        const end = this.year[1] !== null ? this.year[1] : "*";

        query.year = `${start}-${end}`;
      }
      if (this.type.length > 0) {
        query.type = this.type.join(",");
      }

      if (this.language.length > 0) {
        query.language = this.language.join(",");
      }

      if (!isEqual(this.$route.query, query)) {
        this.$router.push({ ...this.$route, query: query });
      }
    },
    async handleSearch() {
      const oldQuery = this.$route.query;
      this.updateQueryParams();
      const newQuery = this.$route.query;

      if (isEqual(oldQuery, newQuery)) return;

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
