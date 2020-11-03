<template>
  <v-btn small icon @click="copyText()">
    <v-icon small>fas fa-copy</v-icon>
  </v-btn>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "CopyButton",
  props: {
    text: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: "Copied"
    }
  },
  mixins: [toastMixin],
  methods: {
    copyText() {
      navigator.clipboard.writeText(this.text);
      this.toastInfo({ text: this.message });
    }
  }
};
</script>

<style scoped></style>
