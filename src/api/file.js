import request from "@/utils/request"

/**
 * 
 * @param {Object} formData 带有file的formData的文件
 * @param {Object} params 里面带有onUploadProgressLoaded
 * @returns 
 */
export function uploadFile(formData,params) {
    const config = {
        url: '/file/uploadFile',
        method: 'post',
        headers:{
            "Content-Type":'multipart/form-data'
        },
        data:formData,
    }
    return request(Object.assign(config,params))
}
/**
 * 查询文件列表
 * @param {Object} params 查询文件数据的参数 分页参数 页码参数 搜索条件
 * @returns {Promise}
 */
export function getList(params) {
    return request({
        url: '/file/getList',
        method: 'get',
        params
    })
}
/**
 * 单个或多个文件删除
 * @param {Object} data 文件上传的id 组合 例如 ids:'1,2,3' 
 * @returns {Promise}
 */
export function deleteFile(data) {
    return request({
        url: '/file/delFile',
        method: 'delete',
        data
    })
}
/**
 * 上传 chunk
 * @param {Object} formData 上传chunk的需要的参数 
 * @returns {Promise}
 */
export function uploadChunk(formData,progeress={}){
    const config = {
        url: '/file/uploadChunk',
        method: 'post',
        headers:{
            "Content-Type":'multipart/form-data'
        },
        data:formData,
    }
    return request(Object.assign(config,progeress))
}
/**
 * 合并chunk
 * @returns {Promise}
 */
export function mergeChunk(data){
    const config = {
        url: '/file/mergeChunk',
        method: 'post',
        data,
    }
    return request(Object.assign(config,{}))
}
/**
 *  询问 后端 文件是否上传完   如果没有上传完 是否有存在的切片 存在的切片的索引返回
 * 上传完就返回一个空数组
 * 断点续传 实现秒传的功能 返回chunk 的列表 
 * @returns {Promise}
 */
 export function getChunkList(params){
    const config = {
        url: '/file/chunkList',
        method: 'get',
        params,
    }
    return request(Object.assign(config,{}))
}
