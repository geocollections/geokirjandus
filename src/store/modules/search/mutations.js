import { cloneDeep } from "lodash";

const resetAdvancedSearch = advancedSearch => {
  let cloneAdvancedSearch = cloneDeep(advancedSearch.byIds);

  advancedSearch.allIds.forEach(id => {
    switch (cloneAdvancedSearch[id].type) {
      case "range":
        cloneAdvancedSearch[id].value = [NaN, NaN];
        break;
      case "checkbox":
        if (id !== "isEstonianAuthor" && id !== "isEstonianReference") {
          cloneAdvancedSearch[id].value = null;
        }
        break;
      default: {
        cloneAdvancedSearch[id].value = null;
        cloneAdvancedSearch[id].lookUpType = "contains";
      }
    }
  });

  return cloneAdvancedSearch;
};

const mutations = {
  RESET_SEARCH(state) {
    state.search.value = null;

    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedSearch(state.advancedSearch)
    };
    state.page = 1;
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
  SET_SEARCH_FROM_URL(state, payload) {
    let resetAdvancedSearchObj = resetAdvancedSearch(state.advancedSearch);

    state.page = 1;

    Object.entries(payload).forEach(([k, v]) => {
      const searchParameters = k.split("_");
      const searchFieldName = searchParameters[0];

      if (searchFieldName === "search") {
        state.search.value = v;
      } else if (searchFieldName === "page") {
        state.page = parseInt(v);
      } else if (searchFieldName === "paginateBy") {
        state.paginateBy = parseInt(v);
      } else {
        switch (resetAdvancedSearchObj[searchFieldName].type) {
          case "text":
            resetAdvancedSearchObj[searchFieldName].value = v;
            resetAdvancedSearchObj[searchFieldName].lookUpType =
              searchParameters[1];
            break;
          case "range": {
            const range = v.split("-").map(year => {
              return parseInt(year);
            });
            resetAdvancedSearchObj[searchFieldName].value = range;
            break;
          }
          case "select": {
            const types = v.split(",").map(type => {
              return type;
            });
            resetAdvancedSearchObj[searchFieldName].value = types;

            break;
          }
          case "checkbox": {
            resetAdvancedSearchObj[searchFieldName].value = v;

            break;
          }
          default:
            break;
        }
      }
    });
    state.advancedSearch = {
      ...state.advancedSearch,
      byIds: resetAdvancedSearchObj
    };
  },
  RESET_PAGE(state) {
    state.page = 1;
  }
};

export default mutations;
