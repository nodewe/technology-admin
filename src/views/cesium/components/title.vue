<template>
    <div class="title">{{title}}
       
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:"云岩区水务系统"
        }
    },
}
</script>

<style lang="scss" scoped>
.title {
    position: absolute;
    background-image:url('../../../assets/bigData/title.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
    left: 50%;
    top: 0px;
    transform: translateX(-50%);
    width:100%;
    letter-spacing: 3px;
    font-size: 24px;
    color: white;
    text-align: center;
    font-weight:bold;
    // background-image: linear-gradient(135deg, #52e5e7, #130cb7);
    cursor: pointer;
    padding: 10px;
  
}
</style>