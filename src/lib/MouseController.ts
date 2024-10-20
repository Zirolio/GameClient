import { Vector2 } from 'ver/Vector2';
import { Event, EventDispatcher } from 'ver/events';

export const config = {
	DOWN_TIME: 300,
	CLICK_TIME: 300,
	CLICK_GAP: 300
};

const buttons = {
	'left': 0, 0: 'left',
	'middle': 1, 1: 'middle',
	'right': 2, 2: 'right'
} as const;

type button = Exclude<keyof typeof buttons, number>;
type EButton = Extract<keyof typeof buttons, number>;

const init = <T>(initial: T) => Array<T>(3).fill(initial);

export class MouseController extends EventDispatcher {
	public '@press' = new Event<MouseController, [button: button]>(this);
	public '@up' = new Event<MouseController, [button: button]>(this);
	public '@down' = new Event<MouseController, [button: button]>(this);
	public '@move' = new Event<MouseController, [button: button]>(this);
	public '@click' = new Event<MouseController, [button: button]>(this);
	public '@dblclick' = new Event<MouseController, [button: button]>(this);

	public pos = new Vector2();
	/** speed */
	public s = new Vector2();
	/** fix prev position */
	public p = new Vector2();
	/** fix start position */
	public b = new Vector2();


	/** flag down */
	public fD: boolean[] = init(false);
	/** flag press */
	public fP: boolean[] = init(false);
	/** flag up */
	public fU: boolean[] = init(false);
	/** flag move */
	public fM: boolean[] = init(false);
	/** flag click */
	public fC: boolean[] = init(false);

	public clickCount: number[] = init(0);

	public up: boolean[] = init(false);
	public upTime: number[] = init(0);

	public down: boolean[] = init(false);
	public downTime: number[] = init(0);

	public moved: boolean[] = init(false);


	constructor(el: HTMLElement, filter: (e: MouseEvent) => boolean = () => true) {
		super();

		el.addEventListener('mousedown', e => {
			if(!filter(e)) return;

			const button = e.button as EButton;

			if(this.fP[button]) return;

			const box = el.getBoundingClientRect();

			this.up[button] = false;
			this.down[button] = true;

			this.downTime[button] = 0;

			this.moved[button] = false;

			this.fD[button] = true;
			this.fP[button] = true;

			this.b[0] = this.pos[0] = e.pageX - box.left;
			this.b[1] = this.pos[1] = e.pageY - box.top;

			this['@press'].emit(buttons[button]);
		});

		el.addEventListener('mouseup', e => {
			if(!filter(e)) return;

			const button = e.button as EButton;

			this.fU[button] = true;
			this.fD[button] = false;

			this.up[button] = true;
			this.down[button] = false;

			this.upTime[button] = 0;

			if(!this.moved[button]) this.fC[button] = true;

			if(this.fC[button] && this.downTime[button] <= config.CLICK_TIME && this.upTime[button] <= config.CLICK_GAP) {
				this.clickCount[button]++;
			} else this.clickCount[button] = 0;

			this['@up'].emit(buttons[button]);
			if(this.clickCount[button]) this['@click'].emit(buttons[button]);
			if(this.clickCount[button] === 2) this['@dblclick'].emit(buttons[button]);
		});

		el.addEventListener('mousemove', e => {
			if(!filter(e)) return;

			const button = e.button as EButton;
			const box = el.getBoundingClientRect();

			const x = e.pageX - box.left;
			const y = e.pageY - box.top;

			if(this && this.pos[0] !== x && this.pos[1] !== y) {
				this.pos[0] = x;
				this.pos[1] = y;

				this.fM[button] = true;

				this.moved[button] = true;

				this.s[0] = this.pos[0]-this.p[0];
				this.s[1] = this.pos[1]-this.p[1];
				this.p[0] = this.pos[0];
				this.p[1] = this.pos[1];

				this['@move'].emit(buttons[button]);
			}
		});
	}

	public get speed() { return this.s.module; }
	/** relative position */
	public get d() { return this.pos.new().sub(this.b); }
	public get dx() { return this.pos.x-this.b.x; }
	public get dy() { return this.pos.y-this.b.y; }
	public get beeline() { return Math.sqrt(this.dx**2 + this.dy**2); }

	public isMoved(button: button) { return this.moved[buttons[button]]; }

	public isDown(button: button) { return this.fD[buttons[button]]; }
	public isPress(button: button) { return this.fP[buttons[button]]; }
	public isUp(button: button) { return this.fU[buttons[button]]; }
	public isMove(button: button) { return this.fM[buttons[button]]; }

	public isClick(button: button, time: number = config.CLICK_TIME, gap: number = config.CLICK_GAP) {
		return this.fC && this.downTime[buttons[button]] <= time && this.upTime[buttons[button]] <= gap;
	}
	public isdblClick(button: button) { return this.fC[buttons[button]] && this.clickCount[buttons[button]] === 2; }

	public isTimeDown(button: button, time: number = config.DOWN_TIME) {
		return !this.moved[buttons[button]] && this.down[buttons[button]] && this.downTime[buttons[button]] >= time;
	}

	public nullify(dt: number) {
		for(let i = this.fP.length-1; i <= 0; --i) {
			if(this.up[i]) this.upTime[i] += dt;
			if(this.down[i]) this.downTime[i] += dt;

			if(this.downTime[i] > config.CLICK_TIME || this.upTime[i] > config.CLICK_GAP) this.clickCount[i] = 0;
			this.fP[i] = this.fU[i] = this.fM[i] = this.fC[i] = false;
		}
	}


	public destroy() {
		this.events_off(true);
	}
}
