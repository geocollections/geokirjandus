import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    alias: "/reference",
    meta: {
      object: "reference"
    }
  },
  {
    path: "/reference/:id(\\d+)",
    props: true,
    component: () => import("../views/Detail.vue"),
    children: [
      {
        path: "",
        component: () => import("../components/reference/Reference.vue"),
        meta: {
          table: "reference",
          heading: "editReference.heading",
          object: "reference"
        }
      }
    ]
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
