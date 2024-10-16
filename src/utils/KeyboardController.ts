import { Event, EventDispatcher } from 'ver/events';


type Key = string;

export class KeyboardController extends EventDispatcher {
	public '@keydown' = new Event<KeyboardController, [key: Key]>(this);
	// public '@keyup' = new Event<KeyboardController, [key: Key]>(this);
	// public '@keypress' = new Event<KeyboardController, [key: Key]>(this);


	protected _keys_down: Record<Key, boolean> = Object.create(null);

	constructor(el: HTMLElement) {
		super();

		el.addEventListener('keydown', e => {
			const key = e.key as Key;

			if(!this._keys_down[key]) this._keys_down[key] = true;

			this['@keydown'].emit(key);
		});

		el.addEventListener('keyup', e => {
			const key = e.key as Key;

			this._keys_down[key] = false;
		});
	}

	public isDown(key: Key) { return this._keys_down[key]; }

	public destroy() {
		this.events_off(true);
	}
}
