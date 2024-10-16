import { Event, EventDispatcher } from 'ver/events'

import { config } from '@/config';
import { socket } from '@/socket';
import { mainloop } from '@/canvas';
import { createSocketApi } from '@/utils/Socket';
import { unify_input } from '@/unify-input';

import type { GameConfig, INetData } from './types';


socket.on('open', () => api.player_ready());
socket.on('close', () => api.player_close());
socket.on('connect', () => api.player_config());


export const api = Object.assign(new class ServerApi extends EventDispatcher {
	public '@update_entities' = new Event<this, [data: INetData[]]>(this);
}, createSocketApi(socket, {
	game_config(data: GameConfig) {
		Object.assign(config.game, data);

		mainloop.start();
	},
	update_entities(data: INetData[]) {
		api.emit('update_entities', data);
	}
}, {
	player_ready() {},
	player_close() {},
	player_config() {},
	unify_input: (data = unify_input.getSerializeData()) => data
}));
