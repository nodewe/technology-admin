const routers = [
    {
        path: 'user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
        meta: { pagePath: '/home/user' }
    },
    {
        path: 'file',
        name: 'file',
        component: () => import(/* webpackChunkName: "file" */ '@/views/File/file.vue'),
        meta: { pagePath: '/home/file' }
    },
    {
        path: 'video',
        name: 'video',
        component: () => import(/* webpackChunkName: "file" */ '@/views/video/video.vue'),
        meta: { pagePath: '/home/video' }
    },
    {
        path: 'article',
        name: 'article',
        component: () => import(/* webpackChunkName: "file" */ '@/views/article/article.vue'),
        meta: { pagePath: '/home/article' }
    },
    {
        path: 'chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "file" */ '@/views/chat/chat.vue'),
        meta: { pagePath: '/home/chat' }
    },
    {
        path: 'webrtc',
        name: 'webrtc',
        component: () => import(/* webpackChunkName: "file" */ '@/views/webrtc/webrtc.vue'),
        meta: { pagePath: '/home/webrtc' }
    },
    {
        path: 'cesium',
        name: 'cesium',
        component: () => import(/* webpackChunkName: "file" */ '@/views/cesium/cesium.vue'),
        meta: { pagePath: '/home/cesium' }
    },
    {
        path: 'map',
        name: 'map',
        component: () => import(/* webpackChunkName: "map" */ '@/views/map/map.vue'),
        meta: { pagePath: '/home/map' }
    },
]

export default routers;