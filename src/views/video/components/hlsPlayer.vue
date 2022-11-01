<template>
    <div>
        <video ref="video" id="video">
        </video>
        <el-button @click="play">播放</el-button>
        <el-button @click="pause">停止</el-button>
    </div>
</template>

<script>
import Hls from 'hls.js';
/**
 * hls.js的github地址 https://github1s.com/video-dev/hls.js
 */
export default {
    props: {
        //播放地址
        src: {
            type: String,
            default: process.env.VUE_APP_BASE_API + '/public/file/video_m3u8/video.m3u8'
        },
    },
    data() {
        return {
            isPlay: false,//是否可以播放
        }
    },

    methods: {
        //手动播放
        play() {
            if (!this.isPlay) {
                return this.$message.warning('视频未初始化完成')
            }
            this.$refs.video.play();
        },
        //手动停止
        pause() {
            if (!this.isPlay) {
                return this.$message.warning('视频未初始化完成')
            }
            this.$refs.video.pause()
        },
        //初始化videojs
        initVideo() {
            const video = this.$refs.video
            if (Hls.isSupported()) {
                var hls = new Hls({
                    debug: true,
                });
                hls.loadSource(this.src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    // video.muted = true;
                    // video.play();
                    this.isPlay = true
                });
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = this.src;
                video.addEventListener('canplay', function () {
                    // video.play();
                    this.isPlay = true
                });
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>