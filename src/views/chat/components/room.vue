<template>
    <div>
        <div class="header">房间号{{form.roomId}}</div>
        <scrollBar style="height:550px;background-color:#f5f5f5;">
            <div v-for="(item,index) in messageList" :key="index">
                <my :item="item" v-if="item.userId==socket.userId"></my>
                <other v-else :item="item"></other>
            </div>

        </scrollBar>
        <div class="send-input">
            <el-input @keyup.enter.native="send" placeholder="请输入发送的消息" v-model="message"></el-input>
            <el-button type="primary" @click="send">发送</el-button>
        </div>
    </div>
</template>

<script>
import my from './my.vue'
import other from './other.vue'

export default {
    props: {
        form: {
            type: Object,
            default: () => ({
                roomId: 23333
            })
        },
        socket:{
            type:Object,
            default:{}
        },
    },
    components: {
        my,
        other,
    },
    data() {
        return {
            //消息列表
            messageList: [],
            message: '',
        }
    },
    mounted() {

    },
    methods: {
        initOn() {
            const handlerMessage = (message) => {
                console.log(message,'message')
                if (message.type == 'message') {
                    this.messageList.push(message.data)
                }
            }
            this.socket.initOn(handlerMessage)
            
        },
        send() {
            if (!this.message.trim()) {
                return this.$message.warning('发送消息不能为空')
            }
            // console.log(this.socket.userId)
            const data = {
                roomId: this.form.roomId,
                userId: this.socket.userId,
                text: this.message,
                nickname:this.form.nickname
            }
            // this.messageList.push(data)
            this.message = ''
            this.socket.Emit('message', data)
        }
    },
}
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 40px;
    font-size: 20px;
    background-color: ghostwhite;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #409EFF;
}

.message-list {
    min-height: 550px;

}

.send-input {
    display: flex;
    margin-top: 10px;

    ::v-deep .el-input {
        margin-left: 5px;
    }

    button {
        margin: 0 5px 0 5px;
    }
}
</style>