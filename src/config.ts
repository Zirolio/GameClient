import { GameConfig } from './types';


export const pointerIsCoarse = window.matchMedia('(pointer: coarse)').matches;
export const pointerIsFine = window.matchMedia('(pointer: fine)').matches;

export const config = {
	game: {} as GameConfig
};
