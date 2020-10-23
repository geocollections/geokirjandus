import actions from "./actions";
import mutations from "./mutations";

const state = {
  page: 1,
  paginateBy: 50,
  sortBy: [],
  sortDesc: [],
  search: {
    id: "search",
    value: null,
    type: "text",
    lookUpType: "contains"
  },
  advancedSearch: {
    byIds: {
      author: {
        type: "text",
        id: "author",
        lookUpType: "contains",
        value: null,
        label: "reference.author",
        fields: ["author"]
      },
      year: {
        type: "range",
        id: "year",
        lookUpType: "range",
        value: [NaN, NaN],
        label: "reference.years",
        placeholders: ["common.start", "common.end"],
        fields: ["year"]
      },
      title: {
        type: "text",
        id: "title",
        lookUpType: "contains",
        value: null,
        label: "reference.title",
        fields: ["title"]
      },
      localities: {
        type: "text",
        id: "localities",
        lookUpType: "contains",
        value: null,
        label: "reference.localities",
        fields: ["localities"]
      },
      book: {
        type: "text",
        id: "book",
        lookUpType: "contains",
        value: null,
        label: "reference.book",
        fields: ["book"]
      },
      referenceType: {
        type: "select",
        id: "referenceType",
        value: [],
        label: "reference.type",
        fields: ["type"]
      },
      journal: {
        type: "text",
        id: "journal",
        lookUpType: "contains",
        value: null,
        label: "reference.journal",
        fields: ["journal__journal_name", "journal_name_short"]
      },
      abstract: {
        type: "text",
        id: "abstract",
        lookUpType: "contains",
        value: null,
        label: "reference.abstract",
        fields: ["abstract"]
      },
      isEstonianAuthor: {
        type: "checkbox",
        id: "isEstonianAuthor",
        lookUpType: "contains",
        value: "1",
        label: "reference.isEstonianAuthor",
        fields: ["is_estonian_author"]
      },
      isEstonianReference: {
        type: "checkbox",
        id: "isEstonianReference",
        lookUpType: "contains",
        value: "1",
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
      userAdded: {
        type: "text",
        id: "userAdded",
        lookUpType: "contains",
        value: null,
        label: "reference.userAdded",
        fields: ["user_added"]
      }
    },
    allIds: [
      "author",
      "year",
      "title",
      "book",
      "journal",
      "abstract",
      "localities",
      "referenceType",
      "keywords",
      "userAdded",
      "isEstonianAuthor",
      "isEstonianReference"
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

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
