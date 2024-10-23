import { math as Math } from 'ver/helpers';
import type { Viewport } from 'ver/Viewport';

import { game } from '@/game';

import { CanvasItem } from 'lib/scenes/CanvasItem';
import type { ServerEntity } from './ServerEntity';
import type { IBulletNetData } from '@/types';


export declare namespace Bullets {
	export interface ISyncData extends IBulletNetData {}

	export interface IReuseData extends ServerEntity.IReuseData {
		radius?: number;
		bulletType: number;
	}

	export interface Item extends IReuseData {
		radius: number;
	}
}


export class Bullets extends CanvasItem {
	public items: Bullets.Item[] = [];

	public create(data: Bullets.IReuseData) {
		this.items.push({
			id: data.id,
			position: data.position.new(),
			bulletType: data.bulletType,
			isServerDestroyed: false,
			radius: 5*game.scale,
			server_position: data.position.new()
		});
	}

	public delete(id: Bullets.Item['id']): boolean {
		const l = this.items.findIndex(it => it.id === id);
		if(!~l) return false;
		this.items.splice(l, 1);
		return true;
	}

	public updateByServer(arr: Bullets.ISyncData[]) {
		for(const data of arr) {
			const item = this.items.find(it => it.id === String(data.id));

			if(item && data.destroyed) {
				this.delete(item.id);
				continue;
			}

			if(!item) this.create({
				id: String(data.id),
				bulletType: data.bulletType,
				position: data.position.new(),
				server_position: data.position.new(),
				isServerDestroyed: data.destroyed
			});

			else {
				item.position.set(data.position);
				item.server_position.set(data.position),
				item.isServerDestroyed = data.destroyed;
			}
		}
	}

	protected _drawBullet({ ctx }: Viewport, bullet: Bullets.Item) {
		ctx.beginPath();
		ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, Math.TAU);
		ctx.fill();
	}

	protected override _render(viewport: Viewport): void {
		viewport.ctx.save();
		viewport.use(true);

		viewport.ctx.fillStyle = '#ee2222';

		for(let i = 0; i < this.items.length; i++) {
			if(!viewport.isInViewport(this.items[i].position, this.items[i].radius)) continue;

			this._drawBullet(viewport, this.items[i]);
		}

		viewport.ctx.restore();
	}
}
