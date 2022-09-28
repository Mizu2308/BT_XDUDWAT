import { ROLES } from "@/constants";

export default [
    {
        path: "/admin/setting/facility-account",
        name: "accounts",
        meta: {
            title: "List Accounts",
            authRequired: true,
            roles: [ ROLES.FACILITY_MANAGER, ROLES.FACILITY_ACCOUNT ],
        },
        component: () => import('@/views/account/list-account/index')
    },
    {
        path: '/admin/setting/facility-account/create',
        name: 'create-account',
        meta: {
            title: "Create Account",
            authRequired: true,
            roles: [ ROLES.FACILITY_MANAGER ],
        },
        component: () => import('@/views/account/create-edit-account/index')
    },
    {
        path: "/admin/setting/facility-account/edit/:id",
        name: 'edit-account',
        meta: {
            title: "Edit Account",
            authRequired: true,
            roles: [ ROLES.FACILITY_MANAGER ],
        },
        component: () => import('@/views/account/create-edit-account/index')
    }
]