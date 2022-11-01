<template>
    <div class="flex-end">
        <div class="my-message">
            <div class="message">{{item.text}}</div>
            <el-avatar style="align-self:flex-start;margin-right:px" :size="40" :src="avatar"></el-avatar>
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
    }, data() {
        return {
            avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        }
    },

}
</script>

<style lang="scss" scoped>
.flex-end {
    display: flex;
    margin-top: 10px;
    justify-content: flex-end;
}

.my-message {
    display: flex;
    width: 80%;
    align-items: center;
    justify-content: flex-end;
    margin-right:10px;
}

.message {
    // flex: 1;
    // width:auto;
    min-width:auto;
    max-width:90%;
    background-color: greenyellow;
    color: black;
    padding: 5px;
    border-radius: 5px;
    // margin-right: 10px;
    word-break: break-all;
}
</style>