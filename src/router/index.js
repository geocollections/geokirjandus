import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";
import AppLayout from "../layouts/AppLayout.vue";

const Reference = () => import("@/views/Reference");
const ReferenceSearch = () => import("@/views/ReferenceSearch");
const Library = () => import("@/views/Library");
const LibrarySearch = () => import("@/views/LibrarySearch");

const App = () => import("@/App");
const Landing = () => import("@/views/Landing");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: App,
    children: [
      { path: "", name: "landing", component: Landing },
      {
        path: "",
        component: AppLayout,
        children: [
          {
            path: "reference",
            name: "searchReference",
            component: ReferenceSearch,
            meta: {
              table: "reference",
              heading: "editReference.heading",
              object: "reference"
            }
          },
          {
            path: "reference/:id(\\d+)",
            name: "reference",
            component: Reference,
            props: true,
            meta: {
              table: "reference",
              heading: "editReference.heading",
              object: "reference"
            }
          },
          {
            path: "library/:id(\\d+)",
            name: "library",
            component: Library,
            meta: {
              table: "library",
              heading: "editReference.heading",
              object: "library"
            }
          },
          {
            path: "library",
            name: "searchLibrary",
            component: LibrarySearch,
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
      const { lang, library, reference, ...query } = to.query;

      store.dispatch("settings/updateLanguage", lang);
      if (library) {
        store.dispatch("libraryReferenceSearch/setSearchFromURL", query);
        next({ name: "library", params: { id: library }, replace: true });
      } else if (reference) {
        next({ name: "reference", params: { id: reference }, replace: true });
      } else {
        store.dispatch("search/setSearchFromURL", query);
        next({ name: "searchReference" });
      }
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
