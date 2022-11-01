<template>
    <el-dialog title="加入聊天的房间" 
    width="40%"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible">
        <el-form :rules="formRules" ref="form" :model="form" label-position="top">
            <el-form-item label="房间号" prop="roomId">
                <el-input v-model="form.roomId" autocomplete="off" placeholder="请输入房间号"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入用户昵称" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
//模态框
export default {
    data() {
        return {
            dialogFormVisible:true,
            form: {
                roomId: '',
                nickname: ''
            },
            //校验规则
            formRules: {
                roomId: [
                    { required: true, trigger: 'blur', message: '房间号必填' }
                ],
                nickname: [
                    { required: true, trigger: 'blur', message: '昵称必填' }
                ]
            }
        }
    },
    methods: {
        init(){
            this.dialogFormVisible = true;
        },
        /**
         * 确定
         */
        confirm() {
            this.$refs.form.validate(vaild => {
                if (vaild) {
                    this.$emit('close', this.form)
                    this.cancel()
                }
            })
        },
        cancel() {
            this.dialogFormVisible = false;
        }
    },
}
</script>

<style lang="scss" scoped>
    .dialog-footer{
        button{
            width:100%;
            margin: 0 !important;;
        }
    }
</style>