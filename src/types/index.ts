import { IUnifyInputSerializeData } from "@/unify-input";
import { EntityTypes } from "../types/entityTypes";
import { Vec2Like } from "../utils/vec2";


export enum MessagesTypes {
    GAME_CONFIG,
    PLAYER_CONFIG,
	UPDATE_ENTITIES,
	PLAYER_INPUT,
	PLAYER_CLOSE,
	PLAYER_READY
}

export type SocketClientToServer = {
    [MessagesTypes.GAME_CONFIG]: GameConfig;
    [MessagesTypes.PLAYER_CONFIG]: PlayerInput;
	[MessagesTypes.UPDATE_ENTITIES]: INetData;
	[MessagesTypes.PLAYER_INPUT]: PlayerInput;
	[MessagesTypes.PLAYER_CLOSE]: void;
	[MessagesTypes.PLAYER_READY]: void;
}


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

export interface Mouse {
    position: Vec2Like;
    shot: boolean;
}

export interface Keyboard {
    top: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface Joystick {
	value: number;
	angle: number;
}

export interface PlayerInput {
    mouse: Mouse;
    keyboard: Keyboard;
	joystick: Joystick;
	unify_input: IUnifyInputSerializeData;
}


export interface IBaseNetData {
	id: number;
	entityType: EntityTypes;
    destroyed: boolean;
}

export interface IPlayerNetData extends IBaseNetData {
	entityType: EntityTypes.PLAYER;
    position: Vec2Like;
}

export interface IBulletNetData extends IBaseNetData {
	entityType: EntityTypes.BULLET;
    position: Vec2Like;
}

export type INetData = IPlayerNetData | IBulletNetData;
