<template>
  <v-btn icon @click="copyToClipboard">
    <v-icon>fas fa-copy</v-icon>
  </v-btn>
</template>

<script>
import toastMixin from "../mixins/toastMixin";

export default {
  name: "ExportButton",
  mixins: [toastMixin],
  props: {
    tableData: {
      type: Array
    },
    clipboardClass: {
      type: String,
      required: false
    },
    small: Boolean
  },
  methods: {
    copyToClipboard() {
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

      this.toastSuccess({ text: this.$t("messages.copy") });
    }
  }
};
</script>
