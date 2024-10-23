import { math as Math } from 'ver/helpers';
import type { Viewport } from 'ver/Viewport';

import { game } from '@/game';

import { Node } from 'lib/scenes/Node';
import { ReuseContainer } from 'lib/modules/Container';
import { ServerEntity } from './ServerEntity';
import type { IPlayerNetData } from '@/types';


export declare namespace Player {
	export interface ISyncData extends IPlayerNetData {}

	export interface IReuseData extends ServerEntity.IReuseData {
		rotation: number;
		radius: number;
		MAX_HP: number;
		HP: number;
	}
}


export class Player extends ServerEntity implements Player.IReuseData {
	public radius!: number;

	public MAX_HP: number = 100;
	public HP: number = this.MAX_HP;

	protected override async _init(): Promise<void> {
		await super._init();

		this.draw_distance = this.radius;
	}

	protected override _process(dt: number): void {
		super._process(dt);

		this.HP = Math.mod(this.HP + 0.05 * dt, 0, this.MAX_HP);
	}

	protected override _draw({ ctx }: Viewport): void {
		ctx.beginPath();
		const grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, this.radius/10);
		grad.addColorStop(0, '#38288e');
		grad.addColorStop(1, '#283729');

		ctx.fillStyle = grad;
		ctx.arc(0, 0, this.radius, 0, Math.TAU);
		ctx.fill();


		ctx.beginPath();
		ctx.fillStyle = '#111111';
		ctx.fillRect(-10, 10, 60, 10);


		const c = this.HP / this.MAX_HP;

		ctx.rotate(-this.rotation);

		ctx.beginPath();
		ctx.strokeStyle = `#22ee22`;
		ctx.arc(0, 0, this.radius*1.5, 0, Math.TAU * -c);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = `#ee2222`;
		ctx.arc(0, 0, this.radius*1.5, Math.TAU * -c, 0);
		ctx.stroke();
	}
}


export namespace Player {
	export class Container extends Node {
		protected static override async _load(scene: typeof Container): Promise<void> {
			await super._load(scene);
			await Player.load();
		}

		public c = new ReuseContainer<typeof Player, Player.IReuseData>(Player, 10, (item, data) => this.c.assign(item, data));

		protected override async _init(): Promise<void> {
			this.c.on('create:new', item => item.init().then(() => this.addChild(item, `item[${item.id}]`)));
			this.c.on('deleteing', item => this.removeChild(`item[${item.id}]`));
		}

		public updateByServer(arr: ISyncData[]) {
			for(const data of arr) {
				const item = this.c.getById(String(data.id));

				if(item && data.destroyed) {
					this.c.delete(item.id);
					continue;
				}

				if(!item) this.c.create({
					id: String(data.id),
					MAX_HP: 100, HP: 100,
					radius: 40*game.scale,
					rotation: 0,
					position: data.position.new().inc(game.scale),
					server_position: data.position.new().inc(game.scale),
					isServerDestroyed: data.destroyed
				});

				else {
					item.rotation = data.rotation;
					item.server_position.set(data.position).inc(game.scale);
					item.isServerDestroyed = data.destroyed;
				}
			}
		}
	}
}
