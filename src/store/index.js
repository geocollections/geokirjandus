import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search from "./modules/search";
import references from "./modules/references";
import library from "./modules/library";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "geoloogia.geokirjandus",
  reducer: state => ({ search: state.search, settings: state.settings }),
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: { settings, search, references, library },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
