
import io from 'socket.io-client'
export default class Chat {
    constructor() {
        this.random()
        this.socket = io('http://127.0.0.1:8080/chat')
    }
    random() {
        this.userId = Math.floor(Math.random() * 10000000) + '828227'
    }
    Emit(type, data) {
        this.socket.emit(type, data)
    }
    initOn(cb) {
        this.socket.on('message', data => {
            const message = {}
            message.type = 'message';
            message.data = data;
            cb(message)
        })

        this.socket.on('joined', data => {
            const message = {}
            message.type = 'joined';
            message.data = data;
            cb(message)
        })
        this.socket.on('leaved', data => {
            const message = {}
            message.type = 'leaved';
            message.data = data;
            cb(message)
        })
    }
}



