import actions from "@/store/modules/search/actions";
import mutations from "@/store/modules/search/mutations";
import { getField } from "vuex-map-fields";

const INIT_STATE = {
  options: {
    page: 1,
    itemsPerPage: 50,
    sortBy: ["date_added"],
    sortDesc: [true],
    groupBy: [],
    groupDesc: [],
    multiSort: true,
    mustSort: false
  },
  search: {
    id: "search",
    value: null,
    type: "text",
    lookUpType: null
  },
  advancedSearch: {
    byIds: {
      author: {
        type: "text",
        id: "author",
        lookUpType: "contains",
        value: "",
        label: "library.author",
        fields: ["author"]
      },
      year: {
        type: "range",
        id: "year",
        lookUpType: "range",
        value: [null, null],
        label: "library.year",
        placeholders: ["common.start", "common.end"],
        fields: ["year"]
      },
      title: {
        type: "text",
        id: "title",
        lookUpType: "equals",
        value: null,
        label: "library.title",
        fields: ["title"]
      }
    },
    allIds: ["author", "year", "title"]
  },
  lookUpTypes: [
    { text: "lookUpType.equals", value: "equals", symbol: "=" },
    { text: "lookUpType.contains", value: "contains", symbol: "*" },
    { text: "lookUpType.startsWith", value: "startsWith", symbol: "*=" },
    { text: "lookUpType.endsWith", value: "endsWith", symbol: "*=" },
    { text: "lookUpType.notContains", value: "notContains", symbol: "!*" }
  ]
};
const state = () => {
  return INIT_STATE;
};

export default {
  namespaced: true,
  state,
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField
  },
  actions,
  mutations
};
