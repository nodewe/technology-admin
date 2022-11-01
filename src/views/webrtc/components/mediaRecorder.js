// 音视频录制
export default class Recorder {
    constructor(video) {
        this.video = video;
        //创建一个buffer数组
        this.buffer = []
        // this.getMediaStream()
    }
    async getMediaStream() {
        const options = {
            video: true,
            audio: true
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(options);
            this.video.srcObject = stream;
            this.stream = stream;
        } catch (e) {
            console.log(e)
        }

    }
    //开始录制
    startRecord() {
        const option = {
            mimeType: 'video/webm;codecs=vp8',
        }
        //判断支不支持该类型
        const isSupported = MediaRecorder.isTypeSupported(option.mimeType)
        if (!isSupported) {
            return console.error(`${option.mimeType} is not supported`)
        }

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, option)
        } catch (e) {
            console.error('Failed to create MediaRecorder:', e)
            return
        }
        const handlerDataAvailable = e => {
            if (e && e.data && e.data.size > 0) {
                // debugger
                this.buffer.push(e.data)
            }
        }
        this.mediaRecorder.ondataavailable = handlerDataAvailable;
        this.mediaRecorder.start(10)

    }
    //重新录制
    reRecord() {
        this.mediaRecorder.resume();
    }
    //停止录制
    stopRecord() {
        this.mediaRecorder.stop()
    }
    //暂停录制
    puaseRecord() {
        this.mediaRecorder.pause()
    }

}