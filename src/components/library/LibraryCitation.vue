<template>
  <div v-html="citation(getCslJson, append)"></div>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
import dateMixin from "@/mixins/dateMixin";

export default {
  name: "LibraryCitation",
  props: {
    library: {
      type: Object,
      required: true
    }
  },
  mixins: [citationMixin, dateMixin],
  computed: {
    append() {
      return ` ${this.$t("common.visited")} ${this.formatDate(Date.now())}`;
    },
    getCslJson() {
      return {
        id: this.library.id,
        type: "webpage",
        title: this.library.title,
        author: this.parseNames(this.library.author),
        issued: [
          {
            "date-parts": [this.library.year]
          }
        ],
        "container-title": this.library.title,
        URL: `https:/rmtk.geoloogia.info/library/${this.library.id}`
      };
    }
  }
};
</script>

<style scoped></style>
