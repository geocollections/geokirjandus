const mutations = {
  SET_REFERENCES(state, payload) {
    state.result = payload.results;
    state.count = payload.count;
    state.facet = payload.facet_counts
  }
};

export default mutations;
