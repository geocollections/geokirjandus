import { cloneDeep } from "lodash";

const mutations = {
  RESET_SEARCH(state) {
    let resetAdvancedSearch = cloneDeep(state.advancedSearch.byIds);

    state.advancedSearch.allIds.forEach(id => {
      switch (resetAdvancedSearch[id].type) {
        case "range":
          resetAdvancedSearch[id].value = [NaN, NaN];
          break;
        default: {
          resetAdvancedSearch[id].value = null;
          resetAdvancedSearch[id].lookUpType = "contains";
        }
      }
    });
    state.search.value = null;

    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedSearch
    };
  },
  UPDATE_PAGE(state, page) {
    state.page = page;
  },
  UPDATE_PAGINATE_BY(state, paginateBy) {
    state.paginateBy = paginateBy;
  },

  UPDATE_SORT_BY(state, payload) {
    state.sortBy = payload;
  },

  UPDATE_SORT_DESC(state, payload) {
    state.sortDesc = payload;
  },

  UPDATE_ADVANCED_SEARCH(state, payload) {
    switch (payload.type) {
      case "range":
        state.advancedSearch.byIds[payload.id].value = payload.value;
        break;
      case "checkbox":
        console.log(payload);
        state.advancedSearch.byIds[payload.id].value = payload.value;
        break;
      default: {
        if (payload.lookUpType)
          state.advancedSearch.byIds[payload.id].lookUpType =
            payload.lookUpType;
        else state.advancedSearch.byIds[payload.id].value = payload.value;
      }
    }
  },
  UPDATE_SEARCH(state, searchValue) {
    state.search.value = searchValue;
  },
  SET_SEARCH_FROM_URL(state, payload) {
    // TODO: refactor into a function (same bit of code is used in RESET_SEARCH)
    let resetAdvancedSearch = cloneDeep(state.advancedSearch.byIds);

    state.advancedSearch.allIds.forEach(id => {
      switch (resetAdvancedSearch[id].type) {
        case "range":
          resetAdvancedSearch[id].value = [NaN, NaN];
          break;
        default: {
          resetAdvancedSearch[id].value = null;
          resetAdvancedSearch[id].lookUpType = "contains";
        }
      }
    });
    state.search.value = null;

    // TODO: Refactor switch to use v.type, not key
    Object.entries(payload).forEach(([k, v]) => {
      console.log(k);
      switch (k) {
        case "search":
          state.search.value = v;
          break;
        case "year": {
          const range = v.split("-").map(year => {
            return parseInt(year);
          });
          resetAdvancedSearch[k].value = range;
          break;
        }
        case "page":
          state.page = parseInt(v);
          break;
        case "paginateBy":
          state.paginateBy = parseInt(v);
          break;
        default: {
          const query = k.split("_");
          if (resetAdvancedSearch[query[0]]) {
            resetAdvancedSearch[query[0]].value = v;
            resetAdvancedSearch[query[0]].lookUpType = query[1];
          }
        }
      }
    });
    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedSearch
    };
  },
  RESET_PAGE(state) {
    state.page = 1;
  }
};

export default mutations;
