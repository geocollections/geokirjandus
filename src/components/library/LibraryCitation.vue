<template>
  <router-link
    v-if="short"
    class="libraryLink"
    :to="`/library/${library.id}`"
    tag="div"
    v-html="citation(getCslJson)"
  />
  <div v-else v-html="citation(getCslJson, append)"></div>
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
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  mixins: [citationMixin, dateMixin],
  computed: {
    append() {
      return ` ${this.$t("common.visited")}: ${this.formatDate(Date.now())}`;
    },
    getCslJson() {
      return {
        id: this.library.id,
        type: "webpage",
        author: this.parseNames(this.library.author),
        issued: [
          {
            "date-parts": [this.library.year]
          }
        ],
        publisher: this.$t("common.libraryPublisher"),
        "container-title": this.library.title,
        URL: `https:/rmtk.geoloogia.info/library/${this.library.id}`
      };
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
}
</style>
