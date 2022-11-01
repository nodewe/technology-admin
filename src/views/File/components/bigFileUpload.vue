<template>
  <el-dialog title="大文件上传" @keyup.enter.native='onSave()' :visible.sync="showFlag" custom-class="dialog-small"
    @close="closeDialog">
    <el-form ref="formData" label-width="80px">
      <el-form-item label="添加文件" prop="file">
        <div class="drag" @click="handleInput" @drop="fileData" @dragover="drag">
          <div v-if="formData.files.length">
            <div v-for="item,index in formData.files" :key="index">
              <span> {{item.name}}</span>
              <i @click.stop="delFile(index)" class="el-icon-close"></i>
            </div>
          </div>
          <div v-else>
            将文件拖到此处上传,或<el-button type="text">点击上传</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item  label="上传进度">
        <el-progress :color="progeressColor" :percentage="percent"></el-progress>
      </el-form-item>
      <el-form-item class="dialog-footer" align="center">
        <el-button type="primary" @click="onSave('formData')">保存上传</el-button>
        <el-button @click="onCancel('formData')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

//大文件切片上传
import bigFile from './bigUpload.js'
const big = new bigFile()
//文件的建议大小
const fileSize = 10;
export default {
  data() {
    return {
      //进度条的颜色
      progeressColor:'#409EFF',
      percent:0,//上传进度值
      showFlag: false,
      formData: {
        files: [],

      }
    }
  },
  
  methods: {

    handleInput() {
      const that = this;
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = false;
      input.name = 'file'
      input.onchange = function (e) {
        const [file] = this.files;
        //如果 小于
        if (!that.isSize(file.size)) {
          return that.$message.error(`文件大小至少${fileSize}M`)
        }
        that.formData.files = [file]
      }
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input)
    },
    delFile(index) {
      this.formData.files.pop()
    },
    // 初始化
    init() {
      this.formData.files = []
      this.percent = 0
      this.$nextTick(() => {
        this.changeShowFlag();
      })
    },
    drag(e) {
      e.preventDefault();
    },
    // 文件数据
    fileData(e) {
      e.preventDefault();
      const [file] = e.dataTransfer.files;
      if (!this.isSize(file.size)) {
        return this.$message.error(`文件大小至少${fileSize}M`)
      }
      this.formData.files = [file]

    },
    changeShowFlag() {
      this.showFlag = !this.showFlag
    },
    //文件大小 至少10M 不大于等于返回false 大于等于返回true
    isSize(size) {
      return size >= fileSize * 1024 * 1024
    },
    // 保存
    async onSave() {
      const [file] = this.formData.files;
      // const big = new bigFile(file, this);
      big.setFile(file)
      //计算切片
      // await big.createFileChunks()
      // // 计算hash
      await big.calculateHashWorker();
      //整理chunks
      big.combChunk()
      //抽样hash
      // await big.calculateHashSample()
      // 检查文件如果里面有切片    // 已经上传了
      await big.checkFile();
      const calc = (_big)=>{
        // console.log('progress=>',calc.progress)
        this.percent = calc.progress
        // console.log('percentage=>',calc.percentage)
      }
      try {
        await big.uploadChunks(calc)
      } catch (e) {
        this.progeressColor = '#F56C6C'
        return this.$message.error("文件切片上传失败")
      }
      
      const res = await big.mergeChunk();
      if (res.code == 200) {
        this.$message.success("文件上传成功")
        this.$emit('refresh')
        this.onCancel('formData')
      }

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
.drag {
  width: 400px;
  height: 250px;
  border-radius: 10px;
  border: 2px dashed gray;
  font-size: 16px;
  // font-weight:bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow-y: scroll;

  >input {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 250px;
    opacity: 0;

    &:hover {
      border: 2px dashed #49cdb2;
      cursor: pointer;
    }
  }

  &:hover {
    border: 2px dashed #49cdb2;
    cursor: pointer;
  }
}

.drag::-webkit-scrollbar {
  display: none;
}
</style>
