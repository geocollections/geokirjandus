import mutations from "./mutations";
import actions from "./actions";
const state = {
  language: "ee",
  citationTemplate: "apa",
  view: "list"
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
