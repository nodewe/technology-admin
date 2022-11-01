
import 'webrtc-adapter';
import io from 'socket.io-client'
export default class Peer {
    localUserId = Math.random().toString(36).substr(2);
    // peerConnections = [];
    remoteUserId = ''

    localPC = null;
    constructor(localVideo, remoteVideo) {
        //初始化io对象
        this.createInitIo()
        // 本地的视频
        this.localVideo = localVideo
        // 远端的视频
        this.remoteVideo = remoteVideo
        // //本地的视频流
        this.localStream = null;

        // //远程的视频流
        // this.remoteStream = null;

        // this.localPC = null;

        // this.remotePC = null;
    }
    //创建io
    createInitIo() {
        this.socket = io('http://127.0.0.1:8080/webrtc');
        this.socket.on('connect', () => {
            console.log('连接成功')
        })

        this.reviceEventMessage()

    }
    //发送信息的封装
    sendMsg(event, msg) {
        return this.socket.emit(event, msg)
    }
    /**
     * 获取媒体流
     */
    async getUserMedia() {
        const options = {
            video: true,
            audio: false
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(options);
            // console.log(stream, 'STREM')
            this.localVideo.srcObject = stream;
            this.localStream = stream;
            // console.log(this.localStream, 'localStream')

        } catch (e) {
            console.error('getStream=>', e)
        }
    }
    //离开信令
    doLeave(roomId) {
        const jsonMsg = {
            "cmd": 'leave',
            'roomId': roomId,
            "uid": this.localUserId
        }
        this.sendMsg('leave', jsonMsg)
    }
    //doJoin方法  加入
    async doJoin(roomId) {
        this.roomId = roomId;
        const jsonMsg = {
            "cmd": 'join',
            'roomId': roomId,
            "uid": this.localUserId
        }
        await this.getUserMedia()
        this.sendMsg('join', jsonMsg)
        console.log('doJoin')
    }
    //接受 事件
    reviceEventMessage() {
        this.socket.on('message', data => {
            this.doEvent(data)
        })
        this.socket.on('peer-join', data => {
            this.doEvent(data)
        })
        this.socket.on('resp-join', data => {
            this.doEvent(data)
        })
        this.socket.on('peer-leave', data => {
            this.doEvent(data)
        })
        this.socket.on('offer', data => {
            this.doEvent(data)
        })
        this.socket.on('answer', data => {
            this.doEvent(data)
        })
        this.socket.on('candidate', data => {
            this.doEvent(data)
        })
    }
    //处理事件
    doEvent(data) {
        const TYPE = data.cmd;
        if (TYPE == 'peer-join') {
            this.handlerNewPeerJoin(data)
        }
        if (TYPE == 'resp-join') {
            this.handlerRespJoin(data)
        }
        if (TYPE == 'peer-leave') {
            this.handlerPeerLeave(data)
        }
        if (TYPE == 'offer') {
            //处理远端的offer
            this.handlerRemoteOffer(data)
        }
        if (TYPE == 'answer') {
            console.log('有没有收到对方的answer')
            // 处理远端的answer
            this.handlerRemoteAnswer(data)
        }
        if (TYPE == 'candidate') {
            // 处理远端的ice
            this.handlerRemoteCandidate(data)
        }
    }
    //处理ice
    handlerIceCandidate(e) {
        console.log('handlerIceCandidate')

        if (e.candidate) {
            const message = {
                "cmd": 'candidate',
                "roomId": this.roomId,
                "remoteUid": this.remoteUserId,
                "uid": this.localUserId,
                "candidate": e.candidate
            }
            this.sendMsg('candidate', message)
        } else {
            console.warn('不在请求打洞')
        }
    }
   
    //处理流
    handlerRemoteStreamAdd(e) {
        this.remoteVideo.srcObject = e.streams[0]
    }
    //处理远程发过来的offer
    async handlerRemoteOffer(data) {
        console.log('handlerRemoteOffer=>')

        if (!this.localPC) {
            this.createPeerConnect()
        }
        const desc = data.offer
        await this.localPC.setLocalDescription(desc)
        //创建回答
        this.doCreateAnswer()
    }
    //处理远程发过来的answer
    handlerRemoteAnswer(data) {
        console.log('handlerRemoteAnswer=>')
        this.localPC.setRemoteDescription(data.answer)
    }
    //处理远程发过来的ice
    handlerRemoteCandidate(data) {
        console.log('handlerRemoteCandidate=>')
        // data.candidate
        try {
            this.localPC.addIceCandidate(data.candidate)
        } catch (e) {
            console.log('error candidate');
        }
    }
    //处理远程的 加入的 newPeer
    handlerNewPeerJoin(data) {
        console.log('handlernewPeerJoin =>', data.remoteUid)
        this.remoteUserId = data.remoteUid;
        //加入进来现在有了两个人 可以发offer了
        this.doCreateOffer()
    }
    //处理给自己的响应
    handlerRespJoin(data) {
        console.log(`handlerRespJoin=>`, data.remoteUid);
        this.remoteUserId = data.remoteUid;
    }
    //有人离开
    handlerPeerLeave(data) {
        console.log(`handlerPeerLeave=>`, data.remoteUid);
        this.remoteVideo.srcObject = null
        // this.remoteUserId = data.remoteUid;
    }
    // //收到offer
    // handlerOffer(data) {
    //     const { uid, remoteUid, roomId } = data
    // }

    async createOfferAndSendMessage() {
        try {
            //创建affer
            const offerSession = await this.localPC.createOffer()
            const session = await this.localPC.setLocalDescription(offerSession)
            //发送offer
            const message = {
                "cmd": 'offer',
                "roomId": this.roomId,
                uid: this.localUserId,
                remoteUid: this.remoteUserId,
                'offer': session
            }
            this.sendMsg('offer', message)
            console.log('creteOffer=>')
        } catch (e) {
            console.log('createOfferAndSendMessage error')
        }
    }
    //创建answer
    async createAnswerAndSendMessage() {
        try {
            //创建answer
            const answerSession = await this.localPC.createAnswer()
            const session = await this.localPC.setLocalDescription(answerSession)
            //发送offer
            const message = {
                "cmd": 'answer',
                "roomId": this.roomId,
                uid: this.localUserId,
                remoteUid: this.remoteUserId,
                'answer': session
            }
            this.sendMsg('answer', message)
            console.log('creteAnswer=>')
        } catch (e) {
            console.log('createAnswerAndSendMessage error',e)
        }
    }
    //创建offer
    async doCreateOffer() {
        //如果 pc是空的
        if (!this.localPC) {
            this.createPeerConnect()
        }
        this.createOfferAndSendMessage()

    }

    //创建peerConnection
    createPeerConnect() {
        this.localPC = new RTCPeerConnection(null);

        this.localPC.onicecandidate = e => this.handlerIceCandidate(e);

        //onTrack
        this.localPC.ontrack = e => this.handlerRemoteStreamAdd(e);
        //本地的码流
        this.localStream.getTracks().forEach(track => this.localPC.addTrack(track, this.localStream))
    }
    //创建回应
    doCreateAnswer() {
        
        this.createAnswerAndSendMessage()
    }





    // //打电话的方法
    // async call() {
    //     //创建本地的
    //     this.localPC = new RTCPeerConnection();
    //     this.remotePC = new RTCPeerConnection()
    //     this.createLocalPeer()
    //     this.createRemotePeer()
    //     this.localStream.getTracks().forEach(track => {
    //         this.localPC.addTrack(track, this.localStream)
    //     });

    //     await this.createOffer();
    //     console.log(this.offer, 'offer')
    //     await this.createAnswer(this.offer)
    // }
    //挂断的方法
    stop() {

    }


    //创建本地的peerConnection
    createLocalPeer() {
        //收集到candidate  交给对方
        this.localPC.onicecandidate = e => {
            //这个时候就可以传给服务器 然后交给对端处理
            this.remotePC.addIceCandidate(e.candidate);
        }
    }
    //创建对端的ice监听
    createRemotePeer() {

        this.remotePC.onicecandidate = e => {
            // console.log(e, 'candidate')
            // new RTCIceCandidate({
            //     sdpMLineIndex:e.candidate.sdpMLineIndex,
            //     candidate:e.candidate.candidate
            // })
            // 这个时候就可以传给服务器 然后交给对端处理
            this.localPC.addIceCandidate(e.candidate)
        }

        this.remotePC.ontrack = e => {
            console.log(e)
            this.remoteVideo.srcObject = e.streams[0]
        }
    }

    // async createOffer() {
    //     return new Promise(async (resolve) => {
    //         //创建offer的参数
    //         const offerOptions = {
    //             offerToRecieveAudio: 0,
    //             offerToRecieveVideo: 1,
    //         }
    //         try {
    //             //创建一个offer
    //             const offer = await this.localPC.createOffer(offerOptions);
    //             // 再有服务器的情况下 offer 是要发送给对方 对方就可以创建一个回应
    //             this.offer = offer;
    //             this.localPC.setLocalDescription(offer)
    //             resolve()
    //         } catch (error) {
    //             console.log('failed to getOffer')
    //         }
    //     })

    // }
    // //创建回应
    // async createAnswer(offer) {
    //     return new Promise(async (resolve) => {
    //         try {
    //             this.remotePC.setRemoteDescription(offer)
    //             //对方创建自己的回应
    //             const answer = await this.remotePC.createAnswer();
    //             console.log('answer=>', answer)
    //             //设置自己的answer
    //             this.remotePC.setLocalDescription(answer)
    //             // 设置对方的desc
    //             this.localPC.setRemoteDescription(answer)
    //             resolve()
    //         } catch (error) {
    //             console.log('failed to createOffer')
    //         }
    //     })

    // }
}