import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: !localStorage.getItem('userInfo') ? {} : JSON.parse(localStorage.getItem('userInfo')),
    menuList: [
      { name: '用户管理', url: '/home/user', icon: 'el-icon-user' },
      { name: '文件管理', url: '/home/file', icon: 'el-icon-s-grid' }
    ],
    pageSize: 10 // 每页请求多少条
  },
  mutations: {
    [types.SAVE_USERINFO] (state, data) {
      state.userInfo = data
    }
  },
  actions: {
    saveUserInfo ({ commit }, data) {
      commit(types.SAVE_USERINFO, data)
    }
  }
})
