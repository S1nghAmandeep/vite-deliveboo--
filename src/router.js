import { createRouter, createWebHistory } from "vue-router";
import { store } from './store.js';

import HomePage from "./pages/HomePage.vue";
import RestaurantPage from "./pages/RestaurantPage.vue";
import NotFound from "./pages/404.vue";
import Checkout from "./pages/Checkout.vue";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from) {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/restaurant/:slug",
      name: "restaurant.show",
      component: RestaurantPage,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
    }
  ],
});

router.afterEach((to, from) => {
  store.currentRoute = router.currentRoute.value.name;
  console.log(store.currentRoute);
})

export { router };
