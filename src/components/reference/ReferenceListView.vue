<template>
  <div v-if="data.length > 0">
    <v-col class="px-0 d-print-none" md="3">
      <v-select
        :value="template"
        :items="templates"
        dense
        outlined
        hide-details
        :label="$t('common.citationStyle')"
        @change="changeTemplate($event)"
      >
      </v-select>
    </v-col>
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-item
        class="my-2"
        :reference="entity"
        :citation="citation(entity)"
      ></reference-item>
    </v-card-text>
  </div>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";

import Cite from "citation-js";

const styleConfig = Cite.plugins.config.get("@csl");

import templateStyles from "@/assets/templateStyles.json";

Object.entries(templateStyles).forEach(([k, v]) => {
  styleConfig.templates.add(k, v);
});

export default {
  components: { ReferenceItem },
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      template: "mla",
      templates: [
        { text: "MLA", value: "mla" },
        { text: "IEEE", value: "ieee" },
        { text: "APA", value: "apa" }
      ]
    };
  },
  methods: {
    changeTemplate(event) {
      this.template = event;
    },
    parseNames(namesStr) {
      const namesSplitByComma = namesStr.split(",");

      const authors = [];

      for (let i = 0; i < namesSplitByComma.length; i += 2) {
        const name = {
          given: namesSplitByComma[i + 1],
          family: namesSplitByComma[i]
        };

        authors.push(name);
      }

      return authors;
    },
    citation(reference) {
      const data = {
        id: reference.id,
        type: "article-journal",
        title: reference.title,
        DOI: reference.doi,
        author: this.parseNames(reference.author),
        issued: [
          {
            "date-parts": [reference.year]
          }
        ],
        "container-title": reference.book,
        volume: reference.volume,
        publisher: reference.publisher,
        page: reference.pages,
        URL: reference.url
      };

      return Cite(data).format("bibliography", {
        format: "html",
        template: this.template,
        lang: "en-US"
      });
    }
  },
  name: "ReferenceListView"
};
</script>
