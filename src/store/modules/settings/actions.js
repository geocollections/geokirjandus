const actions = {
  updateLanguage({ commit }, language) {
    commit("UPDATE_LANGUAGE", language);
  },

  changeCitationTemplate({commit}, payload) {
    commit("CHANGE_CITATION_TEMPLATE", payload)
  }
};

export default actions;
