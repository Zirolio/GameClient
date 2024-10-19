import { Event, EventDispatcher } from 'ver/events';


type Key = string;

// TODO: add time down
export class KeyboardController extends EventDispatcher {
	public '@keydown' = new Event<KeyboardController, [key: Key]>(this);
	public '@keyup' = new Event<KeyboardController, [key: Key]>(this);
	public '@keypress' = new Event<KeyboardController, [key: Key]>(this);


	protected _keys_down: Record<Key, boolean> = Object.create(null);
	protected _keys_up: Record<Key, boolean> = Object.create(null);
	protected _keys_press: Record<Key, boolean> = Object.create(null);

	constructor(el: HTMLElement) {
		super();

		el.addEventListener('keydown', e => {
			const key = e.key as Key;

			if(!this._keys_down[key]) {
				this._keys_down[key] = true;
				this._keys_press[key] = true;

				this['@keypress'].emit(key);
			}

			this['@keydown'].emit(key);
		});

		el.addEventListener('keyup', e => {
			const key = e.key as Key;

			this._keys_down[key] = false;
			this._keys_up[key] = true;

			this['@keyup'].emit(key);
		});
	}

	public isUp(key: Key): boolean;
	public isUp(key: Key, ignoreCase: boolean): boolean;
	public isUp(key: Key, ignoreCase: boolean = false) {
		return KeyboardController.checkKeyState(key, ignoreCase, this._keys_up);
	}
	public isDown(key: Key): boolean;
	public isDown(key: Key, ignoreCase: boolean): boolean;
	public isDown(key: Key, ignoreCase: boolean = false) {
		return KeyboardController.checkKeyState(key, ignoreCase, this._keys_down);
	}
	public isPress(key: Key): boolean;
	public isPress(key: Key, ignoreCase: boolean): boolean;
	public isPress(key: Key, ignoreCase: boolean = false) {
		return KeyboardController.checkKeyState(key, ignoreCase, this._keys_press);
	}

	public nullify(dt: number) {
		for(const key in this._keys_press) this._keys_press[key] = this._keys_up[key] = false;
	}

	public destroy() {
		this.events_off(true);
	}

	static checkKeyState(key: Key, ignoreCase: boolean, state: Record<string, boolean>): boolean {
		return ignoreCase ? state[key.toLowerCase()] || state[key.toUpperCase()] : state[key];
	}
}
