import axios from 'axios'
import store from '../store'
import router from '../router/router'
import errorCode from '@/utils/errorCode'
import {
    Notification, MessageBox, Message, Loading } from 'element-ui'
import common from '../assets/js/common.js'
// import { defineLocale } from 'moment'
import { getToken } from './auth'
let downloadLoadingInstance;
axios.defaults.timeout = 180000
axios.defaults.baseURL = process.env.VUE_APP_BASE_API // 测试接口域名
export const baseURL = axios.defaults.baseURL
//设置取消的接口  外界可以通过 AxiosToken.cancel() 取消请求
export const AxiosToken = axios.CancelToken.source()


export let isRelogin = { show: false };
axios.interceptors.request.use((config) => {
    config.cancelToken = AxiosToken.token
    downloadLoadingInstance = Loading.service({ text: "请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
    // console.log(config)
    config.headers['token'] = getToken();
    return config
}, (error) => {
    let str = error
    return common.toast(str, 'error', false)
})

axios.interceptors.response.use(res => {
    downloadLoadingInstance.close()
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    if (code === 401) {
        if (!isRelogin.show) {
            isRelogin.show = true;
            MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).then(() => {
                isRelogin.show = false;
                store.dispatch('LogOut').then(() => {
                    location.href = '/index';
                })
            }).catch(() => {
                isRelogin.show = false;
            });
        }
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
        Message({
            message: msg,
            type: 'error'
        })
        if (msg == '用户信息出错') {
            store.dispatch('LogOut')
            // location.href = '/index';
            router.replace({ name: 'login'})
        }

        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        Notification.error({
            title: msg
        })
        return Promise.reject('error')
    } else {
        return res.data
    }
}, error => {
    downloadLoadingInstance.close()
    console.log('err=>' + error)
    let { message } = error;
    if (message == "Network Error") {
        message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

// export function http (url, params,config, responseType) {
//   return new Promise((resolve, reject) => {
//     // let userId = store.state.userInfo.id
//     // if (userId && userId > 0) {
//     //   params.userId = parseInt(userId)
//     // } else {
//     //   params.userId = 0
//     // }

//     if (!responseType || typeof (responseType) == 'undefined') {
//       // 普通post请求
//       axios.post(url, params,config)
//       .then(response => {
//         resolve(response.data)
//       }, err => {
//         reject(err)
//       })
//     } else {
//       // 导出下载文件
//       axios.post(url, params, {
//         responseType: responseType
//       })
//       .then(response => {
//         resolve(response)
//       }, err => {
//         reject(err)
//       })
//     }
//   })
// }

export default axios