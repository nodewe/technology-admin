<template>
  <el-dialog title="添加文件"
   @keyup.enter.native='onSave()'
   :visible.sync="showFlag" custom-class="dialog-small" @close="closeDialog">
    <el-form ref="formData" label-width="80px">
      <el-form-item label="添加文件" prop="file">
       <div class="drag" @click="upload" @drop="fileData" @dragover="drag">
          <div v-if="formData.files.length">
            <div v-for="item,index in formData.files" :key="index">{{item.name}}</div>
          </div>
          <div v-else>
             将文件拖到此处上传,或<el-button type="text" >点击上传</el-button>
          </div>
         
          <input ref="input" type="file" multiple="multiple" name="file">
       </div>
       
       <!-- <el-upload
  class="upload-demo"
  drag
  action="http:///mathobj/back/api//file/add"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload> -->
      </el-form-item>
      <el-form-item v-if="show" label="上传进度">
          <el-progress :percentage="percent" ></el-progress>
       </el-form-item>
      <el-form-item label="文件描述" prop="desc">
        <el-input v-model="formData.desc" placeholder="请输入文件描述"></el-input>
      </el-form-item>
      <el-form-item class="dialog-footer" align="center">
        <el-button type="primary" @click="onSave('formData')">保 存</el-button>
        <el-button @click="onCancel('formData')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { info,fileAdd } from '@/config/interface'
export default {
  data () {
   
    return {
      show:false,//默认不显示
      percent:0,//上传进度值
      showFlag: false,
      formData: {
        files:[],
        fileDesc: null,
        
      },
      input:null
    }
  },
  components: {
  },
  created () {
  },
  methods: {
    // 初始化
    init () {
      this.formData.files = []
      this.$nextTick(() => {
        this.changeShowFlag()
      })
    },
    drag(e){
      e.preventDefault();
    },
    // 点击上传
    upload(){
      this.$refs.input.addEventListener('change',(e)=>{
        const fileList = e.target.files;
        Array.from(fileList).forEach(file=>this.getFileInfo(file))
      })
    },
    // 处理文件的信息
    getFileInfo(file){
      this.formData.files.push(file);
    },
    // 文件数据
    fileData(e){
      e.preventDefault();
      //info
      // png type:image/png  name:作业js.png size: 286532 (单位字节);
      // docx type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" size: 1988151 size: 1988151
      // xlsx type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      // 所有的图片类型 都是 image
      // audio/mp3
      // video/mp4
      //application/pdf
      // return
      const fileList = e.dataTransfer.files;
      Array.from(fileList).forEach(file=>this.getFileInfo(file))
      
    },
    changeShowFlag () {
      this.showFlag = !this.showFlag
    },
    // 保存
   async onSave () {
     const {data} = await this.$http(info)
     const formData = new FormData()
     this.formData.files.forEach((item,i)=>{
       formData.append('file',item)
     })
    //  formData.append('files',this.formData.files)
     formData.append('fileDesc',this.formData.fileDesc)
     formData.append('createMan',data.name)
    //  console.log(formData.get('file0'))
       sessionStorage.setItem('type','form')
      this.show=true
       const res =await this.$http(fileAdd,formData,{
        onUploadProgress: (progressEvent) => {
                if(progressEvent.lengthComputable){
                  var complete =
                  (( (progressEvent.loaded / progressEvent.total) * 100) | 0);
                  // console.log(complete,'complete')
                  this.percent = complete
                  if(complete >=100){
                    this.show = false
                    this.percent = 0; // 重新置0
                  }
                }
              },
     })
       sessionStorage.removeItem('type')
     if (res.code == 1) {
          this.$common.toast('添加成功', 'success', false)
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
