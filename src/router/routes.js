
const routes = [
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '图书检索', component: () => import('pages/BookSearch.vue') },
      { path: '/BookManage', name: '图书管理', component: () => import('pages/BookManage.vue') },
      { path: '/Log', name: '系统日志', component: () => import('pages/Log.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('pages/LoginPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
