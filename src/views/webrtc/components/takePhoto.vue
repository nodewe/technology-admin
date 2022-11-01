<template>
    <div>
        <el-select v-model="audioInputValue" placeholder="音频输入设备">
            <el-option v-for="item in audioIputList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="audioOutputValue" placeholder="音频输出设备">
            <el-option v-for="item in audioOutputList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="videoOutputValue" placeholder="视频的输出设备">
            <el-option v-for="item in videoOutputList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <!-- 录视频 -->
        <video autoplay playsinline ref="video"></video>
    </div>
</template>

<script>

import TakePhoto from './takephoto.js'
export default {
    data() {
        return {
            audioInputValue: '',
            audioOutputValue: '',
            videoOutputValue: '',
            audioIputList: [],
            audioOutputList: [],
            videoOutputList: [],
        }
    },
    methods: {
        // 从视频中获取一帧作为图片 存储下来(拍照)
        take() {
            const canvas = document.createElement('canvas');
            canvas.width = 360;
            canvas.height = 200;
            const ctx = canvas.getContext('2d')
            ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height)
            //如果需要下载 可以使用 toBlob 来获取 blob的数据
            //  canvas.toBlob((val) => {
            //     console.log(val)
            //     const url = window.URL.createObjectURL(val)
            //     const a = document.createElement('a');
            //     a.download = true;
            //     a.href = url;
            //     a.click()
            //     a.remove()
            //     console.log(url)
            // }, 'image/png', 1)
            //如果需要转成 base64 也可以使用 toDataURL
            // canvas.toDataURL('image/png',1)
        },
    },
    mounted() {
        const video = this.$refs.video

        new TakePhoto(video)

    }
}
</script>

<style lang="scss" scoped>

</style>