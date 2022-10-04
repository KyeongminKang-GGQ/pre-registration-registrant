import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GoogleView from "../views/GoogleView.vue";
import LoginView from "../views/LoginView.vue";
import ListView from "../views/ListView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/oauth/google",
    name: "google",
    component: GoogleView,
  },
  {
    path: "/list",
    name: "list",
    component: ListView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
