import { debounce, cloneDeep } from "lodash";

const actions = {
  updatePaginateBy({ commit }, paginateBy) {
    commit("UPDATE_PAGE", 1);
    commit("UPDATE_PAGINATE_BY", paginateBy);
  },

  updatePage({ commit }, page) {
    commit("UPDATE_PAGE", page);
  },

  updateSortBy({ commit }, payload) {
    commit("UPDATE_SORT_BY", cloneDeep(payload));
  },

  updateSortDesc({ commit }, payload) {
    commit("UPDATE_SORT_DESC", cloneDeep(payload));
  },
  updateOptions({ commit }, payload) {
    commit("UPDATE_OPTIONS", cloneDeep(payload));
  },
  updateSearch({ commit }, searchValue) {
    commit("UPDATE_SEARCH", searchValue);
  },
  updateAdvancedSearch({ commit }, payload) {
    commit("UPDATE_ADVANCED_SEARCH", payload);
  },
  resetSearch({ commit }, payload) {
    commit("RESET_SEARCH", payload);
  },
  resetReferenceSearch({ commit }, payload) {
    commit("RESET_REFERENCE_SEARCH", payload);
  },
  resetLibraryReferenceSearch({ commit }, payload) {
    commit("RESET_LIBRARY_REFERENCE_SEARCH", payload);
  },
  setSearchFromURL({ commit }, payload) {
    commit("SET_SEARCH_FROM_URL", payload);
  },
  resetPage({ commit }) {
    commit("RESET_PAGE");
  }
};

export default actions;
