import Cite from "citation-js";
import templateStyles from "@/assets/templateStyles.json";
import { mapActions, mapState } from "vuex";

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
        { text: "APA", value: "apa" },
        { text: "Sedimentology", value: "sedimentology" }
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
      const namesSplitByComma = namesStr ? namesStr.split(",") : [];

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
    citation(clsJson, append = null, prepend = null) {
      return Cite(clsJson).format("bibliography", {
        format: "html",
        template: this.citationTemplate,
        lang: "en-US",
        prepend: prepend,
        append: append
      });
    }
  }
};

export default citationMixin;
