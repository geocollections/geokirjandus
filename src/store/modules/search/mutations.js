import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";

const resetAdvancedSearch = advancedSearch => {
  let cloneAdvancedSearch = cloneDeep(advancedSearch.byIds);

  advancedSearch.allIds.forEach(id => {
    switch (cloneAdvancedSearch[id].type) {
      case "range":
        cloneAdvancedSearch[id].value = [null, null];
        break;
      case "checkbox":
        cloneAdvancedSearch[id].value = null;

        break;
      case "select":
        cloneAdvancedSearch[id].value = [];
        break;
      default: {
        cloneAdvancedSearch[id].value = null;
      }
    }
  });

  return cloneAdvancedSearch;
};

const resetAdvancedLibraryReferenceSearch = advancedSearch => {
  let cloneAdvancedSearch = cloneDeep(advancedSearch.byIds);

  advancedSearch.allIds.forEach(id => {
    switch (cloneAdvancedSearch[id].type) {
      case "range":
        cloneAdvancedSearch[id].value = [null, null];
        break;
      case "checkbox":
        cloneAdvancedSearch[id].value = null;

        break;
      case "select":
        cloneAdvancedSearch[id].value = [];
        break;
      default: {
        cloneAdvancedSearch[id].value = null;
      }
    }
  });

  return cloneAdvancedSearch;
};

import { updateField } from "vuex-map-fields";
const mutations = {
  updateField,
  RESET_SEARCH(state) {
    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedSearch(state.advancedSearch)
    };
    state.options.page = 1;
  },
  RESET_REFERENCE_SEARCH(state) {
    state.reference.search.value = null;

    state.reference.advancedSearch = {
      ...state.reference.advancedSearch,
      byIds: resetAdvancedSearch(state.reference.advancedSearch)
    };
    state.reference.options.page = 1;
  },
  RESET_LIBRARY_REFERENCE_SEARCH(state) {
    state.search.value = null;

    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedLibraryReferenceSearch(state.advancedSearch)
    };
    state.page = 1;
  },
  UPDATE_PAGE(state, page) {
    state.options.page = page;
  },
  UPDATE_PAGINATE_BY(state, itemsPerPage) {
    state.options.itemsPerPage = itemsPerPage;
  },

  UPDATE_SORT_BY(state, payload) {
    state.options.sortBy = payload;
  },

  UPDATE_SORT_DESC(state, payload) {
    state.options.sortDesc = payload;
  },
  UPDATE_OPTIONS(state, payload) {
    if (isEqual(state.options, payload)) return;
    state.options = Object.assign({}, state.options, payload);
  },

  UPDATE_ADVANCED_SEARCH(state, payload) {
    switch (payload.type) {
      case "range":
        if (
          payload.value[1] === null ||
          isNaN(payload.value[1]) ||
          payload.value[0] > payload.value[1]
        ) {
          state.advancedSearch.byIds[payload.id].value = [
            payload.value[0],
            payload.value[0]
          ];
        } else state.advancedSearch.byIds[payload.id].value = payload.value;
        break;
      case "checkbox":
        state.advancedSearch.byIds[payload.id].value = payload.value;
        break;
      default: {
        if (payload.lookUpType)
          state.advancedSearch.byIds[payload.id].lookUpType =
            payload.lookUpType;
        else state.advancedSearch.byIds[payload.id].value = payload.value;
      }
    }
    state.page = 1;
  },
  UPDATE_SEARCH(state, searchValue) {
    state.search.value = searchValue;
    state.page = 1;
  },
  RESET_PAGE(state) {
    state.options.page = 1;
  }
};

export default mutations;
