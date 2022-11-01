<template>
  <el-dialog title="新增管理员" :visible.sync="showFlag" custom-class="dialog-small" @close="closeDialog">
    <el-form ref="formData" :model="formData" :rules="formRules" label-width="80px">
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
import {getInfo,updateInfo} from '@/api/user.js'
import {decrypt,encrypt} from '@/utils/jsencrypt.js'
export default {
  data () {
   
    return {
      id:'',
      showFlag: false,
      formData: {
        id:'',
        username: '',
        password: '',
      },
      formRules: {
        username: [
          { required:true, trigger: 'blur' }
        ],
        password: [
          { required:true, trigger: 'blur' }
        ],
      },
      reqFlag: {
        edit: true
      }
    }
  },
  components: {
  },
  created () {
  },
  methods: {
    // 初始化
    init (id) {
      this.$nextTick(() => {
        this.id = id
        this.getUserDetail()
        this.changeShowFlag()
      })
    },
    changeShowFlag () {
      this.showFlag = !this.showFlag
    },
    getUserDetail () {
      let params = {
        id: this.id
      }
      getInfo(params)
      .then(res=>{
        if(res.code==200){
          Object.keys(this.formData)
          .forEach(key=>{
            this.formData[key] = res.info[key]
          });
          //密码解密
          this.formData.password = decrypt(this.formData.password)
        }
      })
    },
    // 保存
    onSave () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const form = JSON.parse( JSON.stringify(this.formData) );
            form.password = encrypt(form.password);
            updateInfo(form)
            .then(res=>{
              if(res.code==200){
                this.$message.success('修改成功');
                this.$emit('editCallBack')
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
    onCancel () {
      this.changeShowFlag()
      this.$refs.formData.resetFields()
    },
    // 关闭弹出框
    closeDialog () {
      this.$refs['formData'].resetFields()
    }
  }
}
</script>

<style lang="scss">

</style>
