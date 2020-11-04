const actions = {
  updateLanguage({ commit }, language) {
    commit("UPDATE_LANGUAGE", language);
  },
  updateView({ commit }, view) {
    commit("UPDATE_VIEW", view);
  },

  changeCitationTemplate({ commit }, payload) {
    commit("CHANGE_CITATION_TEMPLATE", payload);
  }
};

export default actions;
