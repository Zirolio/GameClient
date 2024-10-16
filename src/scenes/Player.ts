import { math as Math } from 'ver/helpers';
import type { Viewport } from 'ver/Viewport';

import { Node2D } from 'lib/scenes/Node2D';


export class Player extends Node2D {
	public radius: number = 30; 

	public MAX_HP: number = 100;
	public HP: number = this.MAX_HP;

	protected override async _init(): Promise<void> {
		this.draw_distance = this.radius;
	}

	protected override _process(dt: number): void {
		this.HP = Math.mod(this.HP + 0.05 * dt, 0, this.MAX_HP);
	}

	protected override _draw({ ctx }: Viewport): void {
		ctx.beginPath();
		const grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, this.radius-10);
		grad.addColorStop(0, '#38288e');
		grad.addColorStop(1, '#283729');

		ctx.fillStyle = grad;
		ctx.arc(0, 0, this.radius, 0, Math.TAU);
		ctx.fill();


		ctx.beginPath();
		ctx.fillStyle = '#111111';
		ctx.fillRect(20, -100, 10, 120);


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
