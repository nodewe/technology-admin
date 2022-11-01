import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types.js'
import {login} from '@/api/user.js'
//导入插件
import plugin from './plugin/index'
//涌入menuList
import menuList from './menu/list.js';
import { getToken,setToken,removeToken } from '../utils/auth.js'
import { is } from 'core-js/core/object'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[plugin],
  state: {
    token:getToken(),
    userInfo: !localStorage.getItem('userInfo') ? {} : JSON.parse(localStorage.getItem('userInfo')),
    menuList,
    //管理系统的标题
    name:'技术整合后台管理系统',
    pageSize: 10, // 每页请求多少条
    //菜单的展开收起
    isCollapse:true
  },
  mutations: {
    //设置菜单的收起和展开
    [types.SET_COLLASPE](state,isCollapse){
      state.isCollapse = isCollapse
    },
    //保存个人信息
    [types.SAVE_USERINFO] (state, data) {
      state.userInfo = data
    },
    //设置token
    [types.SET_TOKEN] (state, data) {
      state.token = data
    }
  },
  actions: {
    //退出登录
    LogOut({commit}){
      commit('SET_TOKEN', '');
      localStorage.removeItem("userInfo")
      removeToken()
    },
    //登录方法
    Login({commit},userInfo){
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      return new Promise((resolve, reject) => {
        login(username, password, code).then(res => {
          if(res.code==200){
            setToken(res.token)
            commit('SET_TOKEN', res.token)
            resolve(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    saveUserInfo ({ commit }, data) {
      commit(types.SAVE_USERINFO, data)
    }
  }
})
