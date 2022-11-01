<template>
    <div>
        <!-- 本地的视频 -->
        <video autoplay playsinline ref="localVideo"></video>
        <!-- 远程视频 -->
        <video autoplay playsinline ref="remoteVideo"></video>
        <el-input v-model="roomId" placeholder="请输入房间号"></el-input>
        <button @click="join">加入</button>
        <button @click="leave">离开</button>
        <!-- <button @click="start">开始</button>
        <button @click="call">call</button>
        <button @click="stop">挂断</button> -->

    </div>
</template>

<script>

import Peer from './peer.js'
export default {
    data() {
        return {
            peer: null,
            //房间号
            roomId:''
        }
    },
    mounted() {
        const localVideo = this.$refs.localVideo;
        const remoteVideo = this.$refs.remoteVideo;

        this.peer = new Peer(localVideo, remoteVideo)
    },
    //开始
    methods: {
        join(){
            if(!this.roomId)return this.$message.warning('请输入房间号')
            console.log('join btn')
            this.peer.doJoin(this.roomId)
        },
        leave(){
            console.log('leave ...')
            this.peer.doLeave(this.roomId)
        }
    },
}
</script>

<style lang="scss" scoped>

</style>