import actions from "@/store/modules/references/actions";
import mutations from "@/store/modules/references/mutations";

const state = {
  result: [],
  count: 0,
  facet: {}
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
