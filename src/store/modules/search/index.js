import actions from "./actions";
import mutations from "./mutations";
import { getField } from "vuex-map-fields";
import reference from "./modules/reference";
import library from "./modules/library";
import libraryReference from "./modules/libraryReference";

export default {
  namespaced: true,
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField
  },
  actions,
  mutations,
  modules: { reference, library, libraryReference }
};
