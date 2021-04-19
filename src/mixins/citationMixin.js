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
        { text: "APA 7", value: "apa" },
        { text: "Harvard", value: "harvard1" },
        { text: "Sedimentology", value: "sedimentology" },
        { text: "Geological magazine", value: "geol-mag" },
        { text: "Holocene", value: "holocene" },
        { text: "Nature", value: "nature" },
        { text: "Geology", value: "geology" },
        { text: "Palaeo3", value: "palaeo3" }
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
    citation(clsJson, append = null, prepend = null, format = "html") {
      if (format === "html") {
        return Cite(clsJson).format("bibliography", {
          format: "html",
          template: this.citationTemplate,
          lang: "en-US",
          prepend: prepend,
          append: append
        });
      }
      return Cite(clsJson).format("bibliography", {
        template: this.citationTemplate,
        lang: "en-US",
        prepend: prepend,
        append: append
      });
    }
  }
};

export default citationMixin;
