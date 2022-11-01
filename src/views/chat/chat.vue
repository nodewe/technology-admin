<template>
    <div>
        <Model v-if="!form" @close="closeDialog" ref='model' />
        <Room v-else :socket="socket" :form="form" ref='Room' />
    </div>
</template>

<script>
/**
 * 聊天室的小功能
 * 注意的点就是命名空间的和后端的沟通 
 */
import Chat from './components/chat.js'
import Model from "./components/model.vue";
import Room from "./components/room.vue";
export default {
    components: {
        Model,
        Room
    },
    name: 'chat',
    data() {
        return {
            // 切换组件
            form:null,
            socket: null
        }
    },
    mounted() {
        this.socket = new Chat();
    },
    methods: {
        //关闭dialog
        closeDialog(form) {
            this.form = form
            this.socket.emit('join',{roomId:form.roomId})
            this.$nextTick(()=>{
                this.$refs.Room.initOn()
            })
        },
        
    },
}
</script>

<style lang="scss" scoped>

</style>