import actions from "@/store/modules/library/actions";
import mutations from "@/store/modules/library/mutations";

const state = {
  count: 0,
  facet: {}
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
