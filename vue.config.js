const fs = require("fs")
const path = require("path")
const webpack = require('webpack')


//cesium 配置的代码
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const CopyWebpackPlugin = require('copy-webpack-plugin');

// function resolve(dir) {
//     return path.join(__dirname, dir)
// }
// const key = resolve('/ssl/client.key');
// // const cert = resolve('/ssl/server.key');
// const cert = resolve('/ssl/client.csr')
// // const key = resolve('/ssl/server.crt')

// const ca = resolve('/ssl/client.crt')
// console.log(key,'key')
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    // build:{},
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {
            sass: {
                data: `@import "./src/assets/styles/globals.scss";`
            }
        },
        modules: false
    },
    devServer: {
        port: 80,
        open: true,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://localhost:8080`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("./src"));
        config.module.set('unknownContextRegExp', /^('|')\.\/.*?\1$/);
        config.module.set('unknownContextCritical', false);
        config.amd({
            toUrlUndefined: false
        })
    },
    configureWebpack: {
        performance: {
            hints: false
        },
        plugins: [
            // Copy Cesium Assets, Widgets, and Workers to a static directory
            new CopyWebpackPlugin( [
                { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
            ]),
            new CopyWebpackPlugin( [
                { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
            ]),
            new CopyWebpackPlugin( [
                { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
            ]),
            new CopyWebpackPlugin( [
                { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty/Workers' }
            ]),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('./')
            })
        ],
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,
    // 第三方插件配置
    pluginOptions: {}
}