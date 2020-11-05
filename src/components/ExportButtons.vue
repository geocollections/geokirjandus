<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template v-slot:activator="{ on }">
      <v-btn
        :icon="$vuetify.breakpoint.smAndDown"
        color="#E58124"
        dark
        v-on="on"
        :small="small"
      >
        <v-icon :small="small">fas fa-file-export</v-icon>
        <span v-if="!$vuetify.breakpoint.smAndDown" class="pl-1">{{
          $t("common.export")
        }}</span>
      </v-btn>
    </template>
    <v-list color="primary" dark dense>
      <v-list-item @click="exportToCSV">
        <v-list-item-title>
          <v-icon>far fa-file</v-icon>
          CSV &nbsp;
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="filename === 'reference'" @click="exportToRIS">
        <v-list-item-title>
          <v-icon>fas fa-file-download</v-icon>
          RIS &nbsp;
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="copyToClipboard">
        <v-list-item-title>
          <v-icon>far fa-copy</v-icon>
          {{ $t("common.copy") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import toastMixin from "../mixins/toastMixin";

export default {
  props: {
    filename: {
      type: String,
      default: "Geocollections Data Management"
    },
    tableData: {
      type: Array
    },
    clipboardClass: {
      type: String,
      required: false
    },
    small: Boolean
  },
  name: "ExportButtons",
  mixins: [toastMixin],

  methods: {
    exportToCSV() {
      if (this.tableData) {
        let csvString = this.convertJsonToCsv(this.tableData);

        if (csvString.length === 0) {
          this.toastError({ text: "Download failed: Not enough data!" });
          return;
        }

        let file = new Blob([csvString], { type: "text/plain" });

        if (window.navigator.msSaveOrOpenBlob)
          // IE10+
          window.navigator.msSaveOrOpenBlob(file, this.filename + ".csv");
        else {
          // Others
          let a = document.createElement("a");
          let url = URL.createObjectURL(file);
          a.href = url;
          a.download = this.filename + ".csv";
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }

        this.toastSuccess({ text: "Exported to <strong>CSV</strong>" });
      } else {
        this.toastError({ text: "Download failed: Not enough data!" });
      }
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

    copyToClipboard() {
      if (this.tableData) {
        let el;
        if (this.clipboardClass) {
          el = document.getElementsByClassName(this.clipboardClass);
        } else {
          el = document.getElementsByClassName(
            `${this.$route.meta.object}-table`
          );
        }

        let body = document.body,
          range,
          sel;
        if (document.createRange && window.getSelection) {
          range = document.createRange();
          sel = window.getSelection();
          sel.removeAllRanges();
          try {
            range.selectNodeContents(el[0]);
            sel.addRange(range);
          } catch (e) {
            range.selectNode(el[0]);
            sel.addRange(range);
          }
        } else if (body.createTextRange) {
          range = body.createTextRange();
          range.moveToElementText(el[0]);
          range.select();
        }
        document.execCommand("Copy");
        sel.removeAllRanges();

        this.toastSuccess({ text: "Copied to <strong>clipboard!</strong>" });
      } else {
        this.toastError({ text: "Copying failed: Nothing to copy!" });
      }
    },

    exportToRIS() {
      let risString = this.convertJsonToRis(this.tableData);

      if (risString.length === 0) {
        this.toastError({ text: "Download failed: Not enough data!" });
        return;
      }

      let file = new Blob([risString], { type: "text/plain" });

      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, this.filename + ".ris");
      else {
        // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = this.filename + ".ris";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }

      this.toastSuccess({ text: "Exported to <strong>RIS</strong>" });
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
