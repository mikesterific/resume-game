import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const getRouterBase = () => {
  const { hostname, pathname } = window.location;

  if (hostname === "4everfinder.com" && pathname.startsWith("/portfolio-quest")) {
    return "/portfolio-quest/";
  }

  return new URL(import.meta.env.BASE_URL, window.location.href).pathname;
};

const router = createRouter({
  history: createWebHistory(getRouterBase()),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/portfolio",
      name: "portfolio",
      // Portfolio view showcasing projects and professional experience
      component: () => import("../views/PortfolioView.vue"),
    },
    {
      path: "/game",
      name: "game",
      // Phaser Space Game - Interactive portfolio experience
      component: () => import("../views/GameView.vue"),
    },
    {
      path: "/museum",
      name: "museum",
      // 3D Space Museum - Portfolio experience using Three.js
      component: () => import("../views/MuseumView.vue"),
    },
  ],
});

export default router;
