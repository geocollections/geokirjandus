const mutations = {
  SET_REFERENCES(state, payload) {
    state.result = payload.results;
    state.count = payload.count;
  },

  CHANGE_CITATION_TEMPLATE(state, payload) {
    state.citationTemplate = payload
  }
};

export default mutations;
