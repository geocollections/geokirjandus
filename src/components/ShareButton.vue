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
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>fas fa-share-alt</v-icon>
      </v-btn>
    </template>
    <v-card color="#F6EDDF">
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
          </v-radio-group>
          <v-select
            v-if="$route.name !== 'reference'"
            :label="$t('common.amount')"
            hide-details
            :items="selectItems"
            v-model="exportCount"
          >
          </v-select>

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

export default {
  name: "ShareButton",
  components: { CopyButton },
  mixins: [urlMixin, toastMixin, queryMixin],
  data() {
    return {
      open: false,
      exportType: "csv",
      exportCount: "10",
      selectItems: [
        { value: "10", text: "10" },
        { value: "25", text: "25" },
        { value: "50", text: "50" },
        { value: "100", text: "100" },
        { value: "1000", text: "1000" },
        { value: "1000000", text: this.$t("common.all") }
      ],
      filename: ""
    };
  },
  computed: {
    ...mapState("settings", ["view"]),

    getFileSuffix() {
      if (this.exportType === "ris") {
        return ".ris";
      }
      if (this.exportType === "csv") {
        return ".csv";
      }
      return "";
    },
    getShareURL() {
      // FIXME:  Add library id if inside a library
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
          default:
            break;
        }
      };

      if (this.$route.name === "library") {
        fetchLibraryReferences(this.$route.params.id, {
          search: this.getSearch,
          advancedSearch: this.getAdvancedSearch.byIds,
          sortBy: this.getSortBy,
          sortDesc: this.getSortDesc,
          paginateBy: parseInt(this.exportCount)
        }).then(res => {
          const filename =
            this.filename.length > 0 ? this.filename : "exportFile";

          createFile(filename, this.exportType, res.results);
        });
      } else if (this.$route.name === "reference") {
        fetchReference(this.$route.params.id).then(res => {
          const filename =
            this.filename.length > 0 ? this.filename : "exportFile";

          createFile(filename, this.exportType, res.results);
        });
      } else {
        fetchReferences({
          search: this.getSearch,
          advancedSearch: this.getAdvancedSearch.byIds,
          sortBy: this.getSortBy,
          sortDesc: this.getSortDesc,
          paginateBy: parseInt(this.exportCount)
        }).then(res => {
          const filename =
            this.filename.length > 0 ? this.filename : "exportFile";

          createFile(filename, this.exportType, res.results);
        });
      }
    },
    exportToCSV(data, filename) {
      const failMsg = this.$t("messages.CSVExportFail");
      const successMsg = this.$t("messages.CSVExportSuccess");

      let csvString = this.convertJsonToCsv(data);

      if (csvString.length === 0) {
        this.toastError({ text: failMsg });
        return;
      }

      let file = new Blob([csvString], { type: "text/plain" });

      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename + ".csv");
      else {
        // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename + ".csv";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }

      this.toastSuccess({ text: successMsg });
    },

    convertJsonToCsv(jsonArray) {
      const { Parser } = require("json2csv");

      // Possibility to export exact fields for each object
      const fields = Object.keys(jsonArray[0]);
      const opts = { fields };

      try {
        const parser = new Parser(opts);
        return parser.parse(jsonArray);
      } catch (err) {
        this.toastError({ text: err });
        return "";
      }
    },

    exportToRIS(data, filename) {
      const failMsg = this.$t("messages.RISExportFail");
      const successMsg = this.$t("messages.RISExportSuccess");

      let risString = this.convertJsonToRis(data);

      if (risString.length === 0) {
        this.toastError({ text: failMsg });
        return;
      }

      let file = new Blob([risString], { type: "text/plain" });

      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename + ".ris");
      else {
        // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename + ".ris";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }

      this.toastSuccess({ text: successMsg });
    },

    convertJsonToRis(jsonArray) {
      let risString = "";

      if (jsonArray && jsonArray.length > 0) {
        jsonArray.forEach(item => {
          // Only write to string if type exists
          if (item.type && item.reference_ris_type) {
            risString += "TY  - " + item.reference_ris_type + "\n";

            // Todo: Add certain fields to certain types --> if (item.type__ris_type === 'JOUR') {} etc.

            if (item.title) risString += "TI  - " + item.title.trim() + "\n";
            if (item.title_translated)
              risString += "TT  - " + item.title_translated.trim() + "\n";

            if (item.author) {
              if (item.author.includes(".,")) {
                // Multiple authors
                item.author.split(".,").forEach(author => {
                  if (author.charAt(author.length - 1) === ".")
                    risString += "AU  - " + author.trim() + "\n";
                  else risString += "AU  - " + author.trim() + ".\n";
                });
              } else if (item.author.includes("&")) {
                item.author
                  .split("&")
                  .forEach(
                    author => (risString += "AU  - " + author.trim() + "\n")
                  );
              } else risString += "AU  - " + item.author.trim() + "\n";
            }

            if (item.year) risString += "PY  - " + item.year.trim() + "\n";

            if (
              item.journal &&
              item.journal__journal_name &&
              item.type__ris_type === "JOUR"
            ) {
              risString += "T2  - " + item.journal__journal_name.trim() + "\n";
              risString += "JO  - " + item.journal__journal_name.trim() + "\n";
            }

            if (item.book && item.type__ris_type === "BOOK") {
              risString += "BT  - " + item.book.trim() + "\n";
            }

            if (item.book_editor && item.type__ris_type === "BOOK") {
              risString += "ED  - " + item.book_editor.trim() + "\n";
            }

            if (item.publisher) {
              risString += "PB  - " + item.publisher.trim() + "\n";
            }

            if (item.publisher_place) {
              risString += "PP  - " + item.publisher_place.trim() + "\n";
            }

            if (item.isbn || item.issn) {
              risString += "SN  - ";
              if (item.isbn) risString += item.isbn.trim();
              if (item.issn) {
                risString += (item.isbn ? " / " : "") + item.issn.trim();
              }

              risString += "\n";
            }

            if (item.volume) risString += "VL  - " + item.volume.trim() + "\n";

            if (item.number) risString += "IS  - " + item.number.trim() + "\n";

            if (item.pages) {
              if (item.pages.includes("-")) {
                let startAndEndPage = item.pages.split("-");
                if (startAndEndPage[0])
                  risString += "SP  - " + startAndEndPage[0].trim() + "\n";
                if (startAndEndPage[1])
                  risString += "EP  - " + startAndEndPage[1].trim() + "\n";
              }
            }

            if (item.language && item.language__iso1)
              risString += "LA  - " + item.language__iso1.trim() + "\n";

            if (item.doi) risString += "DO  - " + item.doi.trim() + "\n";

            if (item.url) risString += "UR  - " + item.url.trim() + "\n";

            if (item.author_keywords) {
              if (item.author_keywords.includes(","))
                item.author_keywords
                  .split(",")
                  .forEach(
                    keyword => (risString += "KW  - " + keyword.trim() + "\n")
                  );
              else risString += "KW  - " + item.author_keywords.trim() + "\n";
            }

            if (item.abstract) {
              let abstractRegex = /(<\w+>|<\/\w+>)/g;
              let newAbstract = item.abstract.trim().replace(abstractRegex, "");
              risString += "AB  - " + newAbstract + "\n";
            }
            risString += "ER  - \n";
          }
        });
      }
      return risString;
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
