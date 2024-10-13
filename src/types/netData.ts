import { EntityTypes } from "./entityTypes";
import { Vec2Like } from "../utils/vec2";

export interface NetData {
    id: number;
    entityType: EntityTypes;
    destroyed: boolean;
}

export interface PlayerNetData extends NetData {
    position: Vec2Like;
}

export interface BulletNetData extends NetData {
    position: Vec2Like;
}