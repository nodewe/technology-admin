import * as Cesium from 'cesium';
import modifyMap from './filterColor'
import Store from '@/store'
import poyline from './yunyan.json'
import RainEffect from './rain.js';
export default class Estate {
    constructor(selector) {
        // console.log(Cesium, 'ces')
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDMzNWIxMS02MmNjLTRlNGItYmFjYy0yZTc5NDE1MzViNWQiLCJpZCI6MTEyMjM3LCJpYXQiOjE2NjY2MTEwNDh9.XTlgfb8iIYjmI9XurWkQNmIs2IgU1hhBN2x7BWE1uak'
        this.el = document.querySelector(selector);
        // const helper = new Cesium.EventHelper();
        this.Cesium = Cesium;
        //初始化cesium
        this.initCesium();

    }
    //初始化 cesium
    initCesium() {
        const viewer = new Cesium.Viewer(this.el, {
            // 动画组件的开关
            animation: false,
            //地图底色选择功能
            baseLayerPicker: false,
            // 全屏按钮的开关
            fullscreenButton: false,
            //视角恢复功能
            homeButton: false,
            //地图场景的切换功能 2d 3d 切换
            sceneModePicker: false,
            //选中功能
            selectionIndicator: false,
            //摄像机的功能
            infoBox: false,
            //时间线功能
            timeline: false,
            //帮助功能
            navigationHelpButton: false,
            //搜索功能
            geocoder: false,
            //加入地形
            terrainProvider: Cesium.createWorldTerrain(),

            //加入高德皮肤
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",

                minimumLevel: 4,
                maximumLevel: 18
            }),
        });
        // viewer.imageryLayers.addImageryProvider(
        //     new Cesium.IonImageryProvider({assetId:3813})
        // )
        modifyMap(viewer, {
            //反色?
            invertColor: true,
            //滤镜值
            filterRGB: [60, 145, 172],
            // filterRGB: [0, 0, 0],
        });
        this.viewer = viewer;
        //设置canvas的宽高
        this.resize()
        window.addEventListener('resize', this.resize.bind(this))
        //关闭默认的cesium 双击聚焦事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //添加事件 
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // handler.setInputAction((movement) => {
        //     // console.log(pick,'pick')
        //     const pick = this.viewer.scene.pick(movement.position);
        //     console.log(pick, 'pick')
        //     if (Cesium.defined(movement.position) && pick.id.id == 'card') {
        //         alert('欢迎点击')
        //     }
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        //去掉cesium 的logo
        viewer.cesiumWidget.creditContainer.style.display = 'none'
        //添加区域
        this.addPolygon()
        // 添加 轮廓
        this.addPolyline()
        this.viewer.scene.globe.depthTestAgainstTerrain = true;

        //初始化下雨
        this.rain = new RainEffect(this.viewer, {
            tiltAngle: 0.4, //倾斜角度
            rainSize: 0.6, //雨大小
            rainSpeed: 120.0, //雨速
        });
        // var layer = 
        // viewer.imageryLayers.addImageryProvider(layer);
        // this.load3dTileset()
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    resize() {
        // 得到左边的菜单栏是合起还是展开的
        const isCollapse = Store.state.isCollapse
        const marginLeft = isCollapse ? 56 : 200
        this.viewer.canvas.width = window.innerWidth - marginLeft;
        this.viewer.canvas.height = window.innerHeight - 60;
    }
    // 飞到一个地址
    /**
     * 
     * @param {Number} longitude 精度
     * @param {Number} latitude 纬度
     * @param {Boolean} isOrientation 是否开启倾斜
     * @returns 
     */
    flyTo(longitude, latitude, orientation, miter = 2000) {
        return new Promise(resolve => {
            const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, miter);
            // let orientation = {
            //     heading: Cesium.Math.toRadians(200.0),
            //     pitch: Cesium.Math.toRadians(-30.0),
            // }
            // let orientation = Cesium.HeadingPitchRoll.fromDegrees(longitude, latitude, 0)
            const params = {
                destination,
                complete: resolve,
                easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            };
            if (orientation) {
                params.orientation = orientation
            }
            this.viewer.camera.flyTo(params)
        })

    }
    //无过度效果切换到一个地址
    setView(longitude, latitude, orientation) {
        const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, 1200.0);
        orientation = orientation ? orientation : ({
            heading: Cesium.Math.toRadians(200.0),
            pitch: Cesium.Math.toRadians(-30.0),
        })
        this.viewer.camera.setView({
            destination,
            orientation
        })
    }
    //绘制polygon
    addPolygon() {
        let arr = poyline.geometry.coordinates.flat().map(Number)
        // console.log(arr,'arr')
        const pos = Cesium.Cartesian3.fromDegreesArray(arr);
        // console.log(pos,'pos')
        this.viewer.entities.add({
            polygon: {
                show: true,
                hierarchy: pos,
                // width:2,
                material: Cesium.Color.RED.withAlpha(0.1),
            },
            position: Cesium.Cartesian3.fromDegrees(106.72, 26.60),
        })
    }
    //绘制 polyline
    addPolyline() {
        let arr = poyline.geometry.coordinates.flat().map(Number)
        // console.log(arr,'arr')
        const pos = Cesium.Cartesian3.fromDegreesArray(arr);
        // console.log(pos,'pos')
        this.viewer.entities.add({
            polyline: {
                show: true,
                positions: pos,
                width: 2,
                material: Cesium.Color.RED,
                clampToGround: true
            },

        })
    }
    //使用css hex 获取颜色值
    cssHex(hex = '#fff', alpha = 1) {
        return Cesium.Color.fromCssColorString(hex).withAlpha(alpha)
    }
    //根据id获取对象
    getById(id) {

        return this.viewer.entities.getById(id)
    }
    //注册左键点击事件
    click(cb) {
        this.handler.setInputAction(cb, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // Cesium.ScreenSpaceEventType.
    }
    //处理闪烁
    flicker(cb) {
        // 处理material属性的闪烁
        return new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(cb, false)
        )
    }
    //添加几何体
    addGeometry(longitude, latitude, id, estate) {
        //有概率的闪烁 
        const random = Math.random() * 10,
            //步长
            step = 0.05;
        // 预警的闪烁
        let warnAlpha = 0.2, warnFlog = true;
        const warning = () => {
            if (warnFlog) {
                warnAlpha += step
                if (warnAlpha >= 0.8) {
                    warnFlog = false
                }
            } else {
                warnAlpha -= step
                if (warnAlpha <= 0.2) {
                    warnFlog = true
                }
            }
            return Cesium.Color.fromCssColorString('#f6ed45').withAlpha(warnAlpha)
        }
        // 异常的闪烁
        let dangerAlpha = 0.2, dangerFlog = true;
        const danger = () => {
            if (dangerFlog) {
                dangerAlpha += step
                if (dangerAlpha >= 0.8) {
                    dangerFlog = false
                }
            } else {
                dangerAlpha -= step
                if (dangerAlpha <= 0.2) {
                    dangerFlog = true
                }
            }
            return Cesium.Color.fromCssColorString('#f62027').withAlpha(dangerAlpha)
        }
        //存放 闪烁的函数
        let filker = false
        //小于3 就是 异常
        if (random < 3) {
            filker = danger;
        }
        //小于5 大于3 预警的函数
        if (random < 5 && random > 3) {
            filker = warning;
        }
        // 立方体的高度在60到100之间
        const height = Math.floor(Math.random() * 10) * 40 + 60
        const params = {
            id,
            type: 'estate',
            position: new Cesium.Cartesian3.fromDegrees(longitude, latitude, 0.0),
            // cylinder: {
            //     length: 60.0,
            //     topRadius: 20.0,
            //     bottomRadius:20.0,
            //     material: Cesium.Color.GRAY.withAlpha(.8),
            //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            // },
            box: {
                //设置立方体的 长宽高
                dimensions: new Cesium.Cartesian3(35.0, 35.0, height),
                //设置立方体的材质
                material: filker ? this.flicker(filker) : Cesium.Color.fromCssColorString("#3174ce"),
                // 实体贴近山地
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
            description: `
                <div>
                    <img width='200' height='300' src='${estate.image}'/>
                    <h3>小区名称：${estate.estate_name}</h3>
                </div>
              `
        }

        return params
    }
    //创建label
    addText(text, longitude, latitude, fontSize = 24) {
        let textWrap = '';
        for (let o of text) {
            textWrap += `${o}\n`
        }
        const label = {
            // position:
            text,
            fillColor: Cesium.Color.fromCssColorString('#fff'),
            font: `normal ${fontSize}px MicroSoft YaHei`,
            showBackground: false,
            scale: 0.5,
            //设置现实文字的距离条件  最近0  最远 1000米
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 12000),
            //设置缩放可见性
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            //设置层级
            eyeOffset: new Cesium.Cartesian3(0, 0, -100)
        }
        const position = new Cesium.Cartesian3.fromDegrees(longitude, latitude, 200);
        return {
            label,
            position
        }
    }
    //创建小区
    addEstate({ estate_id, estate_name, position, image }) {
        // console.log(estate_id, 'estate_id')
        let lnglat = position.split(',').map(Number)
        const box = this.addGeometry(lnglat[0], lnglat[1], estate_id, { estate_name, image })
        const text = this.addText(estate_name, lnglat[0], lnglat[1])
        // console.log(text)
        // this.viewer.scene.primitives.add(box)
        // this.viewer.scene.primitives.add(text)
        this.viewer.entities.add(box)
        this.viewer.entities.add(text)
    }
    //加载3dTileset
    load3dTileset() {
        const setStyle = (_3DTileset) => {
            _3DTileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['${height} >= 30', 'rgba(45, 0, 75, 1)'],
                        ['${height} >= 25', 'rgba(102, 71, 151, 1)'],
                        ['${height} >= 20', 'rgba(170, 162, 204, 1)'],
                        ['${height} >= 15', 'rgba(224, 226, 238, 1)'],
                        ['${height} >= 10', 'rgba(252, 230, 200, 1)'],
                        ['${height} >= 5', 'rgba(248, 176, 87, 1)'],
                        ['${height} >= 3', 'rgba(198, 106, 11, 1)'],
                        ['true', 'rgba(127, 59, 8, 1)']
                    ]
                }
            });
        }
        const setStyle2 = (_3DTileset) => {
            _3DTileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ["true", "color('cyan')"]
                    ]
                }
            });
        }

        const _tilest = new Cesium.Cesium3DTileset({
            enableDebugWireframe: true,
            url: '/data/yunyan/buildTiles/tileset.json',
            maximumScreenSpaceError: 2,
            // modelMatrix: Cesium.Matrix4.fromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
            // show:true
            // customShader: new Cesium.CustomShader({
            //     lightingModel: Cesium.LightingModel.UNLIT,
            //     fragmentShaderText: `
            //       // Color tiles by distance to the camera
            //       void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
            //       {
            //           material.diffuse = vec3(0.0, 0.0, 1.0);
            //           material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4;
            //       }
            //       `,
            // })
        })

        _tilest.readyPromise
            .then(tilest => {
                // this.cartographic(tilest)
                // console.log(tilest,1111) 
                // this.viewer.scene.primitives
                this.viewer.scene.primitives.add(_tilest)
                // setStyle(_tilest)
                // this.linearGrient(_tilest)
                // this.viewer.camera.flyTo(_tilest)
            }).catch(err => {
                console.log('加载失败', err)
            })

    }
    //开始下雨
    startRain() {
        this.rain.show(true)
    }
    //停止下雨
    stopRain() {
        this.rain.show(false)
    }
}