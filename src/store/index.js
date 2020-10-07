import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search from "./modules/search";
import references from "./modules/references";

Vue.use(Vuex);
//
const vuexLocal = new VuexPersistence({
  key: "geoloogia.geokirjandus",
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: { settings, search, references },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
