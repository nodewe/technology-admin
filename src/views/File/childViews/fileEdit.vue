<template>
  <el-dialog title="修改文件"
   :visible.sync="showFlag" custom-class="dialog-small" @close="closeDialog">
    <el-form ref="formData" label-width="80px">
      <el-form-item label="修改文件名" prop="file">
       <el-input v-model="formData.fileName"></el-input>
      </el-form-item>
      <el-form-item label="文件描述" prop="desc">
        <el-input v-model="formData.fileDesc" placeholder="请输入文件描述"></el-input>
      </el-form-item>
      <el-form-item class="dialog-footer" align="center">
        <el-button type="primary" @click="onSave('formData')">修改</el-button>
        <el-button @click="onCancel('formData')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { info,fileUpdate } from '@/config/interface'
export default {
  data () {
   
    return {
      showFlag: false,
      formData: {},
    }
  },
  components: {
  },
  created () {
  },
  methods: {
    // 初始化
    init (obj) {
      // this.formData.files = []
      this.formData = JSON.parse(JSON.stringify(obj))
      // this.formData.fileDesc!=='null' ?this.formData.fileDesc : '暂无描述'
      // this.$set(this.formData,'fileDesc')
      this.$nextTick(() => {
        this.changeShowFlag()
      })
    },
   
    changeShowFlag () {
      this.showFlag = !this.showFlag
    },
    // 保存
   async onSave () {
     const params = {
        fileId:this.formData.fileId,
        fileName:this.formData.fileName,
        fileDesc:this.formData.fileDesc,
        fileLocation:this.formData.fileLocation
     }
     const res = await this.$http(fileUpdate,params)

     if (res.code == 1) {
          this.$common.toast('修改成功', 'success', false)
          this.$emit('refresh')
          this.onCancel('formData')
          // this.$emit('refresh')
        }else{
          this.showFlag = true
        }
     
    },
    // 取消
    onCancel (formName) {
      this.changeShowFlag()
      this.$refs[formName].resetFields()
    },
    // 关闭弹出框
    closeDialog () {
      this.$refs['formData'].resetFields()
    }
  }
}
</script>

<style lang="scss">

  .drag{
    width:400px;
    height:250px;
    border-radius:10px;
    border:2px dashed gray;
    font-size:16px;
    // font-weight:bold;
    display:flex;
    justify-content:center;
    align-items:center;
    position: relative;
    overflow-y:scroll;
    >input{
      position:absolute;
      top:0;
      left:0;
      width:400px;
      height:250px;
      opacity:0;
      &:hover{
      border:2px dashed #49cdb2;
      cursor: pointer;
    }
    }
    &:hover{
      border:2px dashed #49cdb2;
      cursor: pointer;
    }
  }
  .drag::-webkit-scrollbar{
  display:none;
}
</style>
