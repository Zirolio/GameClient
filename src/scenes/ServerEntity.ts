import { Vector2 } from 'ver/Vector2';

import { Node2D } from 'lib/scenes/Node2D';
import type { IBaseNetData } from '@/types';


export declare namespace ServerEntity {
	export interface ISyncData extends IBaseNetData {}

	export interface IReuseData {
		id: string;
		position: Vector2;
		server_position: Vector2;
		isServerDestroyed: boolean;
	}
}


export class ServerEntity extends Node2D implements ServerEntity.IReuseData {
	public id!: string;

	public isServerDestroyed = false;
	public server_position = new Vector2();

	protected override _process(_dt: number): void {
		this.position.moveTime(this.server_position, 2);
	}
}
