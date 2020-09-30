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
    Object.entries(payload).forEach(([k, v]) => {
      switch (k) {
        case "search":
          state.search.value = v;
          break;
        case "year": {
          const range = v.split("-").map(year => {
            return parseInt(year);
          });
          state.advancedSearch.byIds[k].value = range;
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
          state.advancedSearch.byIds[query[0]].value = v;
          state.advancedSearch.byIds[query[0]].lookUpType = query[1];
        }
      }
    });
  },
  RESET_PAGE(state) {
    state.page = 1;
  }
};

export default mutations;
