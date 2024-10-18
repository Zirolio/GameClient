import { Vector2 } from 'ver/Vector2';
import { math as Math } from 'ver/helpers';
import type { Viewport } from 'ver/Viewport';

import { Node } from 'lib/scenes/Node';
import { Node2D } from 'lib/scenes/Node2D';
import { Container, IBaseItem } from 'lib/modules/Container';
import { IBulletNetData } from '@/types';
import { Vec2Like } from '@/utils/vec2';

// TODO: deleting items

export interface IBulletItem extends IBaseItem {
	position: Vec2Like;
	bulletType: number;
}

export class BulletsContainer extends Node {
	protected static override async _load(scene: typeof this): Promise<void> {
		await super._load(scene);
		await Bullet.load();
	}

	public c = new Container<typeof Bullet, IBulletItem>(Bullet, 10, (item, data) => {
		item.id = data.id;
		item.position.set(Vector2.from(data.position));
	});

	protected override async _init(): Promise<void> {
		this.c.on('create:new', item => this.addChild(item, `item[${item.id}]`));
	}

	public updateByServer(arr: IBulletNetData[]) {
		for(const data of arr) {
			const item = this.c.getById(String(data.id))!;

			const update = {
				id: String(data.id),
				position: Vector2.from(data.position),
				bulletType: data.bulletType
			} satisfies IBulletItem;

			this.c.assign(item, update);
		}
	}
}


export class Bullet extends Node2D implements IBulletItem {
	public bulletType!: number;
	public id!: string;

	public radius: number = 7; 

	protected override async _init(): Promise<void> {
		this.draw_distance = this.radius;
	}

	protected override _draw({ ctx }: Viewport): void {
		ctx.beginPath();
		const grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, this.radius-10);
		grad.addColorStop(0, '#298e8f');
		grad.addColorStop(1, '#e29ee2');

		ctx.fillStyle = grad;
		ctx.arc(0, 0, this.radius, 0, Math.TAU);
		ctx.fill();
	}
}
