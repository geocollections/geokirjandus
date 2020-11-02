import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import Landing from "@/views/Landing";
import Reference from "@/components/reference/Reference";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import LibraryViewer from "@/components/library/LibraryViewer";
import store from "@/store";
import App from "@/App";
import i18n from "../i18n";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "root",
    beforeEnter(to, from, next) {
      next(store.state.settings.language);
    }
  },
  {
    path: "/:lang",
    component: App,
    beforeEnter(to, from, next) {
      const languages = ["ee", "en"];
      let lang = to.params.lang;
      if (languages.includes(lang)) {
        if (store.state.settings.language !== lang) {
          i18n.locale = lang;
          store.dispatch("settings/updateLanguage", lang);
        }
        return next();
      }
      return next({ path: store.state.settings.language });
    },
    children: [
      { path: "", name: "landing", component: Landing },
      {
        path: "reference",
        component: Main,
        meta: {
          object: "reference"
        },
        children: [
          {
            path: "",
            name: "searchReference",
            component: ReferenceViewer,
            meta: {
              table: "reference",
              heading: "editReference.heading",
              object: "reference"
            }
          },
          {
            path: ":id",
            name: "reference",
            component: Reference,
            props: true,
            meta: {
              table: "reference",
              heading: "editReference.heading",
              object: "reference"
            }
          }
        ]
      },
      {
        path: "library",
        component: Main,
        children: [
          {
            path: "",
            name: "searchLibrary",
            component: LibraryViewer,
            meta: {
              table: "library",
              heading: "editReference.heading",
              object: "library"
            }
          },
          {
            path: ":id(\\d+)",
            name: "library",
            component: () => import("../components/library/Library.vue"),
            meta: {
              table: "library",
              heading: "editReference.heading",
              object: "library"
            }
          }
        ]
      }
    ]
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
