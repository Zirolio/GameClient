import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';


enum Button {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}



export class MauseController extends EventDispatcher {
	public '@down' = new Event<MauseController, [button: Button]>(this);
	public '@up' = new Event<MauseController, [button: Button]>(this);
	public '@move' = new Event<MauseController, [button: Button]>(this);

	public readonly position = new Vector2();

	protected _left: boolean = false;
	protected _right: boolean = false;
	protected _middle: boolean = false;

	constructor(el: HTMLElement, filter: (e: MouseEvent) => boolean = () => true) {
		super();

		el.addEventListener('mousedown', e => {
			if(!filter(e)) return;

			const key = e;

			if(!this._keys[key]) {
				this._keys[key] = true;
			}

			this['@press'].emit(button);
		});

		el.addEventListener('mouseup', e => {
			if(!filter(e)) return;

			const key = e.key as key;

			this._keys[key] = false;
			this['@keyup'].emit(key);
		});
	}

	public isDown(button: button) { return this._buttons[button]; }

	public destroy() {
		this.events_off(true);
	}
}
