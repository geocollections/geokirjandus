<template>
  <v-form @submit.prevent="handleSearch">
    <v-text-field
      solo
      hide-details
      v-model="query"
      :label="$t('common.search')"
    />
    <div class="d-flex align-center pt-2">
      <v-btn
        icon
        small
        outlined
        tile
        color="red"
        class="deleteSearch"
        id="deleteSearchButton"
        aria-label="delete"
        @click="$emit('reset:search')"
      >
        <v-icon small>far fa-trash-alt</v-icon>
      </v-btn>

      <share-button />
      <v-spacer />
      <search-help-dialog />
      <v-btn
        class="text-capitalize"
        type="submit"
        id="searchButton"
        color="#1C9BDE"
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
        {{ $t("common.advancedSearch") }}
        [{{ count }}]
        <v-spacer />
        <v-chip
          color="#fd8719"
          outlined
          v-if="getAdvancedSearchParametersAppliedCount > 0"
        >
          <div class="pr-1 black--text">
            {{ getAdvancedSearchParametersAppliedCount }}
          </div>
          <v-icon x-small color="#fd8719">fas fa-filter</v-icon>
        </v-chip>
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
          :label="$t(advancedSearch.byIds.referenceType.label)"
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
import { mapActions, mapState } from "vuex";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import ShareButton from "@/components/ShareButton";
import SearchHelpDialog from "@/components/SearchHelpDialog";
import InputText from "../input/InputText.vue";
import InputRange from "../input/InputRange.vue";
import InputSelect from "../input/InputSelect.vue";
import InputCheckbox from "../input/InputCheckbox.vue";

export default {
  name: "SearchReference",
  components: {
    SearchHelpDialog,
    ShareButton,
    InputText,
    InputRange,
    InputSelect,
    InputCheckbox
  },
  mixins: [urlMixin, queryMixin],
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
      type: "advancedSearch.byIds.referenceType.value",
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
    ...mapState("references", ["facet", "result", "count"]),
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
  methods: {
    ...mapActions("search", ["resetSearch", "resetPage"]),
    ...mapActions("references", ["setReferences"]),
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
    },
    async handleSearch() {
      const res = await this.getReferences();
      this.setReferences(res);
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
