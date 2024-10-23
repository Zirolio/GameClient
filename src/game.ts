import { EventDispatcher, FunctionIsEvent } from 'ver/events';


export interface AreaConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GameConfig {
    playerId: number;
    area: AreaConfig;
}


export const game = new class Game extends EventDispatcher implements GameConfig {
	public scale!: number;


	#ready: boolean = false;
	public ready: FunctionIsEvent<this, [], () => Promise<void>> = new FunctionIsEvent(this, () => {
		if(this.#ready) return Promise.resolve();

		this.#ready = true;
		this.ready.emit();

		return Promise.resolve();
	});

	playerId!: number;
	area!: AreaConfig;
}
