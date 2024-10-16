import { Vector2 } from 'ver/Vector2';
import { State } from 'ver/State';
import { math as Math } from 'ver/helpers';
import { Animation } from 'ver/Animation';
import type { Viewport } from 'ver/Viewport';

import type { Node } from 'lib/scenes/Node';
import { SensorCamera } from 'lib/SensorCamera';
import { Node2D } from 'lib/scenes/Node2D';
import { Control } from 'lib/scenes/Control';
import { Sprite } from 'lib/scenes/Sprite';
import { Camera2D } from 'lib/scenes/Camera2D';
import { GridMap } from 'lib/scenes/gui/GridMap';
import { SystemInfo } from 'lib/scenes/gui/SystemInfo';
import { Joystick } from 'lib/scenes/gui/Joystick';
import { Player } from '@/scenes/Player';

import { keyboard, touches, viewport } from '@/canvas';
import { unify_input } from '@/unify-input';


import { AudioContorller } from 'lib/AudioController';
export const audioContorller = new AudioContorller();


class Info extends Node2D {
	public self!: MainScene;
	protected override async _init(): Promise<void> { this.draw_distance = Math.INF; }
	protected override _ready(): void { this.zIndex = 1000; }

	protected override _draw({ ctx }: Viewport): void {
		const center = Vector2.ZERO;
		const a = 30;

		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = 0.2;
		ctx.strokeStyle = '#ffff00';
		ctx.moveTo(center.x, center.y-a);
		ctx.lineTo(center.x, center.y+a);
		ctx.moveTo(center.x-a, center.y);
		ctx.lineTo(center.x+a, center.y);
		ctx.stroke();
		ctx.restore();


		ctx.resetTransform();
		viewport.scalePixelRatio();
	}
}


export class MainScene extends Control {
	protected static override async _load(scene: typeof this): Promise<void> {
		await Sprite.load();
		await super._load(scene);

		// await audioContorller.load('shot', 'assets/audio/lazer-shot.mp3');
	}

	public override TREE() { return {
		Camera2D,
		GridMap,
		Info,
		SystemInfo,
		Player,
		Joystick
	}}
	// aliases
	public get $camera() { return this.get('Camera2D'); }
	public get $gridMap() { return this.get('GridMap'); }
	public get $info() { return this.get('Info'); }
	public get $joystick() { return this.get('Joystick'); }
	public get $player() { return this.get('Player'); }

	public sensor_camera = new SensorCamera();

	private player!: Player;

	protected override async _init(this: MainScene): Promise<void> {
		await super._init();

		this.player = this.$player;


		this.$camera.viewport = viewport;
		this.$camera.current = true;

		this.$camera.on('PreProcess', dt => {
			if(!this.$joystick.touch) this.sensor_camera.update(dt, touches, this.$camera);

			this.$camera.position.moveTime(this.player.position, 5);

			this.$gridMap.scroll.set(this.$camera.position);
			this.$gridMap.position.set(this.$camera.position);
			this.$gridMap.size.set(this.$camera.size.new().inc(this.$camera.scale)).inc(5);
		});

		this.$gridMap.tile.set(64, 64);

		this.$info.self = this;


		viewport.on('resize', size => {
			const s = size.new().div(2);

			this.$joystick.position.set(-(s.x-100), s.y-100);
		}).call(viewport, viewport.size);
	}

	protected override _ready(this: MainScene): void {
		const moveChild = (o: Node, p: Node) => {
			o.parent!.removeChild(o.name, true);
			p.addChild(o);
		};

		moveChild(this.$joystick, this.$camera);
	}

	protected override _process(this: MainScene, dt: number): void {
		if(keyboard.isPress('w') || keyboard.isDown('W')) unify_input.diration.y = -1;
		if(keyboard.isPress('s') || keyboard.isDown('S')) unify_input.diration.y = +1;
		if(keyboard.isPress('a') || keyboard.isDown('A')) unify_input.diration.x = -1;
		if(keyboard.isPress('d') || keyboard.isDown('D')) unify_input.diration.x = +1;

		if(this.$joystick.touch) {
			const { value, angle } = this.$joystick;

			unify_input.diration.set(0).moveAngle(value, angle);

			this.player.rotation = angle + Math.PI/2;
			this.player.position.moveAngle(value*2, this.player.rotation - Math.PI/2);
		}

		unify_input.diration.normalize();
	}
}
