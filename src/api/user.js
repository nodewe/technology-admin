import request from "@/utils/request"

// 登录方法
export function login(username, password, code) {
    const data = {
        username,
        password,
        code,
    }
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data: data
    })
}

//获取用户的列表
export function getUserList(params) {
    return request({
        url: '/user/getList',
        method: 'get',
        params
    })
}


// 获取用户详细信息
export function getInfo(params) {
    return request({
        url: '/user/getInfo',
        method: 'get',
        params
    })
}
//修改用户信息
export function updateInfo(data){
    return request({
        url: '/user/updateInfo',
        method: 'put',
        data
    }) 
}
// 删除用户
export function deleteUser(data) {
    return request({
        url: '/user/delete',
        method: 'delete',
        data
    })
}
// 退出方法
export function logout(params) {
    return request({
        url: '/logout',
        method: 'post',
        params
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        headers: {
            isToken: false
        },
        method: 'get',
        timeout: 20000,
        data: {}
    })
}