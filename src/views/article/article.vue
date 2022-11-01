<template>
    <div class="weekly-wrap">
        <!-- 搜索框 start -->
        <el-form class="main-search" :inline="true" ref="keywords" label-position="left" label-width="85px"
            size="medium">
            <el-form-item>
                <el-input placeholder="请输入文章标题" v-model="searchForm.title" clearable>
                </el-input>
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

                <el-button type="primary" size="medium" @click="handleOpenPanel()">新增文章</el-button>
                <el-button type="danger" style="margin-left:20px" size="medium" :disabled="!dels.length"
                    @click="handleDelete(false)">批量删除</el-button>
            </div>
            <el-table height="400" @selection-change="(val)=>{dels=val}" :data="dataList"
                header-row-class-name="table-header" border style="width: 100%">
                <el-table-column type="selection" width="30">
                </el-table-column>
                <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>

                <el-table-column label="修改时间" prop="update_time" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" plain class="btnCopy"
                            @click="handleOpenPanel(scope.row.aid)">编辑
                        </el-button>
                        <!-- <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button> -->
                        <el-button size="mini" type="danger" plain @click="handleDelete(scope.row.aid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                :page-size="searchForm.pageSize" layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <components 
        @close="closePanel"
        @refresh="refresh" v-if="isAddEdit" ref="panel" is="addAndEdit"></components>
    </div>
</template>
  
<script>

import { getArticleList, deleteArticle } from '@/api/article.js'
import addAndEdit from "./components/add-edit.vue"
export default {
    name: 'Article',
    components: {
        addAndEdit
    },
    data() {
        return {
            //搜索参数
            searchForm: {
                //标题
                title: '',
                pageNum: 1,
                pageSize: 10
            },
            // 是否添加或者编辑
            isAddEdit: false,
            //批量删除对的数组
            dels: [], //批量删除的数据
            currentPage: 1, // 初始时在第几页
            totalCount: 0, // 总共多少条数据
            dataList: [],
        }
    },
    computed: {

    },
    created() {
        this.init()
    },
    methods: {
        closePanel() {
            this.isAddEdit = false
        },
        refresh() {
            this.closePanel()
            this.queryArticleList()
        },
        // 初始化
        init() {
            this.queryArticleList()
        },

        queryArticleList() {
            const params = this.searchForm
            getArticleList(params).then(res => {
                if (res.code == 200) {
                    this.dataList = res.list
                    this.totalCount = res.total
                }
            })
        },
        onSearch() {
            this.searchForm.pageNum = 1
            this.queryArticleList()
        },
        handleCurrentChange(val) {
            this.searchForm.pageNum = val
            this.queryArticleList()
        },
        onReset(formName) {
            this.pageNum = 1
            //  this.keywordsParams = JSON.parse(JSON.stringify(this.keywords))
            this.queryArticleList()
        },
        handleOpenPanel(aid) {
            this.isAddEdit = true;
            this.$nextTick(() => {
                this.$refs.panel.init(aid);
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
                let ids = id ? [id] : this.dels.map(e => e.aid)
                ids = ids.join(',');
                deleteArticle({ ids })
                    .then(res => {
                        if (res.code == 200) {
                            this.$message.success('删除成功')
                            this.queryArticleList()
                        }
                    })
            }

        },
        // 新增管理员子组件回调
        callBackAdd() {
            this.onReset('keywords')
            this.pageNum = 1
            this.queryArticleList()
            this.curPage = 1
        },
        // 编辑管理员子组件回调
        callBackEdit() {
            this.queryArticleList()
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
  