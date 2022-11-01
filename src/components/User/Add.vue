<template>
  <el-dialog title="新增管理员" :visible.sync="showFlag" custom-class="dialog-small" @close="closeDialog">
    <el-form ref="formData"
    @keydown.enter.native="onSave()"
    :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="formData.username" placeholder="请输入管理员账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="dialog-footer" align="center">
        <el-button type="primary" @click="onSave('formData')">保 存</el-button>
        <el-button @click="onCancel('formData')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { register } from '@/api/user.js'
import { encrypt } from "@/utils/jsencrypt.js"
export default {
  data() {
    return {
      showFlag: false,
      formData: {
        username: "",
        password: "",
      },
      formRules: {
        username: [
          { required:true, trigger: 'blur' ,message:'请输入用户名'}
        ],
        password: [
          { required:true, trigger: 'blur' ,message:'请输入密码'}
        ]
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.$nextTick(() => {
        this.changeShowFlag()
      })
    },
    //打开关闭弹框
    changeShowFlag() {
      this.showFlag = !this.showFlag
    },
    // 保存
    onSave() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.formData))
          form.password = encrypt(form.password)
          register(form).then(res => {
            if (res.code == 200) {
              this.$message.success('添加成功')
              this.$emit('addCallBack')
              this.onCancel()
            }
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    onCancel(formName) {
      this.changeShowFlag()
      this.$refs.formData.resetFields()
    },
    // 关闭弹出框
    closeDialog() {
      this.$refs['formData'].resetFields()
    }
  }
}
</script>

<style lang="scss">

</style>
