<template>
    <div>
        <!-- <mediaRecorder/>    -->
        <!-- <catchDesk/> -->
        <!-- <Chat/> -->
        <peerConnnection/>
    </div>
</template>

<script>
    import mediaRecorder from './components/mediaRecord.vue'
    import catchDesk from './components/catchDesk.vue'
   import Chat from './components/Chat.vue'
   import peerConnnection from './components/peerConnnection.vue'
    export default {
        components: {
            mediaRecorder,
            catchDesk,
            Chat,
            peerConnnection
        },
    }
</script>

<style lang="scss" scoped>

</style>