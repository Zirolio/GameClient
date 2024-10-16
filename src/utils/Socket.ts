import { Event, EventDispatcher } from 'ver/events';

import Encryption from '@/utils/encryption';


// export enum MessageType {
// 	NOTIFICATION
// }

// export type NotificationMessage<Key extends string = string, Args extends any[] = any[]> = [MessageType.NOTIFICATION, Key, Args];
export type NotificationMessage<Key extends string = string, Args extends any[] = any[]> = [Key, Args];

export type Message<Key extends string, Args extends any[]> = NotificationMessage<Key, Args>;


export interface EventsMap { [event: string]: any; }
export interface DefaultEventsMap { [event: string]: (...args: any[]) => void; }

// type Unify<T> = T extends void | undefined ? [] : T extends any[] ? T : [T];


export const createSocketApi = <
	const Handlers extends Record<string, (...args: any[]) => unknown>,
	const Api extends Record<string, (...args: any[]) => any>
>(socket: Socket<any, any>, handlers: Handlers, api: Api, $: ($: string) => string = $ => $) => {
	const socketApi = Object.create(null) as {
		[K in keyof Api]: (...args: Parameters<Api[K]>) => void;
	};

	socket.on('NotificationMessage', (uri, args) => handlers[uri](...args));

	for(const uri in api) (socketApi as any)[uri] = (...args: any) => {
		const data = (api as any)[uri](...args);

		if(typeof data === 'undefined') (socket as any).send($(uri));
		else if(Array.isArray(data)) (socket as any).send($(uri), data);
		else (socket as any).send($(uri), [data]);
	}

	return socketApi;
};


const OK = 'OK';

export declare namespace Socket {
	export type ServerToClient<T extends Socket<any, any>> = T extends Socket<infer R, any> ? R : never;
	export type ClientToServer<T extends Socket<any, any>> = T extends Socket<any, infer R> ? R : never;
}
export class Socket<
	const ServerToClient extends EventsMap = DefaultEventsMap,
	const ClientToServer extends EventsMap = DefaultEventsMap
> extends EventDispatcher {
	public '@open' = new Event<Socket, []>(this);
	public '@close' = new Event<Socket, [e: CloseEvent]>(this);
	public '@error' = new Event<Socket, []>(this);
	public '@connect' = new Event<Socket, []>(this);
	public '@message' = new Event<Socket, [e: MessageEvent]>(this);

	public '@NotificationMessage' = new Event<Socket, [uri: string, args: any[]]>(this);


	private _url: string = '';
    public get url() { return this._url; }

    private _isConnected: boolean = false;
    public get isConnected() { return this._isConnected; }

    public socket?: WebSocket;

    constructor(url?: string) {
		super();

		if(url) this.connect(url);
    }

    protected _open() {}
    protected _error() {}
	protected _close(e: CloseEvent) {}
	protected _connect() {}

    protected _message(e: MessageEvent) {
        const data = Encryption.decrypt(e.data);

        if(!this._isConnected) {
            if(data == OK) {
                this._isConnected = true;
                this._connect();
                this['@connect'].emit();
            }
        } else if(this._isConnected) {
			const msg = JSON.parse(data);

			// if(msg[0] === MessageType.NOTIFICATION) { // [type, uri, args]
				this._notification_message(msg[0], msg[1]);
				this['@NotificationMessage'].emit(msg[0], msg[1]);
			// } else throw new Error('unknown message');
		}
    }

	protected _notification_message<T extends keyof ServerToClient>(uri: T, args: Parameters<ServerToClient[T]>) {}

	public connect(url: string): Promise<this> {
		if(this.socket) {
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onclose = null;
			this.socket.onerror = null;
		}

        this._url = url;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
			this._open();
			this['@open'].emit();
		};

        this.socket.onmessage = e => {
			this._message(e);
			this['@message'].emit(e);
		};

        this.socket.onclose = e => {
			this['@close'].emit(e);
			this._close(e);
		};

        this.socket.onerror = () => {
			this._error();
			this['@error'].emit();
		};

		return new Promise<this>(res => (this as Socket).on('connect', () => res(this)));
	}

	public close(this: Socket) { this.socket?.close(); }

	public reconnect(url: string = this.url): void {
		this.close();
		this.connect(url);
	}

	public send<T extends keyof ClientToServer>(uri: T, ...args: Parameters<ClientToServer[T]>): void {
		if(!this.socket) throw new Error('Socket not inited');

        if(this.socket.readyState == this.socket.OPEN) {
            // const event = JSON.stringify([MessageType.NOTIFICATION, uri, JSON.stringify(args)]);
            const event = JSON.stringify([uri, JSON.stringify(args)]);

            this.socket.send(Encryption.encrypt(event));
        }
    }
}
