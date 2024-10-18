import { IUnifyInputSerializeData } from "@/unify-input";
import { EntityTypes } from "../types/entityTypes";
import { Vec2Like } from "../utils/vec2";


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
}

export interface IBulletNetData extends IBaseNetData {
	entityType: EntityTypes.BULLET;
    position: Vec2Like;
	bulletType: number;
}

export type INetData = IPlayerNetData | IBulletNetData;
