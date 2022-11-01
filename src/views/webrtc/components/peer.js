
import io from 'socket.io-client'
const SIGNAL_TYPE_JOIN = "join";
const SIGNAL_TYPE_RESP_JOIN = "resp-join";  // 告知加入者对方是谁
const SIGNAL_TYPE_LEAVE = "leave";
const SIGNAL_TYPE_NEW_PEER = "new-peer";
const SIGNAL_TYPE_PEER_LEAVE = "peer-leave";
const SIGNAL_TYPE_OFFER = "offer";
const SIGNAL_TYPE_ANSWER = "answer";
const SIGNAL_TYPE_CANDIDATE = "candidate";
export default class Peer {
    localUserId = Math.random().toString(36).substr(2);

    remoteUserId = '';

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
    }
    //创建io对象
    createInitIo() {
        this.socket = io('http://127.0.0.1:8080/webrtc');
        this.socket.on('connect', () => {
            console.log('连接成功')
        })

        this.reviceEventMessage()
    }
    //接受事件
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
            this.localVideo.srcObject = stream;
            this.localStream = stream;
        } catch (e) {
            console.log('getUserMedia=>')
        }
    }
    /**
     * 创建RTCPeerConnection
     */
    createPeerConnection() {
        this.localPC = new RTCPeerConnection(null); // 音视频通话的核心类

        this.localPC.onicecandidate = e => this.handleIceCandidate(e);

        this.localPC.ontrack = e => this.handleRemoteStreamAdd(e);

        this.localStream.getTracks().forEach((track) => this.localPC.addTrack(track, this.localStream)); // 把本地流设置给RTCPeerConnection
    }
    /**
     * 处理candidate
     */

    handleIceCandidate(event) {
        console.info("handleIceCandidate");
        if (event.candidate) {
            const candidateJson = {
                'label': event.candidate.sdpMLineIndex,
                'id': event.candidate.sdpMid,
                'candidate': event.candidate.candidate
            };
            const msg = {
                'cmd': 'candidate',
                'roomId': this.roomId,
                'uid': this.localUserId,
                'remoteUid': this.remoteUserId,
                'candidate': candidateJson
            };
            this.sendMsg('candidate', msg)
            console.info("send candidate message");
        } else {
            console.warn("End of candidates");
        }
    }
    /**
     * 处理流
     */
    handleRemoteStreamAdd(event) {
        console.info("handleRemoteStreamAdd");
        this.remoteVideo.srcObject = event.streams[0];
    }
    /**
     * 处理加入信令
     */
    async doJoin(roomId) {
        this.roomId = roomId;
        const msg = {
            cmd: 'join',
            'roomId': roomId,
            "uid": this.localUserId
        }
        await this.getUserMedia()
        this.sendMsg('join', msg)
    }
    /**
     * 处理离开信令
     */
    doLeave(roomId) {
        const msg = {
            "cmd": 'leave',
            'roomId': roomId,
            "uid": this.localUserId
        }
        this.sendMsg('leave', msg)
    }
    /**
     * 创建offer
     */
    async doOffer() {
        // 创建RTCPeerConnection
        if (this.localPC == null) {
            this.createPeerConnection();
        }
        this.createOfferAndSendMessage();
    }
    /**
     * 创建offer 并发送消息
     */
    async createOfferAndSendMessage() {
        try {
            const session = await this.localPC.createOffer()
            this.localPC.setLocalDescription(session)
            const msg = {
                'cmd': 'offer',
                'roomId': this.roomId,
                'uid': this.localUserId,
                'remoteUid': this.remoteUserId,
                'offer': session
            };
            this.sendMsg('offer', msg)
        } catch (e) {
            console.log('createOfferAndSendMessage error', e)
        }
    }
    /**
     * 创建answer
     */
    doAnswer() {
        this.createAnswerAndSendMessage()
    }
    /**
     * 创建answer 并且发送信息
     */
    async createAnswerAndSendMessage() {
        try {
            const session = await this.localPC.createAnswer()
            this.localPC.setLocalDescription(session)
            const msg = {
                'cmd': 'answer',
                'roomId': this.roomId,
                'uid': this.localUserId,
                'remoteUid': this.remoteUserId,
                'answer': session
            };
            this.sendMsg('answer', msg)
        } catch (e) {
            console.log('createAnswerAndSendMessage error', e)
        }
    }
    /**
     * 处理事件
     */
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
    /**
     * 处理socket 发来的join事件
     */
    handlerNewPeerJoin(data) {
        console.info("handlerNewPeerJoin, remoteUid: " + data.remoteUid);
        this.remoteUserId = data.remoteUid;
        this.doOffer();
    }
    /**
     * 处理自己的join事件
     */
    handlerRespJoin(data) {
        console.info("handlerRespJoin, remoteUid: " + data.remoteUid);
        this.remoteUserId = data.remoteUid;
    }
    /**
     * 处理离开事件
     */
    handlerPeerLeave(data) {
        console.info("handlerPeerLeave, remoteUid: " + data.remoteUid);
        this.remoteVideo.srcObject = null;
        if (this.localPC != null) {
            this.localPC.close();
            this.localPC = null;
        }
    }
    /**
     * 处理远端的offer事件
     */
    handlerRemoteOffer(data) {
        console.info("handleRemoteOffer");
        if (this.localPC == null) {
            this.createPeerConnection();
        }
        this.localPC.setRemoteDescription(data.offer);
        this.doAnswer();
    }
    /**
     * 处理远端的answer
     */
    handlerRemoteAnswer(data) {
        console.info("handleRemoteAnswer");
        this.localPC.setRemoteDescription(data.answer);
    }
    /**
     * 处理远端的candidate
     */
    handlerRemoteCandidate(data) {
        console.info("handleRemoteCandidate");
        const msg = {
            'sdpMLineIndex': data.candidate.label,
            'sdpMid': data.candidate.id,
            'candidate': data.candidate.candidate
        };
        const candidate = new RTCIceCandidate(msg);
        this.localPC.addIceCandidate(candidate).catch(e => {
            console.error("addIceCandidate failed:" + e.name);
        });
    }
}
