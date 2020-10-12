<template>
  <div v-if="onlyText" class="cite" v-html="citation(getCslJson)"></div>
  <div v-else class="cite" v-html="citation(getCslJson, append, prepend)"></div>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
import Vue from "vue";
import ReferenceLinks from "@/components/reference/ReferenceLinks";

export default {
  name: "ReferenceCitation",
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
    prepend() {
      return `<a class="pr-1 d-print-none" href="/reference/${this.reference.id}">[${this.reference.id}]</a>`;
    },
    append() {
      const ComponentClass = Vue.extend(ReferenceLinks);
      const instance = new ComponentClass({
        propsData: {
          item: this.reference
        }
      });
      instance.$mount();
      return instance.$el.innerHTML;
    },
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
