import sparkMd5 from "spark-md5";
import {
    uploadChunk,
    mergeChunk,
    getChunkList
} from '@/api/file.js'

import {AxiosToken} from '@/utils/request.js'
//大文件 切片上床
export default class BigFileUpload {
    //默认0.5M
    CHUNK_SIZE = 1 * 1024 * 1024
    //记录当前的上传进度
    currentProgress = 0
    //百分比的值
    percentage = ''
    constructor(file) {
        if (file) {
            this.file = file;
        }

    }
    //初始化如果没有传file进来可以使用
    /**
     * 
     * @param {File} file 初始化file
     */
    setFile(file) {
        this.file = file;
    }
    //创建文件的chunks
    createFileChunks() {
        this.chunks = [];
        let cur = 0;
        while (cur < this.file.size) {
            this.chunks.push({
                index: cur,
                file: this.file.slice(cur, cur + this.CHUNK_SIZE)
            })
            cur += this.CHUNK_SIZE
        };
    }
    //计算hash  使用worker
    calculateHashWorker() {
        this.createFileChunks()
        return new Promise((resolve, reject) => {
            this.worker = new Worker('/hash.js');
            this.worker.postMessage({
                chunks: this.chunks
            });
            this.worker.onmessage = e => {
                const { progress, hash } = e.data;
                this.hashProgress = Number(progress.toFixed(2));
                // 如果hash出来了就证明结束了
                if (hash) {
                    this.hash = hash;
                    resolve()
                }
            }
        })
    }
    //使用 requestIdleCallback 计算hash
    calculateHashIdle() {
        return new Promise(resolve => {
            const spark = new sparkMd5.ArrayBuffer();

            let count = 0,
                appendToSpark = file => {
                    return new Promise(resolve => {
                        const render = new FileReader();
                        render.readAsArrayBuffer(file);
                        render.onload = e => {
                            spark.append(e.target.result);
                            resolve()
                        }
                    })
                }
            const workLoop = async deadline => {
                console.log(deadline.timeRemaining(), 'deadline')
                while (count < this.chunks.length && deadline.timeRemaining() > 1) {
                    // 空闲事件 且有任务
                    await appendToSpark(this.chunks[count].file);
                    if (count < this.chunks.length) {
                        this.hashProgress = Number(
                            ((100 + count) / this.chunks.length).toFixed(2)
                        )
                    } else {
                        this.hashProgress = 100;
                        this.hash = spark.end()
                        resolve()
                    }

                }
                window.requestIdleCallback(workLoop)
            }
            window.requestIdleCallback(workLoop)
        })
    }
    //抽样hash
    /**
     * 损失了部分的精度 换来程序极大的效率（布隆过滤器）
     * 
     * hash一样 文件不一定一样
     * hash不一样 文件一定不一样
     * 
     * 可以使用抽样hash 做一些预判断  如果存在 那么可能需通过 worker 重新计算 这个文件的hash
     * 如果hash不存在 那么文件一定不存在
     * @returns 
     */
    calculateHashSample() {
        return new Promise(resolve => {
            const spark = new sparkMd5.ArrayBuffer();
            const render = new FileReader();
            const file = this.file;
            const size = file.size;
            const offset = 2 * 1024 * 1024;
            //第一个2M 最后一个区块数据全要
            this.chunks = [file.slice(0, offset)];

            let cur = offset;
            while (cur < size) {
                if (cur + offset >= size) {
                    //最后一个区块
                    this.chunks.push(
                        file.slice(cur, cur + offset)
                    )
                } else {
                    //中间的区块
                    const mid = cur + offset / 2;
                    const end = cur + offset;
                    this.chunks.push(file.slice(cur, cur + 2))
                    this.chunks.push(file.slice(mid, mid + 2))
                    this.chunks.push(file.slice(end - 2, end))
                }
                cur += offset;
            }
            render.readAsArrayBuffer(new Blob(this.chunks));

            render.onload = e => {
                spark.append(e.target.result);
                this.hash = spark.end();
                resolve()
            }
        })
    }
    //整理切片
    combChunk() {
        this.chunks = this.chunks.map((chunk, index) => {
            const name = this.hash + '-' + index;
            return {
                hash: this.hash,
                name,
                index,
                chunk: chunk.file,
                progress: 0,
            }
        })
    }
    //计算总体的进度
    calcTotalProgress() {
        /**
         * 最终的进度 等于 this.chunks.length * 100  得到整体最终的进度
         * 当前的进度 将每一个chunk的progress 值累加起来 最后 除以 最终的进度
         */
        const total = this.chunks.length * 100;

        let current = this.chunks.reduce((acc, cur) => {
            acc += cur.progress
            return acc
        }, 0)
        current /= total;
        this.currentProgress = Math.ceil(current * 100);
        this.percentage = this.currentProgress + '%';
        // console.log('百分比=>', this.percentage)
    }
    // 上传切片
    /**
     * 
     * @param {Function} cb 给外界提供数据的会掉函数
     */
    async uploadChunks(cb) {
        const requests = this.chunks
            // 筛选出进度没有到100的
            .filter(file => file.progress != 100)
            .map((chunk, index) => {
                const form = new FormData();
                form.append('chunk', chunk.chunk)
                form.append('hash', chunk.hash)
                form.append('name', chunk.name)
                return {
                    index: chunk.index,
                    form,
                    //记录重试上传错误次数
                    error:0
                };
            })

        // .map((form, index) => uploadChunk(form, {
        //     onUploadProgress: ({ loaded, total }) => {
        //         this.chunks[index].progress = Number((loaded / total)) * 100;
        //         this.calcTotalProgress()
        //         console.log(this.percentage, '百分比')
        //     }
        // }));
        // await Promise.all(this.reqs)
        await this.reqControll(requests, 2, cb)
    }
    /**
     * 请求的编发数控制
     * @param {Array} reqs 请求的数组
     * @param {Number} limit 并发数量
     * @param {Function} cb 回调函数
     * @returns 
     */
    reqControll(reqs, limit = 2, cb) {
        cb.progress = 0
        cb.percentage = ''
        return new Promise((resolve, reject) => {
            const len = reqs.length;
            let counter = 0
            const start = async (reTryTask) => {
                //每次弹出一个任务 执行 
                const task = reTryTask || reqs.shift();
                // 如果有任务就请求
                if (task) {
                    // 如果后端报错 可能原因 超时 或者网络原因 
                    // 尝试3次重新请求如果还是保存 就整体报错
                    try {
                        await uploadChunk(task.form, {
                            onUploadProgress: ({ loaded, total }) => {
                                this.chunks[task.index].progress = Number((loaded / total)) * 100;
                                this.calcTotalProgress()
                                cb.progress = this.currentProgress
                                cb.percentage = this.percentage
                                cb(this)
                            }
                        })
                        //请求正常
                        if (counter == len - 1) {
                            resolve()
                        } else {
                            counter++;
                            start()
                        }
                    } catch (e) {
                        // 该任务 请求错误三次 直接整体报错
                        if(task.error==3){
                            //取消请求
                            AxiosToken.cancel()
                            return reject()
                        }
                        task.error++;
                        console.log(`第${task.index}个切片,尝试第${task.error}次重新请求中...`)
                        start(task)
                    }

                }
            }
            while (limit > 0) {
                start();
                limit--
            }
        })
    }
    //合并切片的请求
    /**
     * 合并chunk
     * @returns {Promise}
     */
    mergeChunk() {

        return new Promise(resolve => {
            const ext = this.file.name.split('.').pop();
            const size = this.CHUNK_SIZE;
            const hash = this.hash;
            mergeChunk({ ext, size, hash })
                .then(res => {
                    resolve(res)
                })
        })

    }
    /**
     * 询问后端是否上传完切片了 如果没有 返回已经上传的切片的索引
     */
    checkFile() {
        return new Promise(resolve => {
            const hash = this.hash;
            getChunkList({ hash })
                .then(res => {
                    if (res.uploadedList.length) {
                        this.chunks = this.chunks.map((file, index) => {
                            if (res.uploadedList.indexOf(file.name) > -1) {
                                file.progress = 100;
                            }
                            return file
                        })
                    }
                    resolve()
                })
        })
    }
}