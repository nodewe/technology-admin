import request from "@/utils/request"

/**
 * 获取小区的list
 * @param {Object}  获取小区list
 * @returns {Promise}
 */
export function getEstateList(data) {
    const config = {
        url: '/cesium/getEstateList',
        method: 'get'
    }
    return request(Object.assign(config,{}))
}
/**
 * 查询文章列表
 * @param {Object} params 查询文件数据的参数 分页参数 页码参数 搜索条件
 * @returns {Promise}
 */
export function getArticleList(params) {
    return request({
        url: '/article/getArticleList',
        method: 'get',
        params
    })
}
/**
 * 查询文章信息
 * @param {Object} params 根据id查询文章信息
 * @returns {Promise}
 */
 export function getArticleInfo(params) {
    return request({
        url: '/article/getArticleInfo',
        method: 'get',
        params
    })
}
/**
 * 单个或多个文章删除
 * @param {Object} data 文件上传的id 组合 例如 ids:'1,2,3' 
 * @returns {Promise}
 */
export function deleteArticle(data) {
    return request({
        url: '/article/deleteArticle',
        method: 'delete',
        data
    })
}
/**
 * 修改文章
 * @param {Object} data 修改文章 的参数
 * @returns {Promise}
 */
export function updateArticleInfo(data){
    const config = {
        url: '/article/updateArticleInfo',
        method: 'put',
        data,
    }
    return request(Object.assign(config,{}))
}