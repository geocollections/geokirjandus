// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtseo/module",
  ],
  imports: {
    dirs: ["types/*.ts"],
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  i18n: {
    locales: [
      { code: "et", file: "et.json" },
      { code: "en", file: "en.json" },
    ],
    lazy: true,
    langDir: "lang",
    defaultLocale: "et",
  },
  colorMode: {
    classSuffix: "",
  },
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  googleFonts: {
    families: {
      "Noto+Sans": {
        wght: [300, 400, 600, 700, 800],
        ital: [300, 400, 600, 700, 800],
      },
    },
  },
  site: {
    name: "Geokirjandus",
  },
  sitemap: {
    sitemaps: true,
    sources: ["/api/__sitemap__/urls"],
  },
  runtimeConfig: {
    // TODO: allow indexing in production but not in staging
    indexable: false,
  },
});
