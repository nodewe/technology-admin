export default class TakePhoto{
    constructor(video){
        this.video = video;
        if(this.isSupports()){
            return
        }
        this.getMediaStream()
        // this.getDevice()
    }
    //获取媒体流
    async getMediaStream(){
        const constrants = {
            //开启视频
            video:true,
            // {
            //     //帧率:
            //     frameRate:30,
            //     //帧率还可以这样写
            //     // frameRate:{
            //     //     min:10,
            //     //     max:30
            //     // },
            //     //宽
            //     width:1080,
            //     // 高
            //     height:720,
            //     // 摄像头的状态 约束
            //     /**
            //      * 手机上可以使用
            //      * user 前置摄像头
            //      * environment 后置摄像头
            //      * left 前置左侧摄像头
            //      * right 前置右侧摄像头
            //      */
            //     // facingMode:"user"
            // },
            // 采集音频
            audio:false
            // {
            //     //音量 0-1.0
            //     // volume:0.8,
            //     //采样率
            //     // sampleRate:16000,
            //     //采样大小
            //     // sampleSize:18,
            //     //回音消除
            //     // echoCancellation:true,
            //     //自动增益
            //     // autoGainControl:true,
            //     //降噪
            //     // noiseSuppression:true,
            //     //延迟大小
            //     // latency:200,
            //     //单双声道
            //     // channelCount:2,
            //     //音量设备的选择
            //     // deviceId:'',
            //     //分组id
            //     //groupId
            // }
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constrants)
            // 将流赋值个video srcObject
            this.video.srcObject = stream;
            this.getVideoTrack(stream)
        } catch (e) {
            console.log('getUserMedia=>',e)
        }
    }
    //获取video的track
    getVideoTrack(videoStream){
        const track = videoStream.getVideoTracks()[0]
        const settings = track.getSettings()
        console.log(settings,'settings')
    }
    
    //判断是否支持getUserMedia
    isSupportGetUserMedia(){
        if(!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia){
                console.error('getUserMedia is not supported!')
                return true
            }
    }
    //判断了浏览器是否支持 enumerateDevices
    isSupports(){
        if(!navigator.mediaDevices ||
            !navigator.mediaDevices.enumerateDevices){
                console.log('enumerateDevices is not supported!');
                return true
            }
    }
    //获取设备名称 和设备id
    /**
     * 需要在https的环境下 才能显示设备的id 和设备名称
     * 苹果的safari 浏览器直接获取设备名称 和id是不行的 需要获取用户的授权才行
     * 所以我们可以统一在getUserMedia方法获取授权成功后然后我们就可以调用
     * enumerateDevices方法
     */
    async getDevice(){
        try {
            const deviceInfos = await navigator.mediaDevices.enumerateDevices();
            return deviceInfos
            deviceInfos.forEach(deviceInfo=>{
                console.log(deviceInfo,'deviceInfo')
            })
        } catch (e) {
            console.log(err,'err=>')
        }
       
    }
}