// https://nuxt.com/docs/api/configuration/nuxt-config
import { getIconCollections } from "@egoist/tailwindcss-icons";

export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/seo",
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
    // icons: ["heroicons", "simple-icons"],
    icons: {
      collections: {
        geocollections: {
          icons: {
            emaapou: {
              body: '<path stroke="currentColor" d="M47.04,73.88H50V62.53c0-3.66,2.39-6.27,5.54-6.27c3.16,0,5.12,2.19,5.12,5.92v11.7h2.92V62.41c0-3.93,2.5-6.16,5.5-6.16c3.23,0,5.16,2.15,5.16,6v11.62h2.96V61.56c0-4.92-2.81-8-7.38-8c-3.46,0-5.58,1.77-7,3.96c-1.08-2.23-3.15-3.96-6.39-3.96c-3.35,0-5.12,1.81-6.43,3.77v-3.34h-2.96V73.88z" /><path class="st0" d="M2.48,42.15c0.82,7.58,3.75,14.52,9.09,20.72c6.31,7.34,14.85,11.57,26.27,11.01l-0.03-7.86c-7.21,0.66-14.05-2.82-18.98-7.92c-4.13-4.27-6.43-9.65-7.2-15.95H2.48z M63.24,30.86H12.07c1.81-6.31,4.49-11.04,8.02-14.2c4.84-4.33,10.63-6.5,17.37-6.5c4.08,0,7.98,0.86,11.69,2.59c3.71,1.73,6.68,4,8.94,6.81C60.34,22.38,62.06,26.15,63.24,30.86M72.85,37.21c-0.3-8.79-2.75-16.22-7.48-22.19C58.39,6.15,49.04,1.71,37.34,1.71c-11.37,0-20.44,4.33-27.22,13c-5.18,6.6-7.8,14.12-7.96,22.5H72.85z" />',
              width: 80,
              height: 80,
            },
          },
        },
        ...getIconCollections(["heroicons", "simple-icons"]),
      },
    },
  },
  googleFonts: {
    families: {
      "Noto+Sans": {
        wght: [300, 400, 500, 600, 700],
        ital: [300, 400, 500, 600, 700],
      },
      "Noto+Serif": {
        wght: [400, 500, 700],
        ital: [400, 500, 700],
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
  linkChecker: {
    enabled: false,
  },
  ogImage: {
    enabled: false,
  },
});
