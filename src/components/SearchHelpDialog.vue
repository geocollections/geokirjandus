<template>
  <v-dialog v-model="open" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        icon
        small
        aria-label="info"
        color="primary"
        class="mr-1"
        id="searchHelpButton"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>fas fa-info</v-icon>
      </v-btn>
    </template>
    <v-card v-if="help">
      <v-card-title v-translate="{ et: help.title_et, en: help.title_en }" />
      <v-card-text v-translate="{ et: help.content_et, en: help.content_en }" />
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "SearchHelpDialog",
  data() {
    return {
      open: false,
      help: null
    };
  },
  created() {
    this.getHelp();
  },
  methods: {
    getHelp() {
      axios.get("https://api.geocollections.info/page/76").then(res => {
        this.help = res.data.results[0];
      });
    }
  }
};
</script>

<style scoped></style>
