const mutations = {
  SET_LIBRARIES(state, payload) {
    state.count = payload.count;
    state.facet = payload.facet_counts;
  }
};

export default mutations;
