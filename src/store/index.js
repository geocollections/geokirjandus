import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search from "./modules/search";
import references from "./modules/references";
import library from "./modules/library";
import tableSettings from "./modules/tableSettings";
import libraryReferences from "./modules/libraryReferences";
Vue.use(Vuex);
const version = "2.0.0";

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
    references,
    library,
    libraryReferences
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
