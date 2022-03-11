import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueIziToast from "vue-izitoast";
import VueShepherd from "vue-shepherd";
import Meta from "vue-meta";

import i18n from "./i18n";
import "izitoast/dist/css/iziToast.min.css";
import "academicons/css/academicons.min.css";
import "shepherd.js/dist/css/shepherd.css";
import cslJson from "@/plugins/cslJson";
import "@/assets/global.css";

Vue.use(VueIziToast);
Vue.use(VueShepherd);
Vue.use(cslJson);
Vue.use(Meta);

Vue.config.productionTip = false;

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
