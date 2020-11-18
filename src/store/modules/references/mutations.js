const mutations = {
  SET_REFERENCES(state, payload) {
    state.count = payload.count ?? 0;
    state.facet = payload.facet_counts ?? {};
  }
};

export default mutations;
