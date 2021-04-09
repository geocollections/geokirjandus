const actions = {
  setLibraries({ commit }, payload) {
    commit("SET_LIBRARIES", payload);
  },
  setCurrentLibrary({ commit }, payload) {
    commit("SET_CURRENT_LIBRARY", payload);
  }
};

export default actions;
