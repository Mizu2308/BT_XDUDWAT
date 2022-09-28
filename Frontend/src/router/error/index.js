export default [
  {
    path: '/admin/error/404',
    name: '404',
    meta: {
      title: "Error 404", authRequired: false,
    },
    component: () => import('@/views/errors/404')
  },
  {
    path: '/admin/error/401',
    name: '401',
    meta: {
      title: "UnAuthorized 401", authRequired: false,
    },
    component: () => import('@/views/errors/401')
  },
  {
    path: '/admin/error/500',
    name: '500',
    meta: {
      title: "Error 500", authRequired: false,
    },
    component: () => import('@/views/errors/500')
  },
  {
    path: '/admin/error/offline',
    name: 'ofline',
    meta: {
      title: "Offline", authRequired: false,
    },
    component: () => import('@/views/errors/offline')
  },
  {
    path: '/admin/error/expires-link',
    name: 'expires-link',
    meta: {
      title: "Expires Link", authRequired: false,
    },
    component: () => import('@/views/errors/expires-link')
  },
];