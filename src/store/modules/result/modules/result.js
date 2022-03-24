import actions from "../actions";
import mutations from "../mutations";

const state = {
  count: 0,
  facet: {},
  results: []
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
