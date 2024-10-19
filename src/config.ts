import { GameConfig } from './types';


export const isMobile = /Mobi|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0;


export const config = {
	game: {} as GameConfig
};
