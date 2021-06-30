import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: { pagePath: '/' }
    },
    {
      path: '/preView',
      name: 'preView',
      component: () => import('./views/PreView.vue'),
      meta: { pagePath: '/' }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
      meta: { pagePath: '/home' },
      children: [
        {
          path: 'user',
          name: 'user',
          component: () => import(/* webpackChunkName: "user" */ './views/User/User.vue'),
          meta: { pagePath: '/home/user' }
        },
        {
          path: 'file',
          name: 'file',
          component: () => import(/* webpackChunkName: "file" */ './views/File/file.vue'),
          meta: { pagePath: '/home/file' }
        },
        
      ]
    },
    {
      path: '/refresh',
      component: () => import(/* webpackChunkName: "home" */ './views/Refresh.vue'),
      name: 'Refresh'
    }
  ]
})
