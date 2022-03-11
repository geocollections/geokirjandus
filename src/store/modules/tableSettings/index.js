import actions from "@/store/modules/tableSettings/actions";
import mutations from "@/store/modules/tableSettings/mutations";

const INIT_STATE = {
  referenceHeaders: [
    {
      text: "reference.author",
      value: "author",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.year",
      value: "year",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.title",
      value: "title_s",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.titleOriginal",
      value: "title_original",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.journalName",
      value: "journal__journal_name",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.volume",
      value: "volume",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.number",
      value: "number",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.book",
      value: "book",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.bookEditor",
      value: "book_editor",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pagesStart",
      value: "pages_start",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pagesEnd",
      value: "pages_end",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pages",
      value: "pages",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.doi",
      value: "doi",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.dateAdded",
      value: "date_added",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.dateChanged",
      value: "date_changed",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "common.links",
      sortable: false,
      value: "links",
      show: true,
      fixed: true
    },
    {
      text: "reference.id",
      value: "reference_id",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    }
  ],
  referenceInLibraryHeaders: [
    {
      text: "reference.id",
      value: "reference_id",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.author",
      value: "author",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.year",
      value: "year",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.title",
      value: "title",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.titleOriginal",
      value: "title_original",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.journalName",
      value: "journal__journal_name",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.volume",
      value: "volume",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.number",
      value: "number",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.book",
      value: "book",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.bookEditor",
      value: "book_editor",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pagesStart",
      value: "pages_start",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pagesEnd",
      value: "pages_end",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.pages",
      value: "pages",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.doi",
      value: "doi",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.dateAdded",
      value: "date_added",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "reference.dateChanged",
      value: "date_changed",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "common.links",
      sortable: false,
      value: "links",
      show: true,
      fixed: true
    }
  ],
  libraryHeaders: [
    {
      text: "library.title",
      value: "title",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.author",
      value: "author",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.year",
      value: "year",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.countReferences",
      value: "count_references",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.dateChanged",
      value: "date_changed",
      show: false,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.dateAdded",
      value: "date_added",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    },
    {
      text: "library.id",
      value: "id",
      show: true,
      fixed: false,
      class: "text-no-wrap"
    }
  ]
};

export const initState = () => {
  return INIT_STATE;
};

export default {
  namespaced: true,
  state: initState,
  actions,
  mutations
};
