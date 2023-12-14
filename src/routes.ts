import { createWebHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "./pages/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
