<template>
  <v-dialog v-model="open" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        small
        outlined
        tile
        aria-label="share"
        color="#E58124"
        class="mx-2 shareBtn"
        id="shareButton"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>fas fa-share-alt</v-icon>
      </v-btn>
    </template>
    <v-card color="#F6EDDF" id="shareHelp">
      <v-card-title>
        URL
        <v-card-actions>
          <copy-button clipboard-class="url" />
        </v-card-actions>
      </v-card-title>
      <v-card-text>
        <v-card outlined>
          <v-card-text class="url">
            {{ getShareURL }}
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-divider class="mx-3" />
      <v-card-title class="pb-0">{{ $t("common.exportFile") }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-radio-group class="pb-2" hide-details v-model="exportType" row>
            <v-radio color="#E58124" value="csv" label="CSV" />
            <v-radio color="#E58124" value="ris" label="RIS" />
            <v-radio color="#E58124" value="bibtex" label="BibTeX" />
          </v-radio-group>
          <v-combobox
            v-if="$route.name !== 'reference'"
            :label="$t('common.amount')"
            hide-details
            type="number"
            :items="selectItems"
            :value="exportCount"
            @input="exportCount = isNaN($event) ? $event.value : $event"
          >
          </v-combobox>

          <v-text-field
            v-model="filename"
            hide-details
            :suffix="getFileSuffix"
            :label="$t('common.filename')"
          />
          <v-btn class="mt-3" color="#E58124" dark @click="handleExport">{{
            $t("common.export")
          }}</v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="open = false">
          {{ $t("common.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import urlMixin from "@/mixins/urlMixin";
import toastMixin from "@/mixins/toastMixin";
import queryMixin from "@/mixins/queryMixin";
import {
  fetchLibraryReferences,
  fetchReference,
  fetchReferences
} from "@/utils/apiCalls";
import CopyButton from "@/components/CopyButton";
import Cite from "citation-js";
import citationMixin from "@/mixins/citationMixin";

export default {
  name: "ShareButton",
  components: { CopyButton },
  mixins: [urlMixin, toastMixin, queryMixin, citationMixin],
  data() {
    return {
      open: false,
      exportType: "csv",
      exportCount: 10,
      filename: ""
    };
  },
  computed: {
    ...mapState("settings", ["view"]),
    ...mapState("references", ["count"]),
    selectItems() {
      return [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
        { value: 1000, text: "1000" },
        { value: this.count, text: this.$t("common.all") }
      ];
    },
    getFileSuffix() {
      if (this.exportType === "ris") {
        return ".ris";
      }
      if (this.exportType === "csv") {
        return ".csv";
      }
      if (this.exportType === "bibtex") {
        return ".bib";
      }
      return "";
    },
    getShareURL() {
      let resolve;
      if (this.$route.name === "library") {
        resolve = this.$router.resolve({
          name: "query",
          query: this.setURLParameters({
            ...this.getAdvancedSearch.byIds,
            search: this.getSearch,
            library: this.$route.params.id
          })
        });
      } else {
        resolve = this.$router.resolve({
          name: "query",
          query: this.setURLParameters({
            ...this.getAdvancedSearch.byIds,
            search: this.getSearch
          })
        });
      }

      return `https://geoloogia.info${resolve.href}`;
    }
  },
  watch: {
    count: {
      handler() {
        this.exportCount = this.count;
      }
    }
  },
  methods: {
    handleExport() {
      const createFile = (filename, type, data) => {
        switch (type) {
          case "csv":
            this.exportToCSV(data, filename);
            break;
          case "ris":
            this.exportToRIS(data, filename);
            break;
          case "bibtex":
            this.exportToBibTeX(data, filename);
            break;
          default:
            break;
        }
      };

      const handleFileCreation = res => {
        const filename =
          this.filename.length > 0 ? this.filename : "exportFile";

        createFile(filename, this.exportType, res.results);
      };

      if (this.$route.name === "library") {
        fetchLibraryReferences(this.$route.params.id, {
          search: this.getSearch,
          advancedSearch: this.getAdvancedSearch.byIds,
          sortBy: this.getSortBy,
          sortDesc: this.getSortDesc,
          paginateBy: this.exportCount
        }).then(handleFileCreation);
      } else if (this.$route.name === "reference") {
        fetchReference(this.$route.params.id).then(handleFileCreation);
      } else {
        fetchReferences({
          search: this.getSearch,
          advancedSearch: this.getAdvancedSearch.byIds,
          sortBy: this.getSortBy,
          sortDesc: this.getSortDesc,
          paginateBy: parseInt(this.exportCount)
        }).then(handleFileCreation);
      }
    },
    exportToCSV(data, filename) {
      const failMsg = this.$t("messages.CSVExportFail");
      const successMsg = this.$t("messages.CSVExportSuccess");

      let csvString = this.convertToCSV(data);

      if (csvString.length === 0) {
        this.toastError({ text: failMsg });
        return;
      }

      this.exportFile(csvString, filename);

      this.toastSuccess({ text: successMsg });
    },

    convertToCSV(data) {
      const { Parser } = require("json2csv");

      // Possibility to export exact fields for each object
      const fields = Object.keys(data[0]);
      const opts = { fields };

      try {
        const parser = new Parser(opts);
        return parser.parse(data);
      } catch (err) {
        this.toastError({ text: err });
        return "";
      }
    },

    exportToRIS(data, filename) {
      const failMsg = this.$t("messages.RISExportFail");
      const successMsg = this.$t("messages.RISExportSuccess");

      let risString = this.convertToRIS(data);

      if (risString.length === 0) {
        this.toastError({ text: failMsg });
        return;
      }

      this.exportFile(risString, filename);

      this.toastSuccess({ text: successMsg });
    },
    convertToRIS(data) {
      const cslArray = data.map(reference => {
        return this.$getCsl(reference);
      });

      return Cite(cslArray).format("ris");
    },
    exportToBibTeX(data, filename) {
      const failMsg = this.$t("messages.RISExportFail");
      const successMsg = this.$t("messages.RISExportSuccess");

      let bibtexString = this.convertToBibTeX(data);

      if (bibtexString.length === 0) {
        this.toastError({ text: failMsg });
        return;
      }

      this.exportFile(bibtexString, filename);

      this.toastSuccess({ text: successMsg });
    },
    convertToBibTeX(data) {
      const cslArray = data.map(reference => {
        return this.$getCsl(reference);
      });

      return Cite(cslArray).format("bibtex");
    },

    exportFile(data, filename) {
      let file = new Blob([data], { type: "text/plain" });

      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(
          file,
          `${filename}${this.getFileSuffix}`
        );
      else {
        // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = `${filename}${this.getFileSuffix}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }
  }
};
</script>

<style scoped>
.shareBtn {
  border-radius: 4px;
}

.url {
  word-break: break-all;
}
</style>
