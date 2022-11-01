<template>
    <div>
        <video class="video-js vjs-default-skin vjs-big-play-centered" id="video">
        </video>
        <!-- <el-button @click="play">播放</el-button>
        <el-button @click="pause">停止</el-button> -->
    </div>
</template>

<script>
import videojs from 'video.js';
import "videojs-contrib-hls"
import 'video.js/dist/video-js.css'
/**
 * 参数中文文档 https://gitcode.gitcode.host/docs-cn/video.js-docs-cn/docs/guides/options.html#loop
 * 参数的英文文档 https://videojs.com/guides/options/#controlbarremainingtimedisplaydisplaynegative
 * videojs的github地址 https://github.com/videojs/video.js
 */
export default {
    props: {
        //播放地址
        src: {
            type: String,
            default: process.env.VUE_APP_BASE_API + '/public/file/video_m3u8/video.m3u8'
        },
        //播放的资源的类型 默认是m3u8类型
        type:{
            type:String,
            default:'application/x-mpegURL'
        },
        //宽和高
        width: {
            type: Number | String,
            default: 1000
        },
        height: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            // videojs 的实例
            player: null
        }
    },
    //组件销毁前的钩子
    beforeDestroy() {
        //组件销毁时将 player也销毁
        this.player.dispose()
    },
    methods: {
        //手动播放
        play() {
            this.player.play()
        },
        //手动停止
        pause(){
            this.player.pause()
        },
        //初始化videojs
        initVideo() {
            this.player = videojs("video", {
                controls: true,//是否有交互的控件
                // 是否循环播放
                loop: false,
                //默认情况下将使所有音频静音
                muted: false,
                //显示比率
                aspectRatio: '16:9',
                // aspectRatio: '4:3',
                // 使得 播放时间为从负数变为正数
                controlBar: { remainingTimeDisplay: { displayNegative: false } },
                //视频源
                sources: [
                    {
                        src:this.src,
                        type:this.type,
                    },
                ],
            },
                function onPlayerReady() {
                    // console.log("onPlayerReady", this);
                    // alert('加载成功')
                }
            )
        }
    },
}
</script>

<style lang="scss" scoped>

</style>