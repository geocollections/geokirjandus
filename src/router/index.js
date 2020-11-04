import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import Landing from "@/views/Landing";
import Reference from "@/components/reference/Reference";
import ReferenceViewer from "@/components/reference/ReferenceViewer";
import LibraryViewer from "@/components/library/LibraryViewer";

import App from "@/App";
import store from "@/store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: App,
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
    path: "/query",
    name: "query",
    beforeEnter: (to, from, next) => {
      const { lang, ...query } = to.query;

      store.dispatch("search/setSearchFromURL", query);
      store.dispatch("settings/updateLanguage", lang);

      next({ name: "searchReference" });
    }
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
