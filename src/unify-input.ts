import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import { deepCompairison } from '@/utils';
import type { Vec2Like } from '@/utils/vec2';


export interface IUnifyInputSerializeData {
	shot: boolean;
	lookAngle: number;
	direction: Vec2Like;
}


export const unify_input = new class UnifyInput extends EventDispatcher {
	#prev!: IUnifyInputSerializeData;

	public shot: boolean = false;
	public lookAngle: number = 0;
	public direction = new Vector2();

	public getOneShotData(): IUnifyInputSerializeData | void {
		const data = Object.create(null) as IUnifyInputSerializeData;

		data.shot = this.shot;
		data.lookAngle = this.lookAngle;
		data.direction = { x: this.direction.x, y: this.direction.y };

		if(deepCompairison(this.#prev, this.#prev = data)) return;

		return data;
	}
}
