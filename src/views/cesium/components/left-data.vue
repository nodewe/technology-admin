<template>
    <div class="left-data">
        <pie :options="pieOpt" ref='pie'/>
        <lineChart :options="lineOpt" ref='line'/>
    </div>
</template>
<!-- 左边的数据 -->
<script>

import pie from './pie.vue';
import lineChart from './line.vue';

export default {
    props: {
        //饼图
        pieOpt: {
            type:Object,
            default:()=>{}
        },
        lineOpt:{
            type:Object,
            default:()=>{}
        }
    },
    components: {
        pie,
        lineChart
    },
    mounted() {
        console.log(11111)
        console.log(this.$refs.pie)
        this.$refs.pie.create();
        console.log(this.$refs.line)
        this.$refs.line.create();
    },
    methods: {
        getOptions(type) {
            console.log(type,'type')
            return this.$refs[type].getOptions()
        }
    },
}
</script>

<style lang="scss" scoped>
    .left-data{
        padding:10px 20px;
        position: absolute;
        left:0px;
        top:60px;
        width:350px;
        // height:550px;
        background-color:rgba($color:$color-big-data-bg, $alpha: .3);
    }
</style>