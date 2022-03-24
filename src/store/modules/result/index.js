import { getField } from "vuex-map-fields";
import result from "./modules/result";
export default {
  namespaced: true,
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField
  },
  modules: { reference: result, library: result, libraryReference: result }
};
