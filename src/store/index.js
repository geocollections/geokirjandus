import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search from "./modules/search";
import result from "./modules/result";
import tableSettings from "./modules/tableSettings";
Vue.use(Vuex);
const version = "2.0.1";

const vuexLocal = new VuexPersistence({
  key: `geoloogia.geokirjandus.${version}`,
  reducer: state => ({
    search: {
      advancedSearch: state.search.advancedSearch,
      search: state.search.search
    },
    settings: state.settings
  }),
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: {
    settings,
    tableSettings,
    search,
    result
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
