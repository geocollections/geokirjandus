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
        active: true
      },
      year: {
        type: "range",
        id: "year",
        lookUpType: "range",
        value: [1980, 2000],
        label: "reference.year",
        fields: ["year"],
        active: false
      },
      title: {
        type: "text",
        id: "title",
        lookUpType: "contains",
        value: null,
        label: "reference.title",
        fields: ["title"],
        active: true
      },
      localities: {
        type: "text",
        id: "localities",
        lookUpType: "contains",
        value: null,
        label: "reference.localities",
        fields: ["localities"],
        active: true
      },
      bookJournal: {
        type: "text",
        id: "bookJournal",
        lookUpType: "contains",
        value: null,
        label: "reference.bookJournal",
        fields: ["journal__journal_name", "journal_name_short", "book"],
        active: true
      },
      abstractRemarks: {
        type: "text",
        id: "abstractRemarks",
        lookUpType: "contains",
        value: null,
        label: "reference.abstractRemarks",
        fields: ["abstract", "remarks"],
        active: true
      },
      is_estonian_author: {
        type: "checkbox",
        id: "is_estonian_author",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianAuthor",
        fields: ["is_estonian_author"],
        active: true
      },
      is_estonian_reference: {
        type: "checkbox",
        id: "is_estonian_reference",
        lookUpType: "contains",
        value: null,
        label: "reference.isEstonianReference",
        fields: ["is_estonian_reference"],
        active: true
      },
      keywords: {
        type: "text",
        id: "keywords",
        lookUpType: "contains",
        value: null,
        label: "reference.keywords",
        fields: ["keywords"],
        active: true
      },
      user_added: {
        type: "text",
        id: "user_added",
        lookUpType: "contains",
        value: null,
        label: "reference.userAdded",
        fields: ["user_added"],
        active: true
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
  // TODO: Check lookuptype values
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
