<template>
    <!-- 饼图数据 -->
    <div ref="pie" style="width:100%;height:300px" class="big-data-pie"></div>
</template>

<script>
import { init } from 'echarts';
import { pieOptions } from './echarts-init';
export default {
    props: {
        //初始化参数
        options: {
            type: Object,
            default: () => pieOptions
        }
    },

    data() {
        return {
            echart: null
        }
    },
    methods: {
        // 创建实例
        create() {
            this.echart = init(this.$refs.pie)
            this.echart.setOption(this.options)
        },
        //重新设置参数
        setOption(opt){
            this.echart.setOption(opt)
        },
        //获取配置
        getOption(){
            return this.echart.getOption()
        }
    },
}
</script>

<style lang="scss" scoped>

</style>