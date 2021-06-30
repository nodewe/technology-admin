<template>
  <div>
         <iframe v-if="type=='word文档' || type=='pdf文档'" style="width:100%;height:100vh;border:0;" :src='`http://view.xdocin.com/xdoc?_xdoc=${url}`'>
         </iframe>
         <img  v-if="type=='图片'" :src="url" alt="图片">
         <video autoplay controls v-if="type=='视频'" :src="url"></video>
         <audio autoplay controls v-if="type=='音频'" :src="url"></audio>
  </div>
</template>

<script>
export default {
   data(){
       return {
           url:'',
           type:''
       }
   },
   created(){
      const str = new URLSearchParams(location.search)
     this.url = str.get('url')
     this.type = str.get('type')
    //    = location.href;
      console.log(this.url,'url')
   },
   beforeDestroy(){
    //    sessionStorage.removeItem('url')
   },
}
</script>

<style>
    img,video{
        width:100%;
    }
</style>