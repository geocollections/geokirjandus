const mutations = {
  SET_RESULT(state, payload) {
    if (payload.count !== state.count) {
      state.count = payload.count ?? 0;
    }
    state.facet = payload.facet_counts ?? {};
    state.results = payload.results ?? [];
  }
};

export default mutations;
