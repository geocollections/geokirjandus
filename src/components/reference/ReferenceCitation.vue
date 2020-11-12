<template>
  <div v-if="onlyText" v-html="citation(getCslJson)"></div>
  <div v-else>
    <router-link
      class="referenceLink"
      :to="{
        name: `reference`,
        params: { ...this.$route.params, id: this.reference.id }
      }"
      v-html="citation(getCslJson)"
    />
    <reference-links :item="reference" x-small />
  </div>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
export default {
  name: "ReferenceCitation",
  components: { ReferenceLinks },
  props: {
    reference: {
      type: Object,
      required: true
    },
    onlyText: {
      type: Boolean
    }
  },
  mixins: [citationMixin],
  computed: {
    getCslJson() {
      return {
        id: this.reference.id,
        type: this.reference.reference_csl_type,
        title: this.reference.title,
        DOI: this.reference.doi,
        author: this.parseNames(this.reference.author),
        issued: [
          {
            "date-parts": [this.reference.year]
          }
        ],
        editor: this.parseNames(this.reference.editor),
        "container-title": this.reference.book ?? this.reference.journal_name,
        volume: this.reference.volume,
        number: this.reference.number,
        publisher: this.reference.publisher,
        "publisher-place": this.reference.publisher_place,
        page: this.reference.pages,
        URL: this.reference.url
      };
    }
  }
};
</script>

<style scoped>
.referenceLink {
  color: black;
  text-decoration: none;
}

.referenceLink:hover {
  text-decoration: underline;
}

.referenceLink >>> .csl-bib-body {
  display: inline;
}

.referenceLink >>> .csl-entry {
  display: inline;
}
</style>
