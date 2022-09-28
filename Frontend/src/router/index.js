import { createWebHistory, createRouter } from "vue-router";
// import axios from 'axios';
import routes from './routes';
import { parseJwt } from '@/helpers/auth';
import { STORAGE_KEY, ORIGIN_URL } from '../constants';
// import appConfig from "../../app.config";

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
})

// Before each route evaluates...
router.beforeEach(async (to, from, next) => {

  const authRequired = to?.meta?.authRequired || false;

  if (to.fullPath === '/') {
    return next({ name: 'default' });
  }

  if (authRequired) {
    let token = await localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    let currentUserStorage = sessionStorage.getItem('authUser') || localStorage.getItem('currentUser') || null;
    let currentUser = null;
    if (currentUserStorage) {
      currentUser = typeof currentUserStorage === 'string' ? JSON.parse(currentUserStorage) : currentUserStorage;
    }
    const roles = to?.meta?.roles || [];
    let decodedToken = parseJwt(token);

    if (decodedToken) {
      if (decodedToken.exp < Date.now() / 1000) {
        // token expired
        return next({ name: 'signin' });
      }
      
    } else {
      return next({ name: 'signin' });
    }

    if (!currentUser || (currentUser && roles && roles.length && !roles.includes(currentUser.role))) {
      let originURl = currentUser ? ORIGIN_URL[currentUser.role] : '/login';
      return next(originURl);
    }

  }
  
  if (!to.matched.length) {
    return next({ name: '404' });
  }

  return next();

})

export default router
