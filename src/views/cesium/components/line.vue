<template>
    <!-- 柱状图数据 -->
    <div ref="Line" style="width:100%;height:300px" class="big-data-line"></div>
</template>

<script>
import { init } from 'echarts';
import { lineOptions } from './echarts-init';
export default {
    props: {
        //初始化参数
        options: {
            type: Object,
            default: () => lineOptions
        }
    },
    data() {
        return {
            echart:null
        }
    },
    methods: {
        //创建示例
        create() {
            this.echart = init(this.$refs.Line)
            this.echart.setOption(this.options)
        
        },
        //重新设置
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