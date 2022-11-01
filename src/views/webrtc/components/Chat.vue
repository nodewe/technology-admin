<template>
    <div>
        <el-form>
            <el-form-item label="用户名:">
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="房间号:">
                <el-input v-model="roomId" placeholder="请输入房间号"></el-input>
            </el-form-item>
        </el-form>


        <!-- <el-button>加入房间</el-button> -->
        <el-button :disabled="btnDisabled" @click="join">加入房间</el-button>
        <el-input type="textarea" placeholder="发送的消息区域" rows="10" v-model="chatValue"></el-input>
        <el-input placeholder="发送消息" v-model="sendMsg"></el-input>
        <el-button @click="send">发送消息</el-button>
    </div>
</template>

<script>

import io from 'socket.io-client'
export default {
    data() {
        return {
            username: '',
            roomId: '',
            socket: null,
            //聊天的内容
            chatValue: "",
            sendMsg: '',
            btnDisabled: false,
            messageList: []
        }
    },
    mounted() {
        this.initSocket()
        // window.onbeforeunload = function (e) {
        //     return ("谢谢光临");
        // }
    },
    methods: {
        initSocket() {
            this.socket = io('http://localhost:8080/');
            this.socket.on('connect', () => {
                console.log('连接成功')
            })

            //收到创建watch
            // this.$watch()
        },
        send() {
            let data = this.username + ":" + this.sendMsg
            this.socket.emit('message', this.roomId, data)
            this.sendMsg = ''
        },
        //加入房间
        join() {
            if (!this.roomId) return this.$message.error('房间号必填')

            //加入房间
            this.socket.on('joined', (room, id) => {
                this.btnDisabled = true;
                console.log('加入房间=>', room, id)
            })
            this.socket.on('message', msg => {
                console.log(msg, '返回消息')
                this.messageList.push(msg)
                this.chatValue = this.messageList.reduce((acc, cur) => acc + cur + '\r', '')
            })
            //离开

            this.socket.on('leaved', msg => {
                console.log(msg, '离开')
                this.btnDisabled = false;
            })

            this.socket.on('disconnect', msg => {
                console.log('连接断开')
            })
            this.socket.emit('join', this.roomId)
        }
    },
    beforeDestroy(){
        const data = this.username+":"+'离开房间'
        this.socket.emit('leave',this.roomId,data)
    }
}
</script>

<style lang="scss" scoped>

</style>