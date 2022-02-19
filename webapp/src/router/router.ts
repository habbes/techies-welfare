import { createRouter, createWebHistory } from "vue-router";
import { IAuthService } from "../services";
import { routes } from "./routes";

function makeRouter(authService: IAuthService) {
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  });
  
  router.beforeEach((to, from) => {
    if (to.meta.noAuth) {
      return true;
    }
  
    // auth required by default for all pages
    if (!authService.isAuthenticated()) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }
  });

  return router;
}

export { makeRouter };
