import actions from "@/store/modules/search/actions";
import mutations from "@/store/modules/search/mutations";
import { getField } from "vuex-map-fields";

const INIT_STATE = {
  options: {
    page: 1,
    itemsPerPage: 50,
    sortBy: [],
    sortDesc: [],
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
        label: "reference.author",
        fields: ["author"]
      },
      year: {
        type: "range",
        id: "year",
        lookUpType: "range",
        value: [null, null],
        label: "reference.year",
        placeholders: ["common.start", "common.end"],
        fields: ["year"]
      },
      title: {
        type: "text",
        id: "title",
        lookUpType: "equals",
        value: null,
        label: "reference.title",
        fields: ["title"]
      },
      localities: {
        type: "text",
        id: "localities",
        lookUpType: "equals",
        value: null,
        label: "reference.localities",
        fields: ["localities"]
      },
      book: {
        type: "text",
        id: "book",
        lookUpType: "equals",
        value: null,
        label: "reference.book",
        fields: ["book"]
      },
      type: {
        type: "select",
        id: "type",
        value: [],
        label: "reference.type",
        fields: ["type"]
      },
      language: {
        type: "select",
        id: "language",
        value: [],
        label: "reference.language",
        fields: ["language"]
      },
      journal: {
        type: "text",
        id: "journal",
        lookUpType: "equals",
        value: null,
        label: "reference.journal",
        fields: ["journal_name"]
      },
      abstract: {
        type: "text",
        id: "abstract",
        lookUpType: "equals",
        value: null,
        label: "reference.abstract",
        fields: ["abstract"]
      },
      isEstonianAuthor: {
        type: "checkbox",
        id: "isEstonianAuthor",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianAuthor",
        fields: ["is_estonian_author"]
      },
      isEstonianReference: {
        type: "checkbox",
        id: "isEstonianReference",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianReference",
        fields: ["is_estonian_reference"]
      },
      keywords: {
        type: "text",
        id: "keywords",
        lookUpType: "contains",
        value: null,
        label: "reference.keywords",
        fields: ["keywords"]
      },
      volumeAndNumber: {
        type: "text",
        id: "volumeAndNumber",
        lookUpType: "equals",
        value: null,
        label: "reference.volumeAndNumber",
        fields: ["volume", "number"]
      },
      taxa: {
        type: "text",
        id: "taxa",
        lookUpType: "equals",
        value: null,
        label: "reference.taxa",
        fields: ["taxa"]
      },
      publisher: {
        type: "text",
        id: "publisher",
        lookUpType: "equals",
        value: null,
        label: "reference.publisher",
        fields: ["publisher"]
      }
    },
    allIds: [
      "author",
      "year",
      "title",
      "book",
      "journal",
      "abstract",
      "keywords",
      "volumeAndNumber",
      "type",
      "language",
      "localities",
      "isEstonianReference",
      "isEstonianAuthor"
    ]
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
