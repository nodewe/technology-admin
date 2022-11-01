<template>
    <div id="cesium-data">
        <Title></Title>
        <el-switch class="switch" v-model="isRain" @change="rainChange" >
        </el-switch>
        <i class="btn" @click="go">回到云岩区</i>
        <!-- cesium -->
        <transition enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutLeft">
            <left-box :lineOpt="lineOpt" :pieOpt="pieOpt" ref="leftBox" v-if="InOrOut"></left-box>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeInRight"
            leave-active-class="animate__animated animate__fadeOutRight">
            <right-box :lineOpt="lineOpt" :pieOpt="pieOpt" ref="rightBox" v-if="InOrOut"></right-box>
        </transition>
    </div>
</template>

<script>
// import Init from './init.js'
import Title from './components/title.vue'
import LeftBox from './components/left-data.vue'
import RightBox from './components/right-data.vue'
import Estate from './estate.js'
import { getEstateList } from "@/api/cesium.js"
import 'animate.css';
import { pieOptions, lineOptions } from './components/echarts-init';
export default {
    components: {
        Title,
        LeftBox,
        RightBox
    },
    computed: {
        isCollapse() {
            return this.$store.state.isCollapse
        }
    },
    watch: {
        //菜单展开变化时,canvas的大小也要变化
        isCollapse() {
            this.cesium.resize()
        }
    },
    data() {
        return {
            //饼图
            pieOpt: pieOptions,
            lineOpt: lineOptions,
            InOrOut: false,
            cesium: null,
            goAddress: [
                { label: '回到所在区域', lnglat: '106.72,26.60' }
            ],
            //选中的经纬度
            chooseLngLat: null,
            label: '云岩区水务管理系统',
            //小区数据
            estateList: null,
            // 使用map存储 对应的数据结构
            estateMap: null,
            // 是否下雨
            isRain:false
        }
    },
    methods: {
        //下雨的状态改变触发
        rainChange(){
            if(this.isRain){
                this.cesium.startRain()
            }else{
                this.cesium.stopRain()
            }
           
        },
        changeView() {
            this.InOrOut = !this.InOrOut
        },
        async getList() {
            const list = await getEstateList()
            this.estateList = list.list;
            this.estateMap = {}
            list.list.forEach(estate => {
                this.estateMap[estate.estate_id] = estate
                this.cesium.addEstate(estate)
            });
            // this.cesium.setView(106.72, 26.60)
            this.cesium.click(async (movement) => {
                this.InOrOut = false
                const pick = this.cesium.viewer.scene.pick(movement.position);
                console.log(pick, 'pick')
                if (this.cesium.Cesium.defined(movement.position) && pick.id) {
                    // console.log(pick.id.id)
                    // console.log(pick.id.id,pick.id.estate)
                    const id = this.estateMap[pick.id.id]
                    // console.log(id,'id')
                    if (id) {

                        const obj = this.cesium.getById(id.estate_id)
                        let lnglat = id.position.split(',').map(Number);

                        console.log(lnglat);

                        pieOptions.title.text = `{a|${id.estate_name}}`
                        lineOptions.title.text = `{a|${id.estate_name}}`
                        this.pieOpt = JSON.parse(JSON.stringify(pieOptions))
                        this.lineOpt = JSON.parse(JSON.stringify(lineOptions))
                        await this.cesium.sleep(500)
                        this.InOrOut = true
                        // this.$nextTick(() => {
                        //     const lineOptions = this.$refs.leftBox.getOptions('line')
                        //     console.log(lineOptions, 'lineOptions')
                        // })

                        this.cesium.viewer.zoomTo(obj)

                        // this.cesium.viewer.camera.moveBackward(10)
                    }

                    // let ap = 0.3;
                    // const short = ()=>{
                    //     obj.box.material = this.cesium.Cesium.Color.RED.withAlpha(ap)
                    //     if(ap==0.3)ap=0.9
                    // }
                    // setInterval(short,500)
                    // alert(estate.estate_name)
                } else {

                }
            })
        },
        async go(item) {
            await this.cesium.flyTo(106.72, 26.60)
            await this.cesium.sleep(2000)
            await this.cesium.flyTo(106.72, 26.60, {
                heading: this.cesium.Cesium.Math.toRadians(200),
                pitch: this.cesium.Cesium.Math.toRadians(-30),
                roll: this.cesium.Cesium.Math.toRadians(0)
            })

        },
        //斜视
        squint() {
            this.cesium.flyTo(this.chooseLngLat[0], this.chooseLngLat[1], true)
        },
        //俯视
        overlooking() {
            this.cesium.flyTo(this.chooseLngLat[0], this.chooseLngLat[1])
        }
    },
    async mounted() {
        this.cesium = new Estate('#cesium-data')
        // await cesium.sleep(1200)
        // cesium.flyTo(106.64, 26.59, async () => {
        //     await cesium.sleep(200)
        //     cesium.inited = true
        //     cesium.flyTo(106.64, 26.59)
        // })
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
#cesium-data {
    width: 100%;
    height: 100%;
    position: relative;



    b {
        position: absolute;
        left: 15px;
        color: white;
        text-align: center;
        background-image: linear-gradient(135deg, #52e5e7, #130cb7);
        cursor: pointer;
        padding: 20px;
    }

    .btn {
        position: absolute;
        top: 2px;
        right: 10px;
        // width: 100px;
        cursor: pointer;
        color: white;
    }
    .switch{
        position: absolute;
        top: 2px;
        right: 100px;
    }
}
</style>