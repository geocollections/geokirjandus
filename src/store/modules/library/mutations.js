const mutations = {
  SET_LIBRARIES(state, payload) {
    state.count = payload.count ?? 0;
    state.facet = payload.facet_counts ?? {};
  },
  SET_CURRENT_LIBRARY(state, payload) {
    state.currentLibrary = payload;
  }
};

export default mutations;
