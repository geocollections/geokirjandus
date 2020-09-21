import Vue from "vue";
import _ from "lodash";
const mutations = {
  RESET_SEARCH(state) {
    let resetAdvancedSearch = _.cloneDeep(state.advancedSearch.byIds);

    state.advancedSearch.allIds.forEach(id => {
      if (id === "year") {
        resetAdvancedSearch[id].value = [1980, 2000];
        resetAdvancedSearch[id].active = false;
      } else {
        resetAdvancedSearch[id].value = null;
        resetAdvancedSearch[id].lookUpType = "contains";
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

  UPDATE_ADVANCED_SEARCH(state, payload) {
    if (payload.id === "year") {
      if (payload.value) {
        state.advancedSearch.byIds[payload.id].value = payload.value;
      }
      if (payload.active != null) {
        console.log(payload);
        state.advancedSearch.byIds[payload.id].active = payload.active;
      }
    } else {
      if (payload.lookUpType)
        state.advancedSearch.byIds[payload.id].lookUpType = payload.lookUpType;
      else state.advancedSearch.byIds[payload.id].value = payload.value;
    }
  },
  UPDATE_SEARCH(state, searchValue) {
    state.search.value = searchValue;
  },
  SET_SEARCH_FROM_URL(state, payload) {
    Object.entries(payload).forEach(([k, v]) => {
      if (k === "search") {
        state.search.value = v;
      } else if (k === "year") {
        const range = v.split("-").map(year => {
          return parseInt(year);
        });

        state.advancedSearch.byIds[k].value = range;
      } else if (k === "page") {
        state.page = parseInt(v);
      } else if (k === "paginateBy") {
        state.paginateBy = parseInt(v);
      } else {
        const query = k.split("_");
        state.advancedSearch.byIds[query[0]].value = v;
        state.advancedSearch.byIds[query[0]].lookUpType = query[1];
      }
    });
  },
  RESET_PAGE(state) {
    state.page = 1;
  }
};

export default mutations;
