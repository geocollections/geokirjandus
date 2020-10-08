<template>
  <div class="cite" v-html="citation(getCslJson)"></div>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
export default {
  name: "ReferenceCitation",
  props: {
    reference: {
      type: Object,
      required: true
    }
  },
  mixins: [citationMixin],
  computed: {
    getCslJson() {
      return {
        id: this.reference.id,
        type: "article-journal",
        title: this.reference.title,
        DOI: this.reference.doi,
        author: this.parseNames(this.reference.author),
        issued: [
          {
            "date-parts": [this.reference.year]
          }
        ],
        "container-title": this.reference.book ?? this.reference.journal_name,
        volume: this.reference.volume,
        publisher: this.reference.publisher,
        page: this.reference.pages,
        URL: this.reference.url
      };
    }
  }
};
</script>

<style scoped></style>
