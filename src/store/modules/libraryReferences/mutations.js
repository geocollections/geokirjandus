const mutations = {
  SET_REFERENCES(state, payload) {
    state.count = payload?.response?.numFound ?? 0;
    state.facet = payload.facet_counts ?? {};
    state.results = payload?.response?.docs ?? [];
  }
};

export default mutations;
