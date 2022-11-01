<template>
    <div>
        <!-- 录视频 -->
        <video autoplay playsinline ref="video"></video>
        <!-- 播放录制的视频 -->
        <video ref="record"></video>
        <button @click="startRecord">开始录制</button>
        <button @click="stopRecord">停止录制</button>
        <button @click="playRecord">播放录制视频</button>
    </div>
</template>

<script>
import Recorder from './mediaRecorder.js'

export default {
    data() {
        return {
            recorder:null
        }
    },
    methods: {
        //开始录制
        startRecord(){
            this.recorder.startRecord()
        },
        // 结束录制
        stopRecord(){
            this.recorder.stopRecord()
        },
        //播放录制的视频
        playRecord(){
            const video = this.$refs.record
            const blob = new Blob(this.recorder.buffer,{type:'video/mp4'})
            video.src = window.URL.createObjectURL(blob)
            video.srcObject = null;//直播流的时候可以赋值流给srcObject
            video.controls = true
        }
    },
    mounted() {
        const video = this.$refs.video

        this.recorder = new Recorder(video)
        //   deviceList.forEach(deviceInfo=>{
        //     const option = {
        //         label:deviceInfo.label,
        //         // value:
        //     }
        //     if(deviceInfo.kind=='videoinput'){
        //         // this,
        //     }
        //   })


    }
}
</script>

<style lang="scss" scoped>

</style>