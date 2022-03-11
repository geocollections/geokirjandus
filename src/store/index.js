import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search from "./modules/search";
import libraryReferenceSearchModule from "@/store/modules/search/libraryReferenceSearchModule";
import librarySearchModule from "@/store/modules/search/librarySearchModule";
import references from "./modules/references";
import library from "./modules/library";
import tableSettings from "./modules/tableSettings";
import reference from "@/store/modules/search/reference";
import libraryReferences from "./modules/libraryReferences";
Vue.use(Vuex);
const version = "1.1.2";

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
    libraryReferenceSearch: libraryReferenceSearchModule,
    librarySearch: librarySearchModule,
    reference,
    libraryReferences
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
