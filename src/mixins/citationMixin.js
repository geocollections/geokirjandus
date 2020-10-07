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
    ...mapState("settings", ["citationTemplate"])
  },
  methods: {
    ...mapActions("settings", ["changeCitationTemplate"]),
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
    citation(obj) {
      const data = {
        id: obj.id,
        type: "article-journal",
        title: obj.title,
        DOI: obj.doi,
        author: this.parseNames(obj.author),
        issued: [
          {
            "date-parts": [obj.year]
          }
        ],
        "container-title": obj.book ?? obj.journal_name,
        volume: obj.volume,
        publisher: obj.publisher,
        page: obj.pages,
        URL: obj.url
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
