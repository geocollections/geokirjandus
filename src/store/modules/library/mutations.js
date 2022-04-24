const mutations = {
  SET_LIBRARIES(state, payload) {
    state.count = payload?.response?.numFound ?? 0;
    state.facet = payload.facet_counts ?? {};
    state.results = payload?.response?.docs ?? [];
  },
  SET_CURRENT_LIBRARY(state, payload) {
    state.currentLibrary = payload;
  }
};

export default mutations;
