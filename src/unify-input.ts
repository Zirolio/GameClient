import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import type { Vec2Like } from './utils/vec2';


export interface IUnifyInputSerializeData {
	shot: boolean;
	lookAngle: number;
	direction: Vec2Like;
}


export const unify_input = new class UnifyInput extends EventDispatcher {
	public shot: boolean = false;
	public direction = new Vector2();
	public lookAngle: number = 0;

	public getSerializeData(): IUnifyInputSerializeData {
		const data = Object.assign({}, this) as IUnifyInputSerializeData;

		data.direction = { x: this.direction.x, y: this.direction.y };

		return data;
	}
}
