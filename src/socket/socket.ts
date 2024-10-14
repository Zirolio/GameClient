import { Event, EventDispatcher } from "ver/events";

import Encryption from "./encryption";
import { MessagesTypes } from "./messagesTypes";
import { SocketClientMessage, SocketServerMessage } from "./types";


export default class Socket extends EventDispatcher {
	public '@open' = new Event<Socket, []>(this);
	public '@close' = new Event<Socket, []>(this);
	public '@connect' = new Event<Socket, []>(this);
	public '@message' = new Event<Socket, [data: SocketServerMessage]>(this);


    private $url: string;
    get url() { return this.$url }

    private $isConnected: boolean = false;
    get isConnected() { return this.$isConnected }

    private $socket: WebSocket;
    
    constructor(url: string) {
		super();

        this.$url = url;

        this.$socket = new WebSocket(url);
        this.$socket.addEventListener('open', this.onSocketOpen.bind(this));
        this.$socket.addEventListener('message', this.onSocketMessage.bind(this));
    }

    private onSocketOpen(this: Socket) { this.emit('open'); }
    
    private onSocketMessage(this: Socket, message: MessageEvent) {
        const data = Encryption.decrypt(message.data);

        if (!this.$isConnected) {
            if (data == "OK") {
                this.$isConnected = true;
                this.emit('connect');
            }
        } else if (this.$isConnected) this.emit('message', JSON.parse(data));
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

    close(this: Socket) {
		this.emit('close');
        this.$socket.close();
    }
}
