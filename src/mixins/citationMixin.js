import Cite from "citation-js";
import templateStyles from "@/assets/templateStyles.json";
import {mapActions, mapState} from "vuex";

// Add custom template styles to Cite style configuration
const styleConfig = Cite.plugins.config.get("@csl");
Object.entries(templateStyles).forEach(([k, v]) => {
  styleConfig.templates.add(k, v);
});

const citationMixin = {
  data() {
    return {
      templates: [
        { text: "MLA", value: "mla" },
        { text: "IEEE", value: "ieee" },
        { text: "APA", value: "apa" }
      ]
    };
  },
  computed: {
    ...mapState("references", ["citationTemplate"])
  },
  methods: {
    ...mapActions("references", ["changeCitationTemplate"]),
    changeTemplate(event) {
      this.changeCitationTemplate(event);
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
        "container-title": reference.book ?? reference.journal_name,
        volume: reference.volume,
        publisher: reference.publisher,
        page: reference.pages,
        URL: reference.url
      };

      return Cite(data).format("bibliography", {
        format: "html",
        template: this.citationTemplate,
        lang: "en-US"
      });
    }
  }
};

export default citationMixin;
