import { GameConfig } from './types';


export const isMobile = window.matchMedia('(any-pointer: coarse)').matches;


export const config = {
	game: {} as GameConfig
};
