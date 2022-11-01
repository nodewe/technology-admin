<template>
    <div ref="list" class="list-container" @scroll="scrollEvent($event)">
        <div class="list-phantom" :style="{height:listHeight+'px'}">

        </div>
        <!-- 视窗 -->
        <div class="list" :style="{top:getTop}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/**
 * 虚拟列表组件 
 */
export default {
    props: {
        // 数据源
        listData: {
            type: Array,
            default: () => []
        },
        size: {
            type: Number,
            default: 200,
        }
    },
    computed: {
        //列表的高
        listHeight() {
            return this.listData.length + this.size;
        },
        //获取顶部的距离
        getTop() {
            return `${this.startOffset}px`
        },
        //可见视窗的数据个数
        visibleCount() {
            return Math.ceil(this.start / this.size)

        },
        //可见视窗内的数据
        visibleData() {
            return this.listData.slice(this.start, Math.min(this.end, this.listData.length))
        }
    },
    data() {
        return {
            //屏幕高
            screenHeight: 800,
            // 开始的偏移
            startOffset: 0,
            // 开始
            start: 0,
            // 结束为止
            end: 0
        }
    },
    mounted() {
        this.end = this.start - this.visibleCount
    },
    methods: {
        scrollEvent(e) {
            let scrollTop = this.$refs.list.scrollTop;

            this.start = Math.floor(scrollTop / this.size)
            this.end = this.start + this.visibleCount;
            this.startOffset = scrollTop - (scrollTop % this.size)
        }
    },
}
</script>

<style>
.list-container {
    height: 100%;
    overflow: auto;
    position: relative;
}

.list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
}
</style>