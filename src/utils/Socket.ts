import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import Encryption from '@/utils/encryption';


export type NotificationMessage<Key extends string = string, Args extends any[] = any[]> = [Key, Args];

export type Message<Key extends string, Args extends any[]> = NotificationMessage<Key, Args>;


export interface EventsMap { [event: string]: any; }
export interface DefaultEventsMap { [event: string]: (...args: any[]) => void; }

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

		if(typeof data !== 'undefined') (socket as any).send($(uri), data);
	}

	return socketApi;
};


const Vec2LikeToVector2 = (o: any) => {
	if(typeof o === 'object' && o !== null) {
		const keys = Object.keys(o);

		if(keys.length === 2 && keys.every(it => it === 'x' || it === 'y')) return new Vector2(o.x, o.y);

		for(const key of keys) o[key] = Vec2LikeToVector2(o[key]);
	}

	return o;
};

const Vector2ToVec2Like = (o: any) => {
	if(typeof o === 'object' && o !== null) {
		const keys = Object.keys(o);

		if(o instanceof Vector2) return { x: o.x, y: o.y };

		for(const key of keys) o[key] = Vector2ToVec2Like(o[key]);
	}

	return o;
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
	public '@open' = new Event<Socket<ServerToClient, ClientToServer>, []>(this);
	public '@close' = new Event<Socket<ServerToClient, ClientToServer>, [e: CloseEvent]>(this);
	public '@error' = new Event<Socket<ServerToClient, ClientToServer>, []>(this);
	public '@connect' = new Event<Socket<ServerToClient, ClientToServer>, []>(this);
	public '@message' = new Event<Socket<ServerToClient, ClientToServer>, [e: MessageEvent]>(this);

	public '@NotificationMessage' = new Event<Socket<ServerToClient, ClientToServer>, [uri: string, args: any[]]>(this);
	public typedNotificationMessage<T extends keyof ServerToClient>() {
		return this['@NotificationMessage'] as any as Event<Socket<ServerToClient, ClientToServer>, Parameters<ServerToClient[T]>>;
	}


	private _url: string = '';
    public get url() { return this._url; }

    private _isConnected: boolean = false;
    public get isConnected() { return this._isConnected; }

    protected socket?: WebSocket;

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
			let [uri, obj] = JSON.parse(data);

			obj = Vec2LikeToVector2(obj);

			this._notification_message(uri, [obj] as any);
			this['@NotificationMessage'].emit(uri, [obj]);
		}
    }

	protected _notification_message<T extends keyof ServerToClient>(uri: T, args: Parameters<ServerToClient[T]>) {}

	public send<T extends keyof ClientToServer>(uri: T, ...args: Parameters<ClientToServer[T]>): void {
		if(!this.socket) throw new Error('Socket not inited');

        if(this.socket.readyState == this.socket.OPEN) {
            const event = JSON.stringify(args.length ? [uri, Vector2ToVec2Like(args[0])] : [uri]);

            this.socket.send(Encryption.encrypt(event));
        }
    }


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

		return new Promise<this>((res, rej) => {
			if(this._isConnected) res(this);

			this['@connect'].on(() => res(this));
			this['@error'].on(() => rej(new Error(`Socket connect error (${this.url})`)));
		});
	}

	public close() { this.socket?.close(); }

	public reconnect(url: string = this.url): void {
		this.close();
		this.connect(url);
	}
}
