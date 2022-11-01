import * as Cesium from 'cesium';
import modifyMap from './filterColor'

export default class InitViewer{
    constructor(selector){
        this.$el = document.querySelector(selector);
        //保存选项
        this.$cesium = Cesium;
        // 初始化一下Cesium
        this.initCesium();
    }
    //初始化
    initCesium(){
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDMzNWIxMS02MmNjLTRlNGItYmFjYy0yZTc5NDE1MzViNWQiLCJpZCI6MTEyMjM3LCJpYXQiOjE2NjY2MTEwNDh9.XTlgfb8iIYjmI9XurWkQNmIs2IgU1hhBN2x7BWE1uak'

    }
}