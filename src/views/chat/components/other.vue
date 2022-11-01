<template>
    <div class="flex-start">
        <div class="my-message">
            <el-avatar style="align-self:flex-start;margin-left:5px" :size="40" :src="avatar"></el-avatar>
            <div>
                <div>{{item.nickname}}</div>
                <div class="message">{{item.text}}</div>
            </div>
           
        </div>
    </div>

</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({
                text: ''
            })
        }
    },
    data() {
        return {
            avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
    },
}
</script>

<style lang="scss" scoped>
.flex-start {
    display: flex;
    margin-top:10px;
    justify-content: flex-start;
}

.my-message {
    display: flex;
    width: 80%;
    align-items: center
}

.message {
    flex: 1;
    background-color: white;
    color: black;
    padding: 5px;
    border-radius: 5px;
    margin-left:5px;
    word-break: break-all;
}
</style>