import * as Cesium from 'cesium';
import Store from '@/store'
import poyline from './yunyan.json'
//cesium 初始化
export default class Init {
    constructor(selector) {
        // console.log(Cesium, 'ces')
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDMzNWIxMS02MmNjLTRlNGItYmFjYy0yZTc5NDE1MzViNWQiLCJpZCI6MTEyMjM3LCJpYXQiOjE2NjY2MTEwNDh9.XTlgfb8iIYjmI9XurWkQNmIs2IgU1hhBN2x7BWE1uak'
        this.el = document.querySelector(selector);
        // const helper = new Cesium.EventHelper();

        //初始化cesium
        this.initCesium();
        // this.initCesium2
        // this.lookAtTransform(106.72,26.60)
        // this.setView(106.72, 26.60)
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    initCesium2() {
        const viewer = new Cesium.Viewer(this.el, {
            terrainProvider: Cesium.createWorldTerrain(),
        });

        const tileset = new Cesium.Cesium3DTileset({
            url: 'Tileset/tileset.json',
        });

        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset);

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
        })
        // viewer.imageryLayers.addImageryProvider(
        //     new Cesium.IonImageryProvider({assetId:3813})
        // )
        this.viewer = viewer;
        //设置canvas的宽高
        this.resize()
        window.addEventListener('resize', this.resize.bind(this))

        //添加事件 
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((movement) => {
            // console.log(pick,'pick')
            const pick = this.viewer.scene.pick(movement.position);
            console.log(pick, 'pick')
            if (Cesium.defined(movement.position) && pick.id.id == 'card') {
                alert('欢迎点击')
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        //去掉cesium 的logo
        viewer.cesiumWidget.creditContainer.style.display = 'none'
        this.polygon()
        this.polyline()
        // this.loadBillBroads()
        // this.createPlane()
        // this.loadModel()
        // this.load3dTileset()
        const text = this.createText({ text: '万东花园', fontSize: 62, longitude: 106.72, latitude: 26.60 })
        console.log(text)
        this.viewer.entities.add(text);


        this.createGeometry()
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    }
    createPlane() {
        const plane = this.viewer.entities.add({
            id: 'card',
            position: new Cesium.Cartesian3.fromDegrees(106.59, 26.69),
            plane: {
                plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
                dimensions: new Cesium.Cartesian2(200, 400),
                material: '/card.jpg',
                // outlineColor:Cesium.Color.BLACK,
                // outline:true
            }
        })
    }
    // createText() {
    //     const pos = new Cesium.Cartesian3.fromDegrees(106.72, 26.60)
    //     this.viewer.entities.add({
    //         position: pos,
    //         label: {
    //             text: '万东花园',
    //             font: 'normal 30px MicroSoft YaHei',
    //             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
    //         }
    //     })
    // }
    resize() {
        // console.log(,'s')
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
    flyTo(longitude, latitude, isOrientation = false) {
        return new Promise(resolve => {
            const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, 2000.0);
            let orientation = {
                heading: Cesium.Math.toRadians(200.0),
                pitch: Cesium.Math.toRadians(-30.0),
            }
            // let orientation = Cesium.HeadingPitchRoll.fromDegrees(longitude, latitude, 0)
            const params = {
                destination,
                complete: resolve,
                easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN,
            };
            if (isOrientation) {
                params.orientation = orientation
            }
            this.viewer.camera.flyTo(params)
        })

    }
    setView(longitude, latitude) {
        const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, 1200.0);
        const orientation = {
            heading: Cesium.Math.toRadians(200.0),
            pitch: Cesium.Math.toRadians(-50.0),
        }
        this.viewer.camera.setView({
            destination,
            orientation
        })
    }
    /**
     * 俯瞰
     * @param {Number} longitude 经度
     * @param {Number} latitude 纬度
     */
    lookAt(longitude, latitude) {
        const offset = new Cesium.Cartesian3(0.0, 10000.0, 10000.0);
        const target = Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000.0);
        this.viewer.camera.lookAt(target, offset)
    }
    /**
     * 围绕着某一点看
     * @param {Number} longitude 经度
     * @param {Number} latitude 纬度
     */
    lookAtTransform(longitude, latitude) {
        const offset = new Cesium.Cartesian3(0.0, 10000.0, 10000.0);
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000.0));
        this.viewer.camera.lookAtTransform(transform, offset)
    }
    //绘制polygon
    polygon(arr) {
        arr = arr ? arr : poyline.geometry.coordinates.flat().map(Number)
        // console.log(arr,'arr')
        const pos = Cesium.Cartesian3.fromDegreesArray(arr);
        // console.log(pos,'pos')
        const polygon = this.viewer.entities.add({
            name: '云岩区',
            polygon: {
                show: true,
                hierarchy: pos,
                // width:2,
                material: Cesium.Color.RED.withAlpha(0.1),
            },
            position: Cesium.Cartesian3.fromDegrees(106.72, 26.60),
        })
        // const polyPositions = polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        // // 获取多边形的中心点
        // let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;//中心点
        // polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        // return {
        //     center: polyCenter,
        //     polygon
        // }

    }
    //创建一个集合体
    createGeometry() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.705554, 26.597165, 0.0),
            cylinder: {
                length: 100.0,
                topRadius: 50.0,
                bottomRadius: 50.0,
                material: Cesium.Color.fromRandom({ alpha: 1.0 }),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
        })
        return
        arr = arr ? arr : poyline.geometry.coordinates.flat().map(Number)
        // console.log(arr,'arr')
        const pos = Cesium.Cartesian3.fromDegreesArray(arr);
        // console.log(pos,'pos')
        const polygon = this.viewer.entities.add({
            name: '云岩区',
            polygon: {
                show: true,
                hierarchy: pos,
                extrudedHeight: 300,
                // width:2,
                material: Cesium.Color.RED.withAlpha(0.1),
            },
            // position: Cesium.Cartesian3.fromDegrees(106.72, 26.60),
        })
        const polyPositions = polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        // 获取多边形的中心点
        let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;//中心点
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        return {
            center: polyCenter,
            polygon
        }
    }
    //创建label
    createText({ text, fontSize, longitude, latitude }) {
        const label = {
            // position:
            text,
            color: Cesium.Color.fromCssColorString('#fff'),
            font: `normal ${fontSize}px MicroSoft YaHei`,
            showBackground: false,
            scale: 0.5,
            //设置现实文字的距离条件  最近0  最远 1000米
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 12000),
            // pixelOffset: new Cesium.Cartesian2(0, -20),
            // horizontalOrigin: Cesium.HorizontalOrigin.LEFT_CLICK,
            // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            //设置缩放可见性
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            //设置层级
            eyeOffset: new Cesium.Cartesian3(0, 0, -100)
        }
        const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
        return {
            label,
            position
        }
    }
    //绘制 polyline
    polyline() {
        let arr = poyline.geometry.coordinates.flat().map(Number)
        // console.log(arr,'arr')
        const pos = Cesium.Cartesian3.fromDegreesArray(arr);
        // console.log(pos,'pos')
        this.viewer.entities.add({
            name: '云岩区',
            polyline: {
                show: true,
                positions: pos,
                width: 2,
                material: Cesium.Color.RED,
                clampToGround: true
            },

        })

        // console.log(poyline,'poyline')

    }
    //加载模型
    loadModel() {
        const position = Cesium.Cartesian3.fromDegrees(
            106.72, 26.60, 1000
        );
        const model = this.viewer.entities.add({
            position: position,
            model: {
                uri: '/Cesium_Air.glb',
                minimumPixelSize: 128,
                //模型的最大比例尺大小。 minimumPixelSize的上限。
                maximumScale: 20000,
            }
        })
        this.viewer.flyTo(model)
    }
    //调整的tileset的倾斜摄影的高度
    cartographic(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            -80.0    //填高度差值
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    }
    //实现渐变效果
    linearGrient(tileset) {
        //实现渐变效果
        tileset.tileVisible.addEventListener(function (tile) {
            var content = tile.content;
            var featuresLength = content.featuresLength;
            for (let i = 0; i < featuresLength; i += 2) {
                let feature = content.getFeature(i)
                let model = feature.content._model

                if (model && model._sourcePrograms && model._rendererResources) {
                    Object.keys(model._sourcePrograms).forEach(key => {
                        let program = model._sourcePrograms[key]
                        let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
                        let v_position = "";
                        if (fragmentShader.indexOf(" v_positionEC;") != -1) {
                            v_position = "v_positionEC";
                        } else if (fragmentShader.indexOf(" v_pos;") != -1) {
                            v_position = "v_pos";
                        }
                        const color = `vec4(${feature.color.toString()})`;

                        model._rendererResources.sourceShaders[program.fragmentShader] =
                            `
            varying vec3 ${v_position};
            void main(void){
              vec4 position = czm_inverseModelView * vec4(${v_position},1); // 位置
              gl_FragColor = ${color}; // 颜色
              gl_FragColor *= vec4(vec3(position.z / 50.0), 1.0); // 渐变
              // 动态光环
              float time = fract(czm_frameNumber / 180.0);
              time = abs(time - 0.5) * 2.0;
              float glowRange = 180.0; // 光环的移动范围(高度)
              float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
              gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
            }
          `
                    })
                    model._shouldRegenerateShaders = true
                }
            }
        });
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
            customShader: new Cesium.CustomShader({
                lightingModel: Cesium.LightingModel.UNLIT,
                fragmentShaderText: `
                  // Color tiles by distance to the camera
                  void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
                  {
                      material.diffuse = vec3(0.0, 0.0, 1.0);
                      material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4;
                  }
                  `,
            })
        })

        // tilest.style = new Cesium.Cesium3DTileStyle({
        //     color: {
        //         conditions: [
        //             ['true', 'rgba(0,127.5,255,1)']
        //         ]
        //     }
        // })

        _tilest.readyPromise
            .then(tilest => {
                this.cartographic(tilest)
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
    loadBillBroads() {

        const pinBuilder = new Cesium.PinBuilder();
        const bluePin = this.viewer.entities.add({
            name: "Blank blue pin",
            position: Cesium.Cartesian3.fromDegrees(106.72, 26.60),
            billboard: {
                image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
        });

    }
    // 实现下雪的效果
    snow() {
        const snowParticleSize = 12.0;
        const snowRadius = 2000.0;
        const minimumSnowImageSize = new Cesium.Cartesian2(
            snowParticleSize,
            snowParticleSize
        );
        const maximumSnowImageSize = new Cesium.Cartesian2(
            snowParticleSize * 2.0,
            snowParticleSize * 2.0
        );
        const snowUpdate = function (particle, dt) {
            snowGravityScratch = Cesium.Cartesian3.normalize(
                particle.position,
                snowGravityScratch
            );
            Cesium.Cartesian3.multiplyByScalar(
                snowGravityScratch,
                Cesium.Math.randomBetween(-30.0, -300.0),
                snowGravityScratch
            );
            particle.velocity = Cesium.Cartesian3.add(
                particle.velocity,
                snowGravityScratch,
                particle.velocity
            );
            const distance = Cesium.Cartesian3.distance(
                this.viewer.scene.camera.position,
                particle.position
            );
            if (distance > snowRadius) {
                particle.endColor.alpha = 0.0;
            } else {
                particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
            }
        };

        this.viewer.scene.primitives.removeAll();
        this.viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: new Cesium.Matrix4.fromTranslation(
                    this.viewer.scene.camera.position
                ),
                //最小的速度
                minimumSpeed: -1.0,
                // 最大的速度
                maximumSpeed: 0.0,
                //消亡时间15秒
                lifetime: 15.0,
                //粒子发射
                emitter: new Cesium.SphereEmitter(snowRadius),
                // 初始大小的倍数
                startScale: 0.5,
                endScale: 1.0,
                image: "/snowflake_particle.png",
                emissionRate: 7000.0,
                startColor: Cesium.Color.WHITE.withAlpha(0.0),
                // 
                endColor: Cesium.Color.WHITE.withAlpha(1.0),
                //最小粒子的大小
                minimumImageSize: minimumSnowImageSize,
                // 最大粒子的大小
                maximumImageSize: maximumSnowImageSize,
                updateCallback: snowUpdate,
            })
        );
        this.viewer.scene.skyAtmosphere.hueShift = -0.8;
        this.viewer.scene.skyAtmosphere.saturationShift = -0.7;
        this.viewer.scene.skyAtmosphere.brightnessShift = -0.33;
        this.viewer.scene.fog.density = 0.001;
        this.viewer.scene.fog.minimumBrightness = 0.8;
    }
}