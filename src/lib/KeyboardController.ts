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

	constructor() {
		super();

		window.addEventListener('keydown', e => {
			const key = e.key as Key;

			if(!this._keys_down[key]) {
				this._keys_down[key] = true;
				this._keys_press[key] = true;

				this['@keypress'].emit(key);
			}

			this['@keydown'].emit(key);
		});

		window.addEventListener('keyup', e => {
			const key = e.key as Key;

			this._keys_down[key] = false;
			this._keys_up[key] = true;

			this['@keyup'].emit(key);
		});
	}

	public isUp(key: Key) { return this._keys_up[key]; }
	public isDown(key: Key) { return this._keys_down[key]; }
	public isPress(key: Key) { return this._keys_press[key]; }

	public nullify(dt: number) {
		for(const key in this._keys_press) this._keys_press[key] = this._keys_up[key] = false;
	}

	public destroy() {
		this.events_off(true);
	}
}
