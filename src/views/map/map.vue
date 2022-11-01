<template>
    <div>
        <Map ref='Map'/>
        <button @click="getDistrict">获取</button>
    </div>
</template>

<script>
import Map from '@/components/Map/map.vue';
    export default {
        components:{
            Map
        },
        methods: {
            getDistrict() {
                // console.log()
                this.$refs.Map.DistrictSearch('云岩区')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>