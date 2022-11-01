<template>
    <div>
        <el-menu-item v-for="item in menuList" :key="item.url" :index="item.url" @click="handleSelect(item.url)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>

        </el-menu-item>
    </div>
</template>

<script>

export default {
    props: {
        menuList: []
    }
}
</script>

<style lang="scss" scoped>

</style>