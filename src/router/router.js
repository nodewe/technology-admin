import Vue from 'vue'
import Router from 'vue-router'
//引入homerouter的文件
import homeChildren from './homeRouter/homeRouter.js';
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
      component: () => import('../views/Login.vue'),
      meta: { pagePath: '/' }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      meta: { pagePath: '/home' },
      children: homeChildren
    }
  ]
})
