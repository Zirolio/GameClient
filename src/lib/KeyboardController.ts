import { Event, EventDispatcher } from 'ver/events';

type Key = string;
interface KeyData {
	up: boolean;
	down: boolean;
	press: boolean;
	timestamp?: number;
}
interface KeyInfo {
	readonly alt: boolean;
	readonly ctrl: boolean;
	readonly shift: boolean;
}

export class KeyboardController extends EventDispatcher {
	public '@keydown' = new Event<KeyboardController, [key: Key, info: KeyInfo]>(this);
	public '@press' = new Event<KeyboardController, [key: Key, info: KeyInfo]>(this);
	public '@keyup' = new Event<KeyboardController, [key: Key, info: KeyInfo]>(this);

	protected _keys_state: Record<Key, KeyData> = Object.create(null);

	constructor() {
		super();

		window.addEventListener('keydown', e => {
			const key = e.key as Key;

			if (this._keys_state[e.key] == undefined) this._keys_state[e.key] = { up: false, down: false, press: false };
			if (this._keys_state[e.code] == undefined) this._keys_state[e.code] = { up: false, down: false, press: false };

			if (this._keys_state[e.key].down == false) {
				this._keys_state[e.key].press = true;
				this['@press'].emit(e.key, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
			}
			if (this._keys_state[e.code].down == false) {
				this._keys_state[e.code].press = true;
				this['@press'].emit(e.code, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
			}

			this._keys_state[e.key].up = this._keys_state[e.code].up = false;
			this._keys_state[e.key].down = this._keys_state[e.code].down = true;
			this._keys_state[e.key].timestamp = this._keys_state[e.code].timestamp = Date.now();

			this['@keydown'].emit(key, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
		});

		window.addEventListener('keyup', e => {
			const key = e.key as Key;

			if (this._keys_state[e.key] == undefined) this._keys_state[e.key] = { up: false, down: false, press: false };
			if (this._keys_state[e.code] == undefined) this._keys_state[e.code] = { up: false, down: false, press: false };

			this._keys_state[e.key].up = this._keys_state[e.code].up = true;
			this._keys_state[e.key].press = this._keys_state[e.code].press = this._keys_state[e.key].down = this._keys_state[e.code].down = false;
			delete this._keys_state[e.key].timestamp;
			delete this._keys_state[e.code].timestamp;

			this['@keyup'].emit(key, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
		});
	}

	public isUp(key: Key) { return this._keys_state[key]?.up || false; }
	public isDown(key: Key) { return this._keys_state[key]?.down || false; }
	public isPressed(key: Key) { return { pressed: this._keys_state[key]?.down || false, time: this._keys_state[key]?.down ? Date.now() - this._keys_state[key].timestamp! : NaN }; }

	public nullify(dt: number) {
		for(const key in this._keys_state) this._keys_state[key] = { ...this._keys_state[key], up: false, press: false };
	}

	public destroy() {
		this.events_off(true);
	}
}