import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";

const Tabs = () => import("@/components/Tabs");
const LibraryViewer = () => import("@/components/library/LibraryViewer");
const ReferenceViewer = () => import("@/components/reference/ReferenceViewer");
const Reference = () => import("@/components/reference/Reference");
const Library = () => import("@/components/library/Library");

const App = () => import("@/App");
const Main = () => import("@/views/Main");
const Landing = () => import("@/views/Landing");

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
            components: {
              default: ReferenceViewer,
              tabs: Tabs
            },
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
            components: { default: LibraryViewer, tabs: Tabs },
            meta: {
              table: "library",
              heading: "editReference.heading",
              object: "library"
            }
          },
          {
            path: ":id(\\d+)",
            name: "library",
            component: Library,
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
      const { lang, library, ...query } = to.query;

      store.dispatch("settings/updateLanguage", lang);
      if (library) {
        store.dispatch("librarySearch/setSearchFromURL", query);
        next({ name: "library", params: { id: library } });
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
