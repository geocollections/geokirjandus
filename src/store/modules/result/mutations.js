const mutations = {
  SET_RESULT(state, payload) {
    if (payload?.response?.numFound !== state.count) {
      state.count = payload?.response?.numFound ?? 0;
    }
    state.facet = payload.facet_counts ?? {};
    state.results = payload?.response?.docs ?? [];
  }
};

export default mutations;
