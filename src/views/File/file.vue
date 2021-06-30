<template>
  <div class="weekly-wrap">
    <!-- 搜索框 start -->
    <el-form class="main-search" :inline="true" :model="keywords" ref="keywords" :rules="searchRules" label-position="left" label-width="85px" size="medium">
      <el-row>
        <el-col :span="6">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="keywords.fileName" placeholder="请输入文件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <!-- <el-input v-model="keywords.startTime" placeholder="请输入创建时间"></el-input> -->
            <!-- {{keywords.time}} -->
            <el-date-picker
              v-model="keywords.time"
              @change="dateChange"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              :unlink-panels="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row>
        <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
            <el-button @click="onReset('keywords')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 搜索框 end -->

    <!-- 分割线 start -->
    <div class="hr-10"></div>
    <!-- 分割线 end -->

    <div class="main-content">
      <div class="content-header">
        <el-button type="primary" size="medium" @click="handleAdd">新增文件</el-button>
        <el-button type="danger" size="medium" :disabled="!dels.length" @click="handleDelete(false)">批量删除</el-button>
      </div>
      <el-table 
      height="400"
      @selection-change="(val)=>{dels=val}"
      v-loading="!this.reqFlag.search" :data="tableData" header-row-class-name="table-header" border style="width: 100%">
        <!-- <el-table-column type="selection" width="60"> -->
        <el-table-column type="selection" width="30">
        </el-table-column>
         <!-- <el-table-column prop="fileId" label="ID" align="center" width="120">
        </el-table-column> -->
        <el-table-column label="文件大小" width='80' align="center">
          <template slot-scope="scope">
            <div>{{scope.row.fileSize}}M</div>
            <!-- <el-button type="text" @click="goWeeklyDetails(scope.row.id)">{{scope.row.title}}</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
        <el-table-column prop="fileType" width="100" label="文件类型" align="center"></el-table-column>
        <el-table-column prop="fileLocation" label="文件URL" align="center"></el-table-column>
        <!-- <el-table-column prop="fileLocation" label="文件URL" align="center"></el-table-column> -->
        <el-table-column label="预览文件" width='300' align="center">
          <template slot-scope="scope">
            <!-- <div>{{new Date(scope.row.createTime).toLocaleDateString()}}</div> -->
            <div v-if="scope.row.fileType=='图片'">
              <img style="width:200px;height:100px;" @click="pre(scope.row)" :src="scope.row.fileLocation" alt="图片"/>
            </div>
             <div v-if="scope.row.fileType=='视频'">
              <!-- <video :src="scope.row.fileLocation" alt="图片"> -->
                <video style="width:200px;height:100px;" @click="pre(scope.row)" :src="scope.row.fileLocation"></video>
            </div>
            <div  v-if="scope.row.fileType=='音频'">
              <!-- <video :src="scope.row.fileLocation" alt="图片"> -->
                <!-- <video :src="scope.row.fileLocation"></video> -->
                <el-button @click="pre(scope.row)" type="text">点击播放</el-button>
            </div>
             <div v-if="scope.row.fileType=='word文档' || scope.row.fileType=='pdf文档'">
              <!-- <video :src="scope.row.fileLocation" alt="图片"> -->
                <!-- <video :src="scope.row.fileLocation"></video> -->
                <el-button @click="pre(scope.row)" type="text">点击预览</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileMime" label="文件格式" align="center"></el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column> -->
         <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <div>{{new Date(scope.row.createTime).toLocaleDateString()}}</div>
            <!-- <el-button type="text" @click="goWeeklyDetails(scope.row.id)">{{scope.row.title}}</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="createMan" label="创建人" align="center"></el-table-column>
         <el-table-column label="文件描述" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.fileDec?scope.row.fileDec:'暂无描述'}}</div>
            <!-- <el-button type="text" @click="goWeeklyDetails(scope.row.id)">{{scope.row.title}}</el-button> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="update_time" label="更新时间" align="center"></el-table-column> -->
        <el-table-column label="操作" fixed="right" align="center" width="250">
          <template slot-scope="scope">
             <el-button
             size="mini"
              type="warning"
              plain
              class="btnCopy"
              @click="copy(scope.row)">复制URL</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger" plain
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>
    <fileAddPanel @refresh="queryWeeklyList" v-if="fileAddVisble" ref="fileAdd"></fileAddPanel>
<fileEdit  @refresh="queryWeeklyList" v-if="fileEditVisble" ref="fileEdit"></fileEdit>
  </div>
</template>

<script>
import { userList, fileList, fileDel,weeklyUpdateState } from '@/config/interface'
import fileAddPanel from './childViews/fileAdd.vue'
import fileEdit from './childViews/fileEdit.vue'
import Clipboard from 'clipboard'
export default {
  components:{
    fileAddPanel,
    fileEdit
  },
  data () {
    return {
      // 添加文件
      fileAddVisble:false,
      // 修改文件
      fileEditVisble:false,
      keywords: {
        fileName:'',
        time:null,
      },
      dels: [], //批量删除的数据
      keywordsParams: {}, // 搜索请求是的搜索入参
      searchRules: {
      },
      reqFlag: { // 防止频繁点击，造成连续多次发请求
        user: true,
        search: true,
        delete: true
      },
      userList: [],
      pageNum: 1, // 请求第几页
      pageSize: this.$store.state.pageSize, // 每页请求多少条
      currentPage: 1, // 初始时在第几页
      totalCount: 0, // 总共多少条数据
      tableData: []
    }
  },
  computed: {
    userType: function () {
      let userType = this.$store.state.userInfo.type
      return userType
    },
    userPower: function () {
      let userType = this.$store.state.userInfo.type
      return userType == 1
    }
  },
  created () {
    this.init()
  },
  methods: {
    pre(row){
      let baseURL =location.origin+'/demo-weekly/front-end/'
      window.open(baseURL+'preView?url='+row.fileLocation+'&type='+row.fileType,'newWindow','width=400px,height=600px,left=600px,location=yes,status=yes')
     
    },
    dateChange(val){
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    // 初始化
    init () {
      this.queryUserList('')
      this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryWeeklyList()
    },
    queryUserList (userName) {
      const url = userList
      if (this.reqFlag.user) {
        this.reqFlag.user = false
        let params = {
          userType: this.userType,
          searchName: !userName ? null : userName,
          pageNum: 1,
          pageSize: 20
        }
        this.$http(url, params)
        .then(res => {
          if (res.code == 1) {
            let data = res.data
            let list = data.list
            let objList = []
            if (list.length > 0) {
              for (let value of list) {
                let obj = {
                  id: value.id,
                  name: value.name
                }
                objList.push(obj)
              }
            }
            objList.unshift({ 'id': null, 'name': '全部' })
            this.userList = objList
          }
          this.reqFlag.user = true
        })
      }
    },
    queryWeeklyList () {
      const url = fileList
      if (this.reqFlag.search) {
        this.reqFlag.search = false

        let params = {
          fileName:this.keywords.fileName,
          startTime:this.keywords.startTime,
          endTime:this.keywords.endTime,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.$http(url, params)
        .then(res => {
          if (res.code == 1) {
            let data = res.data
            // console.log(data)
            // return
            this.tableData = data.list
            this.totalCount = data.totalCount
            this.currentPage = this.pageNum
          }
          this.reqFlag.search = true
        })
      }
    },
    onSearch () {
      this.pageNum = 1
      this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryWeeklyList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.queryWeeklyList()
    },
    onReset (formName) {
      this.$refs[formName].resetFields()
      this.keywords.time = []
      this.keywords.fileName = ''
      this.pageNum = 1
      //  this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
      this.queryWeeklyList()
      this.curPage = 1
    },
    handleAdd () {
      // this.$router.push({ path: '/home/fileAdd' })
      this.fileAddVisble = true;
      this.$nextTick(()=>{
        this.$refs.fileAdd.init();
      })
      
    },
    goWeeklyDetails (id) {
      // this.$router.push({
      //   path: '/home/fileDetail',
      //   query: {
      //     id: id
      //   }
      // })
    },
    // 复制url
    copy(row){
     const clipboard = new Clipboard('.btnCopy',{
        text(){
          return row.fileLocation
        },
      })
        clipboard.on('success', (e)=>{
        // this.$message.success("复制成功");
        this.$common.toast('复制成功', 'success', false)
      });
       clipboard.on('error', (e)=>{
         this.$common.toast('复制失败', 'error', false)
        // this.$message.error("复制失败");
      });
      
    },
    handleEdit (row) {
      this.fileEditVisble = true;
      this.$nextTick(()=>{
        this.$refs.fileEdit.init(row);
      })
    },
    handleDelete (id) {
      this.$common.msgBox('confirm', '操作提示', '是否确定删除文件信息？', () => {
        const url = fileDel
        if (this.reqFlag.delete) {
          this.reqFlag.delete = false
          let params = id ? [id] : this.dels
          this.$http(url, params)
          .then(res => {
            if (res.code == 1) {
              this.$common.toast('删除成功', 'success', false)
              this.queryWeeklyList()
            }
            this.reqFlag.delete = true
          })
        }
      })
    },
    // 新增管理员子组件回调
    callBackAdd () {
      this.onReset('keywords')
      this.pageNum = 1
      this.queryWeeklyList()
      this.curPage = 1
    },
    // 编辑管理员子组件回调
    callBackEdit () {
      this.queryWeeklyList()
    }
  }
}
</script>

<style lang="scss">
img,video{
  cursor: pointer;
}
.weekly-main-wrap{ padding: 20px;
  h3{margin: 0;}
  /* 新增+编辑的周报样式 start */
  .el-form{width: 80%; max-width: 1000px; min-width: 825px; margin: 30px auto 0;
    .quill-editor { height: auto; }
    .quill-editor .ql-container{height: 180px;}
  }
  /* 新增+编辑的周报样式 end */
  /* 周报详情样式 start */
  .week-work-box{display: block; height: 180px; padding: 5px 15px; line-height: 1.5; font-size: inherit; box-sizing: border-box; border: 1px solid #E4E7ED; border-radius: 4px; resize: vertical; cursor: not-allowed; background-color: #F5F7FA;}
  .el-input.is-disabled .el-input__inner, .week-work-box{color: #888;}
  /* 周报详情样式 end */
}
</style>
