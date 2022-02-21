<template>
  <div v-if="onlyText" v-html="citation(csl)"></div>
  <div v-else>
    <router-link
      class="referenceLink"
      :to="{
        name: `reference`,
        params: { ...$route.params, id: reference.id }
      }"
      v-html="citation($getCsl(reference))"
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
  mixins: [citationMixin],
  props: {
    reference: {
      type: Object,
      required: true
    },
    onlyText: {
      type: Boolean
    }
  },
  computed: {
    csl() {
      console.log(this.$getCsl(this.reference));
      return this.$getCsl(this.reference);
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
