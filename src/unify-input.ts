import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

import { deepCompairison } from '@/utils';


export interface IUnifyInputSerializeData {
	shot: boolean;
	lookAngle: number;
	direction: Vector2;
}


export const unify_input = new class UnifyInput extends EventDispatcher {
	shot: boolean = false;
	lookAngle: number = 0;
	direction = new Vector2();


	#prev!: IUnifyInputSerializeData;
	public getOneShotData(): IUnifyInputSerializeData | void {
		const data = {
			shot: this.shot,
			lookAngle: this.lookAngle,
			direction: this.direction.new()
		} as IUnifyInputSerializeData;

		if(deepCompairison(this.#prev, this.#prev = data)) return;

		return data;
	}
}
