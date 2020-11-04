const mutations = {
  UPDATE_LANGUAGE(state, payload) {
    state.language = payload;
  },
  UPDATE_VIEW(state, payload) {
    state.view = payload;
  },
  CHANGE_CITATION_TEMPLATE(state, payload) {
    state.citationTemplate = payload;
  }
};

export default mutations;
