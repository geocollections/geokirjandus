import store from "@/store";
import VueI18n from "vue-i18n";
import Vue from "vue";

Vue.use(VueI18n);

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

export default i18n;
