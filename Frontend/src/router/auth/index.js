
export default [
  {
    path: '/login',
    name: 'signin',
    meta: {
      title: "Signin", authRequired: false,
    },
    component: () => import('@/views/auth/signin/index')
  },
  {
    path: '/admin/auth/logout',
    name: 'logout',
    meta: {
      title: "Logout", authRequired: false,
    },
    component: () => import("@/views/auth/logout/cover")
  },
  {
    path: "/admin/login",
    name: "login",
    component: () => import("@/views/account/login.vue"),
    meta: {
      title: "Login",
      authRequired: false
    },
  },
  {
    path: "/admin/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/forgot-pwd/index.vue"),
    meta: {
      title: "Forgot Password",
      authRequired: false
    },
  },
  {
    path: "/admin/reset-password",
    name: "reset-password",
    component: () => import("@/views/auth/reset/index.vue"),
    meta: {
      title: "Reset Password",
      authRequired: false
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/auth/profile"),
    meta: {
      title: "Profile",
      authRequired: true
    },
  },
];