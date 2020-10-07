const mutations = {
  SET_REFERENCES(state, payload) {
    state.result = payload.results;
    state.count = payload.count;
  }
};

export default mutations;
