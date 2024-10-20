import { Event, EventDispatcher } from 'ver/events';


export type Key = string;
export type Code = string;

export interface KeyData {
	up: boolean;
	down: boolean;
	press: boolean;
}

export interface KeyInfo {
	readonly alt: boolean;
	readonly ctrl: boolean;
	readonly shift: boolean;
}

export class KeyboardController extends EventDispatcher {
	public '@keydown' = new Event<KeyboardController, [key: Key, code: Code, info: KeyInfo]>(this);
	public '@keypress' = new Event<KeyboardController, [key: Key, code: Code, info: KeyInfo]>(this);
	public '@keyup' = new Event<KeyboardController, [key: Key, code: Code, info: KeyInfo]>(this);

	protected _keys_state: Record<Key | Code, KeyData> = Object.create(null);

	constructor() {
		super();

		window.addEventListener('keydown', e => {
			const key = e.key as Key;
			const code = e.code as Code;

			if(!e.repeat) {
				if(!this._keys_state[key]) this._keys_state[key] = { up: false, down: false, press: false };
				if(!this._keys_state[code]) this._keys_state[code] = { up: false, down: false, press: false };

				this._keys_state[key].press = this._keys_state[code].press = true;
				this['@keypress'].emit(key, code, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });

				this._keys_state[key].up = this._keys_state[code].up = false;
				this._keys_state[key].down = this._keys_state[code].down = true;
			}

			this['@keydown'].emit(key, code, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
		});

		window.addEventListener('keyup', e => {
			const key = e.key as Key;
			const code = e.code as Code;

			this._keys_state[key].up = this._keys_state[code].up = true;
			this._keys_state[key].press = this._keys_state[code].press = false;
			this._keys_state[key].down = this._keys_state[code].down = false;

			this['@keyup'].emit(key, code, { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey });
		});
	}

	public isUp(key: Key | Code) { return this._keys_state[key]?.up || false; }
	public isDown(key: Key | Code) { return this._keys_state[key]?.down || false; }
	public isPress(key: Key | Code) { return this._keys_state[key]?.press || false; }

	public nullify(dt: number) {
		for(const key in this._keys_state) this._keys_state[key].press = this._keys_state[key].up = false;
	}

	public destroy() {
		this.events_off(true);
	}
}
