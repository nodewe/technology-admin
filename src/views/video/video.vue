<template>
    <div>
        <videoPlayer ref="video"/> 
        <!-- <hlsPlayer ref="video"/>  -->
    </div>
</template>

<script>
//videojs 的版本
import videoPlayer from './components/videoPlayer.vue'
// hls.js 版本
import hlsPlayer from './components/hlsPlayer.vue'
export default {
    components: {
        videoPlayer,
        hlsPlayer,
    },
    data() {
        return {
        }
    },
    mounted() {
        this.$refs.video.initVideo()
    },
    methods: {
      
    },
}
</script>

<style lang="scss" scoped>

</style>