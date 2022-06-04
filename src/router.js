import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home/Index.vue')
    },
    {
      path: '/media',
      name: 'media',
      component: () => import('./views/Media.vue')
    },
    {
      path: '/database',
      name: 'database',
      component: () => import('./views/Database.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Setting.vue')
    }
  ]
})
