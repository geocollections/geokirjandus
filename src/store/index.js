import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "geoloogia.info_v1",
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: {},
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
