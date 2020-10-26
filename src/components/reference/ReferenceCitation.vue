<template>
  <div v-if="onlyText" class="cite" v-html="citation(getCslJson)"></div>
  <router-link :to="ref" class="referenceLink" v-else>
    <div class="cite" v-html="citation(getCslJson, append)"></div>
  </router-link>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";
import Vue from "vue";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import ReferenceCitationPrepend from "@/components/reference/ReferenceCitationPrepend";
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
    ref() {
      return `/reference/${this.reference.id}`;
    },
    prepend() {
      const ComponentClass = Vue.extend(ReferenceCitationPrepend);
      const instance = new ComponentClass({
        propsData: {
          id: this.reference.id
        }
      });
      instance.$mount();
      return instance.$el.innerHTML;
    },
    append() {
      const ComponentClass = Vue.extend(ReferenceLinks);
      const instance = new ComponentClass({
        propsData: {
          item: this.reference,
          xSmall: true
        }
      });
      instance.$mount();
      return instance.$el.innerHTML;
    },
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
</style>
