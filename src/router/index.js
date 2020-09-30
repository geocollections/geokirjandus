import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Reference from "@/components/reference/Reference";
import ReferenceViewer from "@/components/reference/ReferenceViewer";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    alias: "/reference",
    meta: {
      object: "reference"
    },
    children: [
      {
        path: "",
        component: ReferenceViewer,
        meta: {
          table: "reference",
          heading: "editReference.heading",
          object: "reference"
        }
      }
    ]
  },
  {
    path: "/reference/:id(\\d+)",
    props: true,
    component: Home,
    children: [
      {
        path: "",
        component: Reference,
        meta: {
          table: "reference",
          heading: "editReference.heading",
          object: "reference"
        }
      }
    ]
  },
  {
    path: "/library/:id(\\d+)",
    props: true,
    component: Home,
    children: [
      {
        path: "",
        component: () => import("../components/library/Library.vue"),
        meta: {
          table: "library",
          heading: "editReference.heading",
          object: "library"
        }
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
