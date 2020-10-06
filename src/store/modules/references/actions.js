const actions = {
  setReferences({ commit }, payload) {
    commit("SET_REFERENCES", payload);
  },

  changeCitationTemplate({commit}, payload) {
    commit("CHANGE_CITATION_TEMPLATE", payload)
  }
};

export default actions;
