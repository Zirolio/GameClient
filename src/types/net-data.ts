import { Vector2 } from 'ver/Vector2';


export enum EntityTypes {
    AREA,
    PLAYER,
    BULLET,
	STRUCTURE
}

export interface IBaseNetData {
	id: number;
	entityType: EntityTypes;
    destroyed: boolean;
}

export interface IPlayerNetData extends IBaseNetData {
	entityType: EntityTypes.PLAYER;
    position: Vector2;
	rotation: number;
	radius: number;
}

export interface IBulletNetData extends IBaseNetData {
	entityType: EntityTypes.BULLET;
    position: Vector2;
	bulletType: number;
}

export interface IStructureNetData extends IBaseNetData {
	entityType: EntityTypes.STRUCTURE;
    position: Vector2;
	size: Vector2;
}

export type INetData = IPlayerNetData | IBulletNetData | IStructureNetData;
