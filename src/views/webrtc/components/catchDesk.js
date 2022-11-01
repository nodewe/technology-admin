//捕获桌面的

export default class CatchDesk {
    constructor(video) {
        this.video = video;
        this.buffer = [];
        // this.getDisplayMedia()
    }
    //获取桌面的流
    async getDisplayMedia() {
        const options = {
            video: true,
            audio: false
        }
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia(options);
            this.video.srcObject = stream;
        } catch (e) {

        }
    }
    //同样可以录制桌面
    startRecord() {
        const options = {
            mimeType: 'video/webm/codecsv8'
        }
        const isSupported = MediaRecorder.isTypeSupported(options.mimeType);
        if (!isSupported) {
            return console.error(`${options.mimeType} is not supported!`)
        }

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, options)

        } catch (e) {

        }
        const handlerDataAvailable = e => {
            if (e && e.data && e.size > 0) {
                this.buffer.push(e.data)

            }
        }
        this.mediaRecorder.addEventListener('dataavailable',handlerDataAvailable)
        this.mediaRecorder.start(10)
    }
    //结束录制
    stopRecord(){
        this.mediaRecorder.stop()
    }   
    //重新录制
    reRecord(){
        this.mediaRecorder.resume()
    }
    //暂停录制
    pauseRecord(){
        this.mediaRecorder.pause()
    }
}