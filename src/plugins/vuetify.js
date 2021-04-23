import Vue from "vue";
import Vuetify from "vuetify/lib";
import EmaapouIcon from "@/components/EmaapouIcon";
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "fa",
    values: {
      emaapouIcon: { component: EmaapouIcon }
    }
  }
});
