import Encryption from "./encryption";
import { MessagesTypes } from "./messagesTypes";
import { SocketClientMessage, SocketServerMessage } from "./types";

export default class Socket {
    private $url: string;
    get url() { return this.$url }

    private $isConnected: boolean = false;
    get isConnected() { return this.$isConnected }

    private $socket: WebSocket;
    
    private $onOpen?: () => unknown;
    private $onConnect?: () => unknown;
    private $onMessage?: (data: SocketServerMessage) => unknown;
    private $onClose?: () => unknown;

    constructor(url: string);
    constructor(url: string, onOpen: () => unknown,  onConnect?: () => unknown, onMessage?: (data: SocketServerMessage) => unknown, onClose?: () => unknown);
    constructor(url: string, onOpen?: () => unknown, onConnect?: () => unknown, onMessage?: (data: SocketServerMessage) => unknown, onClose?: () => unknown) {
        this.$url = url;

        this.$onOpen = onOpen;
        this.$onConnect = onConnect;
        this.$onMessage = onMessage;
        this.$onClose = onClose;

        this.$socket = new WebSocket(url);
        this.$socket.addEventListener('open', this.onSocketOpen.bind(this));
        this.$socket.addEventListener('message', this.onSocketMessage.bind(this));
    }

    private onSocketOpen() {
        if (typeof this.$onOpen !== 'undefined') this.$onOpen();
    }
    
    private onSocketMessage(message: MessageEvent) {
        const data = Encryption.decrypt(message.data);

        if (!this.$isConnected) {
            if (data == "OK") {
                this.$isConnected = true;
                if (typeof this.$onConnect !== 'undefined') this.$onConnect();
            }
        } else if (this.$isConnected && typeof this.$onMessage !== 'undefined') this.$onMessage(JSON.parse(data));
    }

    send(type: MessagesTypes): void;
    send(type: MessagesTypes, data: Object): void;
    send(type: MessagesTypes, data: Object = {}) {
        if (this.$socket.readyState == this.$socket.OPEN) {
            let event = JSON.stringify({
                type: type,
                data: typeof data !== 'string' ? JSON.stringify(data) : data
            } as SocketClientMessage);
            this.$socket.send(Encryption.encrypt(event));
        }
    }

    connect(url?: string) {
        if (url) this.$url = url;
        this.$socket = new WebSocket(this.$url);
    }

    reconnect(url?: string) {
        this.close();
        this.connect(url);
    }

    close() {
        this.$socket.close();
        if (typeof this.$onClose !== 'undefined') this.$onClose();
    }
}