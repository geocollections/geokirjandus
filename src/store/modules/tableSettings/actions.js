const actions = {
  setReferenceHeaders({ commit }, payload) {
    commit("SET_REFERENCE_HEADERS", payload);
  },

  setReferenceInLibraryHeaders({ commit }, payload) {
    commit("SET_REFERENCE_IN_LIBRARY_HEADERS", payload);
  },

  setLibraryHeaders({ commit }, payload) {
    commit("SET_LIBRARY_HEADERS", payload);
  }
};

export default actions;
