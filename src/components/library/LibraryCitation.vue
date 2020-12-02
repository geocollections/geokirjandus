<template>
  <router-link
    v-if="short"
    class="libraryLink"
    :to="{
      name: `library`,
      params: { ...$route.params, id: library.id }
    }"
    tag="div"
    v-html="citation($getWebpageCsl(library))"
  />
  <div v-else v-html="citation($getWebpageCsl(library), append)"></div>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
import dateMixin from "@/mixins/dateMixin";

export default {
  name: "LibraryCitation",
  mixins: [citationMixin, dateMixin],
  props: {
    library: {
      type: Object,
      required: true
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    append() {
      return ` ${this.$t("common.visited")}: ${this.formatDate(Date.now())}`;
    }
  }
};
</script>

<style scoped>
.libraryLink {
  color: black;
  text-decoration: none;
}

.libraryLink:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
