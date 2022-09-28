// import store from "@/state/store";

// Modules
import authRoutes from "./auth";
import accountRoutes from "./facility-account";
import errorRoutes from "./error";
import { ROLES } from "@/constants";

export default [
  ...authRoutes,
  ...accountRoutes,
  ...errorRoutes,
  {
    path: "/admin/setting/facility-info-management",
    name: "facility-info-management",
    meta: {
      title: "Facility Info Management",
      authRequired: true,
      roles: [ROLES.FACILITY_MANAGER, ROLES.FACILITY_ACCOUNT],
    },
    component: () => import("../views/setting/facility-management/index.vue"),
  },
  {
    path: "/users/management",
    name: "user-management-by-admin",
    meta: {
      title: "User Management",
      authRequired: true,
      roles: [ROLES.ADMIN],
    },
    component: () => import("../views/setting/user-management/admin-manager/index.vue"),
  },
  {
    path: "/users/create",
    name: "admin-create-user",
    meta: {
      title: "Create User By Admin",
      authRequired: true,
      roles: [ROLES.ADMIN],
    },
    component: () => import("../views/setting/user-management/admin-manager/create/index.vue"),
  },
  {
    path: "/admin/setting/user-management-by-admin/:userId",
    name: "admin-update-user",
    meta: {
      title: "Update User By Admin",
      authRequired: true,
      roles: [ROLES.ADMIN],
    },
    component: () => import("../views/setting/user-management/admin-manager/update/index.vue"),
  },
  {
    path: "/admin/setting/user-management-by-facility-manager/:userId",
    name: "facility-manager-update-user",
    meta: {
      title: "Update User By Facility Manager",
      authRequired: true,
      roles: [ROLES.FACILITY_MANAGER],
    },
    component: () => import("../views/setting/facility-manager/update/index.vue"),
  },
  {
    path: "/admin/setting/user-management-by-facility-manager/create",
    name: "facility-manager-create-user",
    meta: {
      title: "Create User By Facility Manager",
      authRequired: true,
      roles: [ROLES.FACILITY_MANAGER],
    },
    component: () => import("../views/setting/facility-manager/create/index.vue"),
  },
  {
    path: "/admin/setting/user-management-by-facility-manager",
    name: "facility-manager-user-list",
    meta: {
      title: "List user by facility manager",
      authRequired: true,
      roles: [ROLES.FACILITY_MANAGER],
    },
    component: () => import("../views/setting/facility-manager/index.vue"),
  },
  {
    path: "/admin/",
    name: "default",
    meta: {
      title: "Dashboard",
      authRequired: true,
      roles: [ROLES.FACILITY_MANAGER, ROLES.FACILITY_ACCOUNT],
    },
    component: () => import("../views/dashboard/index.vue"),
  },
];
