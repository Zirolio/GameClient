import { Vector2 } from 'ver/Vector2';
import { math as Math } from 'ver/helpers';
import type { Viewport } from 'ver/Viewport';

import { Node } from 'lib/scenes/Node';
import { Node2D } from 'lib/scenes/Node2D';
import { Container, IBaseItem } from 'lib/modules/Container';
import { IPlayerNetData } from '@/types';
import { Vec2Like } from '@/utils/vec2';


export interface IPlayerItem extends IBaseItem {
	rotation: number;
	position: Vec2Like;
	MAX_HP: number;
	HP: number;
}

export class PlayersContainer extends Node {
	protected static override async _load(scene: typeof PlayersContainer): Promise<void> {
		await super._load(scene);
		await Player.load();
	}

	public c = new Container<typeof Player, IPlayerItem>(Player, 10, (item, data) => {
		item.id = data.id;
		item.rotation = data.rotation;
		item.position.set(Vector2.from(data.position));
		item.MAX_HP = data.MAX_HP;
		item.HP = data.HP;
	});

	protected override async _init(): Promise<void> {
		this.c.on('create:new', item => item.init().then(() => this.addChild(item, `item[${item.id}]`)));
	}

	public updateByServer(arr: IPlayerNetData[]) {
		for(const data of arr) {
			let item = this.c.getById(String(data.id));

			if(!item) this.c.create({
				id: String(data.id),
				MAX_HP: 100, HP: 100,
				rotation: 0,
				position: Vector2.from(data.position)
			});
			else {
				item.rotation = data.rotation;
				item.new_position.set(Vector2.from(data.position));
			}
		}
	}
}


export class Player extends Node2D implements IPlayerItem {
	public new_position = new Vector2();

	public id!: string;

	public radius: number = 16; 

	public MAX_HP: number = 100;
	public HP: number = this.MAX_HP;

	protected override async _init(): Promise<void> {
		this.draw_distance = this.radius;
	}

	protected override _process(dt: number): void {
		this.HP = Math.mod(this.HP + 0.05 * dt, 0, this.MAX_HP);

		this.position.moveTime(this.new_position, 2);
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
		ctx.arc(0, 0, this.radius+10, 0, Math.TAU * -c);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = `#ee2222`;
		ctx.arc(0, 0, this.radius+10, Math.TAU * -c, 0);
		ctx.stroke();
	}
}
