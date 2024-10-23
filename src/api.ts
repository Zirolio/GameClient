import { Event, EventDispatcher } from 'ver/events'

import { game } from '@/game';
import { socket } from '@/socket';
import { createSocketApi } from '@/utils/Socket';
import { unify_input } from '@/unify-input';
import { EntityTypes } from '@/types';

import type { GameConfig } from '@/game';
import type { INetData, IPlayerNetData, IBulletNetData } from '@/types';


socket.on('open', () => API.PLAYER_CONNECT());
socket.on('close', () => API.PLAYER_CLOSE());
socket.on('connect', () => API.PLAYER_CONFIG());


export const API = Object.assign(new class API extends EventDispatcher {
	public '@update:entities' = new Event<this, [data: INetData[]]>(this);
	public '@update:players' = new Event<this, [data: IPlayerNetData[]]>(this);
	public '@update:bullets' = new Event<this, [data: IBulletNetData[]]>(this);

	public isInputPushed: boolean = false;
}, createSocketApi(socket, {
	SERVER_GAME_CONFIG(data: GameConfig) {
		Object.assign(game, data);

		game.ready();
	},

	SERVER_UPDATE_ENTITIES(data: INetData[]) {
		API.emit('update:entities', data);
		API.emit('update:players', data.filter(it => it.entityType === EntityTypes.PLAYER));
		API.emit('update:bullets', data.filter(it => it.entityType === EntityTypes.BULLET));
	}
}, {
	PLAYER_CONNECT: () => null,
	PLAYER_CLOSE: () => null,
	PLAYER_CONFIG: () => null,

	PLAYER_INPUT: (data = unify_input.getOneShotData()) => data
}));
