import { Event, EventDispatcher } from 'ver/events'

import { config } from '@/config';
import { socket } from '@/socket';
import { mainloop } from '@/canvas';
import { createSocketApi } from '@/utils/Socket';
import { unify_input } from '@/unify-input';

import type { GameConfig, INetData } from '@/types';


socket.on('open', () => API.PLAYER_CONNECT());
socket.on('close', () => API.PLAYER_CLOSE());
socket.on('connect', () => API.PLAYER_CONFIG());


export const API = Object.assign(new class API extends EventDispatcher {
	public isInputPushed: boolean = false;

	public '@update_entities' = new Event<this, [data: INetData[]]>(this);
}, createSocketApi(socket, {
	SERVER_GAME_CONFIG(data: GameConfig) {
		Object.assign(config.game, data);

		mainloop.start();
	},

	SERVER_UPDATE_ENTITIES(data: INetData[]) {
		API.emit('update_entities', data);
	}
}, {
	PLAYER_CONNECT: () => null,
	PLAYER_CLOSE: () => null,
	PLAYER_CONFIG: () => null,

	PLAYER_INPUT: (data = unify_input.getSerializeData()) => {
		if(API.isInputPushed) return;
		API.isInputPushed = true;

		return data;
	}
}));
