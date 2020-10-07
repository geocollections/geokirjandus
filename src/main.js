import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueIziToast from "vue-izitoast";
import VueI18n from "vue-i18n";

import "izitoast/dist/css/iziToast.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

Vue.use(VueIziToast);
Vue.use(VueI18n);

Vue.config.productionTip = false;

/******************************
 *** TRANSLATION CODE START ***
 ******************************/

// Gets translations from json files
const messages = {
  en: require("./translations/en"),
  ee: require("./translations/ee")
};

// Gets preferred language from store (fallback is ee)
const lang = store?.state?.settings?.language || "ee";

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: "en",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages
});
/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/

Vue.directive("translate", function(el, binding) {
  let value = i18n.locale === "ee" ? binding.value.et : binding.value.en;
  el.innerHTML = value ? value : "";
});

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
