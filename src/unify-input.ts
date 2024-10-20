import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import type { Vec2Like } from './utils/vec2';


export interface IUnifyInputSerializeData {
	shot: boolean;
	lookAngle: number;
	direction: Vec2Like;
}


export const unify_input = new class UnifyInput extends EventDispatcher {
	public '@change' = new Event<this, []>(this);

	public _shot: boolean = false;
	public get shot() { return this._shot; }
	public set shot(v) {
		if(this._shot === v) return;
		this._shot = v;
		this['@change'].emit();
	}

	public _lookAngle: number = 0;
	public get lookAngle() { return this._lookAngle; }
	public set lookAngle(v) {
		if(this._lookAngle === v) return;
		this._lookAngle = v;
		this['@change'].emit();
	}

	public _prev_dir = new Vector2();
	public direction = new Vector2(0, 0, vec => !vec.isSame(this._prev_dir) && (this['@change'].emit(), this._prev_dir.set(vec)));

	public getSerializeData(): IUnifyInputSerializeData {
		const data = Object.create(null) as IUnifyInputSerializeData;

		data.shot = this.shot;
		data.lookAngle = this.lookAngle;
		data.direction = { x: this.direction.x, y: this.direction.y };

		return data;
	}
}
