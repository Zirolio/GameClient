import { Vec2Like } from '@/utils/vec2';
import { EntityTypes } from './entityTypes';


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


export interface IBaseNetData {
	id: number;
	entityType: EntityTypes;
    destroyed: boolean;
}

export interface IPlayerNetData extends IBaseNetData {
	entityType: EntityTypes.PLAYER;
    position: Vec2Like;
	rotation: number;
}

export interface IBulletNetData extends IBaseNetData {
	entityType: EntityTypes.BULLET;
    position: Vec2Like;
	bulletType: number;
}

export type INetData = IPlayerNetData | IBulletNetData;
