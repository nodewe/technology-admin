<template>
    <el-dialog :title="title" :visible.sync="visible" width="60%" custom-class="dialog-small" @close="onCancel">
        <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <!-- <el-input v-model="form.content" placeholder="请输入文章内容"></el-input> -->
                <Editor ref="editor" v-model='form.content' />
            </el-form-item>
            <el-form-item class="dialog-footer" align="center">
                <el-button type="primary" @click="onSave()">保 存</el-button>
                <el-button @click="onCancel()">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
  
<script>
import { getArticleInfo, addArticle, updateArticleInfo } from '@/api/article.js'
import Editor from './editor.vue'
export default {
    components: {
        Editor
    },
    data() {
        const validate = (rule, value, callback)=>{
            const reg = /[\u4e00-\u9fa5]/g;
            if(!reg.test(value)){
                return callback(new Error('文章内容不能为空'));
            }
            callback()
        }
        return {
            // dialog 标题
            title: '添加文章',
            //可见
            visible: false,
            form: {
                aid: '',
                title: '',
                content: '',
                userId: ""
            },
            formRules: {
                title: [
                    { required: true, trigger: 'blur', message: '文章标题必填' }
                ],
                content: [
                    { validator: validate,required:true, trigger: 'blur', message: '文章内容必填' }
                ],
            },
        }
    },
    methods: {
        // 初始化
        init(id) {
            this.form.aid = id || ''
            if (id) {
                this.title = '编辑文章'
                //获取文章信息
                getArticleInfo({ aid: id })
                    .then(res => {
                        if (res.code == 200) {
                            Object.keys(this.form)
                                .forEach(key => {
                                    this.form[key] = res.info[key];
                                })
                            // JSON.parse
                            // console.log(this.form)
                            this.$refs.editor.html = this.form.content
                            // console.log(, 'content')
                        }
                    })
            }
            this.changeVisible()
        },
        //改变面板的可见
        changeVisible() {
            this.visible = !this.visible
        },
        // 保存
        onSave() {
            this.$refs.form.validate((valid) => {
                console.log(this.form.content)
                return
                if (valid) {
                    // 如果id 存在就 就是修改 不存在就是添加
                    const api = {
                        addArticle,
                        updateArticleInfo,
                    };
                    const str = this.form.aid ? 'updateArticleInfo' : 'addArticle';
                    if (str == 'addArticle') {
                        this.form.userId = this.$store.state.userInfo.id
                    }
                    const form = JSON.parse(JSON.stringify(this.form))
                    try {
                        api[str](form)
                            .then(res => {
                                if (res.code == 200) {
                                    if (str == 'updateArticleInfo') {
                                        this.$message.success('修改成功');
                                    } else {
                                        this.$message.success('添加成功');
                                    }

                                    this.$emit('refresh')
                                    this.onCancel()
                                }
                            })
                    } catch (error) {
                        this.$message.error('操作失败');
                    }

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 取消
        onCancel() {
            this.changeVisible()
            this.$emit('close')
        },

    }
}
</script>
  
<style lang="scss">

</style>
  