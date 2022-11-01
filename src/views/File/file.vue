<template>
  <div class="weekly-wrap">
    <!-- 搜索框 start -->
    <el-form class="main-search" :inline="true" :model="keywords" ref="keywords" 
      label-position="left" label-width="85px" size="medium">
      <el-form-item>
        <el-date-picker v-model="keywords.time" @change="dateChange" type="daterange" value-format="timestamp"
          range-separator="至" :unlink-panels="true" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset('keywords')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索框 end -->

    <!-- 分割线 start -->
    <div class="hr-10"></div>
    <!-- 分割线 end -->

    <div class="main-content">
      <div class="content-header">
        <el-select
        @change="handleAdd"
        v-model="fileAddType" placeholder="选择新增文件的大小">
          <el-option v-for="item in uploadFileType" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-button type="primary" size="medium" @click="handleAdd">新增文件</el-button> -->
        <el-button type="danger"
        style="margin-left:20px" 
        size="medium" :disabled="!dels.length" @click="handleDelete(false)">批量删除</el-button>
      </div>
      <el-table height="400" @selection-change="(val)=>{dels=val}"  :data="dataList"
        header-row-class-name="table-header" border style="width: 100%">
        <el-table-column type="selection" width="30">
        </el-table-column>
        <el-table-column prop="fileUrl" label="文件相对路径" align="center"></el-table-column>
        <el-table-column prop="fileLocation" label="文件URL" align="center"></el-table-column>

        <el-table-column label="创建时间" prop="create_time" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" plain class="btnCopy" @click="copy(scope.row)">复制URL</el-button>
            <!-- <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button> -->
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </div>
    <!-- <fileAddPanel @refresh="queryFileList" v-if="fileAddVisble" ref="fileAdd"></fileAddPanel> -->
    <!-- <bigFileUpload @refresh="queryFileList" v-if="fileAddVisble" ref="fileAdd" /> -->
    <components @refresh="queryFileList" v-if="fileAddVisble" ref="fileAdd" :is="fileAddType"></components>
  </div>
</template>

<script>
//普通文件上传
import fileAddPanel from './components/fileAdd.vue'
// 大文件分片上传
import bigFileUpload from './components/bigFileUpload.vue'
// 文件夹上传
import folderUpload from './components/folderUpload.vue'
import Clipboard from 'clipboard'
import { getList, deleteFile } from '@/api/file.js'
export default {
  name: 'file',
  components: {
    fileAddPanel,
    bigFileUpload,
    folderUpload
  },
  data() {
    return {
      // 添加文件
      fileAddVisble: false,
      keywords: {
        fileName: '',
        time: null,
      },
      dels: [], //批量删除的数据
      keywordsParams: {}, // 搜索请求是的搜索入参
      pageNum: 1, // 请求第几页
      pageSize: 10, // 每页请求多少条
      currentPage: 1, // 初始时在第几页
      totalCount: 0, // 总共多少条数据
      dataList: [],
      //上传的文件类型
      fileAddType: "",
    }
  },
  computed: {
    //上传文件类型选择
    uploadFileType() {
      return [
        { label: '大文件上传', value: 'bigFileUpload' },
        { label: '小文件上传', value: 'fileAddPanel' },
        { label: '文件夹上传', value: 'folderUpload' },
      ]
    },
    userType: function () {
      let userType = this.$store.state.userInfo.type
      return userType
    },
    userPower: function () {
      let userType = this.$store.state.userInfo.type
      return userType == 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    pre(row) {
      let baseURL = location.origin + '/demo-weekly/front-end/'
      window.open(baseURL + 'preView?url=' + row.fileLocation + '&type=' + row.fileType, 'newWindow', 'width=400px,height=600px,left=600px,location=yes,status=yes')

    },
    dateChange(val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    // 初始化
    init() {
      // this.queryUserList('')
      // this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryFileList()
    },

    queryFileList() {
      this.fileAddType='';
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getList(params).then(res => {
        if (res.code == 200) {
          this.dataList = res.list
          this.totalCount = res.total
        }
      })
    },
    onSearch() {
      this.pageNum = 1
      this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryFileList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryFileList()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.keywords.time = []
      this.keywords.fileName = ''
      this.pageNum = 1
      //  this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryFileList()
      this.curPage = 1
    },
    handleAdd(val) {
      // this.$router.push({ path: '/home/fileAdd' })
      // console.log(val,'val')
      // return
      this.fileAddVisble = true;
      this.$nextTick(() => {
        this.$refs.fileAdd.init();
      })

    },
    // 复制url
    copy(row) {
      const clipboard = new Clipboard('.btnCopy', {
        text() {
          return row.fileLocation
        },
      })
      clipboard.on('success', (e) => {
        // this.$message.success("复制成功");
        this.$common.toast('复制成功', 'success', false)
      });
      clipboard.on('error', (e) => {
        this.$common.toast('复制失败', 'error', false)
        // this.$message.error("复制失败");
      });

    },
    handleEdit(row) {
      this.fileEditVisble = true;
      this.$nextTick(() => {
        this.$refs.fileEdit.init(row);
      })
    },
    async handleDelete(id) {
      const bool = await this.$confirm('是否确定批量删除文件', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'messagebox-cancel-button',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
      if (bool == 'confirm') {
        let ids = id ? [id] : this.dels.map(e => e.id)
        ids = ids.join(',');
        deleteFile({ ids })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.queryFileList()
            }
          })
      }

    },
    // 新增管理员子组件回调
    callBackAdd() {
      this.onReset('keywords')
      this.pageNum = 1
      this.queryFileList()
      this.curPage = 1
    },
    // 编辑管理员子组件回调
    callBackEdit() {
      this.queryFileList()
    }
  }
}
</script>

<style lang="scss">
img,
video {
  cursor: pointer;
}

.weekly-main-wrap {
  padding: 20px;

  h3 {
    margin: 0;
  }

  /* 新增+编辑的周报样式 start */
  .el-form {
    width: 80%;
    max-width: 1000px;
    min-width: 825px;
    margin: 30px auto 0;

    .quill-editor {
      height: auto;
    }

    .quill-editor .ql-container {
      height: 180px;
    }
  }

  /* 新增+编辑的周报样式 end */
  /* 周报详情样式 start */
  .week-work-box {
    display: block;
    height: 180px;
    padding: 5px 15px;
    line-height: 1.5;
    font-size: inherit;
    box-sizing: border-box;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
    resize: vertical;
    cursor: not-allowed;
    background-color: #F5F7FA;
  }

  .el-input.is-disabled .el-input__inner,
  .week-work-box {
    color: #888;
  }

  /* 周报详情样式 end */
}
</style>
