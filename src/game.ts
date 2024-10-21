import { Event, EventDispatcher } from 'ver/events';

import type { AreaConfig, GameConfig } from '@/types';


export const game = new class Game extends EventDispatcher implements PromiseLike<void>, GameConfig {
	public '@ready' = new Event<this, []>(this);

	playerId!: number;
	area!: AreaConfig;


	public then<T1 = void, T2 = never>(
		onfulfilled?: (() => T1 | PromiseLike<T1>) | null,
		onrejected?: ((reason: any) => T2 | PromiseLike<T2>) | null
	): PromiseLike<T1 | T2> {
		return new Promise<void>(res => this['@ready'].once(() => res())).then(onfulfilled, onrejected);
	}
}
