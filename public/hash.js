//引入spark-md5
self.importScripts('spark-md5.js');


self.onmessage = e=>{
    //接受主线程传递的的数据
    const {chunks} = e.data;
    const spark = new self.SparkMD5.ArrayBuffer()

    let progress = 0,
    count = 0;

    const loadNext =index=>{
        const render = new FileReader();
        //读取每个chunk
        render.readAsArrayBuffer(chunks[index].file);
        render.onload = e=>{
            count++;
            spark.append(e.target.result);
            if(count==chunks.length){
                self.postMessage({
                    progress:100,
                    hash:spark.end()
                })
            }else{
                progress+=100/chunks.length;
                self.postMessage({
                    progress
                })
            }
        }
        loadNext(count)
    }
    loadNext(0)
}