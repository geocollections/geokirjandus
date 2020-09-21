import mutations from "./mutations";
import actions from "./actions";
const state = {
  language: "ee"
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
