import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import type { Vec2Like } from './utils/vec2';


export interface IUnifyInputSerializeData {
	shot: boolean;
	diration: Vec2Like;
	lookAngle: number;
}


export const unify_input = new class UnifyInput extends EventDispatcher {
	public shot: boolean = false;
	public diration = new Vector2();
	public lookAngle: number = 0;

	public getSerializeData(): IUnifyInputSerializeData {
		const data = Object.assign({}, this) as IUnifyInputSerializeData;

		data.diration = { x: this.diration.x, y: this.diration.y };

		return data;
	}
}
