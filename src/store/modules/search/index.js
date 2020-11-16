import actions from "./actions";
import mutations from "./mutations";

const state = () => {
  return {
    page: 1,
    paginateBy: 50,
    sortBy: [],
    sortDesc: [],
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
        referenceType: {
          type: "select",
          id: "referenceType",
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
        "publisher",
        "referenceType",
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
