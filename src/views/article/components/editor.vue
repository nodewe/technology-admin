<template>
    <div style="border: 1px solid #ccc;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="min-height: 300px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig"
            :mode="mode" @onChange="onChange" @onCreated="onCreated" />
    </div>
</template>

<script>
/**
 * 这里选用wangEditor 官方文档 https://www.wangeditor.com/v5/for-frame.html#%E4%BD%BF%E7%94%A8
 * 对应的github地址 https://github.com/wangeditor-team/wangEditor/issues
 */
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
export default Vue.extend({
    components: { Editor, Toolbar },
    data() {
        return {
            editor: null,
            html: '',
            toolbarConfig: {},
            editorConfig: {
                placeholder: '请输入内容...',
            },
            mode: 'simple', // or 'simple'
        }
    },
    methods: {
        //编辑器初始化完成
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        //内容变化将最新的数据发送出去
        onChange(editor) {
            this.$emit('input', this.html)
        }
    },

    mounted() {
        // 模拟 ajax 请求，异步渲染编辑器
        setTimeout(() => {
            // this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
        }, 1500)
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
})
</script>

<style lang="scss" scoped>

</style>