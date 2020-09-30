import actions from "./actions";
import mutations from "./mutations";

const state = {
  searchStr: null,
  activeSearchParametersFilters: [],
  page: 1,
  paginateBy: 50,
  sortBy: ["date_changed"],
  sortDesc: [true],
  search: {
    id: "search",
    value: null,
    type: "text",
    lookUpType: "contains",
    fields: [
      "year",
      "author",
      "title",
      "journal__journal_name",
      "journal_name_short",
      "book",
      "abstract",
      "remarks",
      "keywords",
      "user_added"
    ]
  },
  advancedSearch: {
    byIds: {
      author: {
        type: "text",
        id: "author",
        lookUpType: "contains",
        value: null,
        label: "reference.author",
        fields: ["author"],
      },
      year: {
        type: "range",
        id: "year",
        lookUpType: "range",
        value: [NaN, NaN],
        label: "reference.year",
        fields: ["year"]
      },
      title: {
        type: "text",
        id: "title",
        lookUpType: "contains",
        value: null,
        label: "reference.title",
        fields: ["title"],
      },
      localities: {
        type: "text",
        id: "localities",
        lookUpType: "contains",
        value: null,
        label: "reference.localities",
        fields: ["localities"]
      },
      bookJournal: {
        type: "text",
        id: "bookJournal",
        lookUpType: "contains",
        value: null,
        label: "reference.bookJournal",
        fields: ["journal__journal_name", "journal_name_short", "book"],

      },
      abstractRemarks: {
        type: "text",
        id: "abstractRemarks",
        lookUpType: "contains",
        value: null,
        label: "reference.abstractRemarks",
        fields: ["abstract", "remarks"],

      },
      is_estonian_author: {
        type: "checkbox",
        id: "is_estonian_author",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianAuthor",
        fields: ["is_estonian_author"],

      },
      is_estonian_reference: {
        type: "checkbox",
        id: "is_estonian_reference",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianReference",
        fields: ["is_estonian_reference"],

      },
      keywords: {
        type: "text",
        id: "keywords",
        lookUpType: "contains",
        value: null,
        label: "reference.keywords",
        fields: ["keywords"],

      },
      user_added: {
        type: "text",
        id: "user_added",
        lookUpType: "contains",
        value: null,
        label: "reference.userAdded",
        fields: ["user_added"],

      }
    },
    allIds: [
      "author",
      "year",
      "title",
      "bookJournal",
      "abstractRemarks",
      "localities",
      "keywords",
      "user_added",
      "is_estonian_author",
      "is_estonian_reference"
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
