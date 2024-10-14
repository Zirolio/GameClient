import { PlayerInput } from "../socket/types";

enum Buttons {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}

export default class InputsController {
    private $initedCanvas?: HTMLCanvasElement;
    
    private $isUpdated: boolean;
    get isUpdated() { return this.$isUpdated }
    set isUpdated(isUpdated: boolean) { this.$isUpdated = isUpdated }

    private $input: PlayerInput;
    get input() { return this.$input }

    constructor(canvas: HTMLCanvasElement) {
        this.$isUpdated = false;
        this.$input = {
            keyboard: {
                top: false,
                down: false,
                left: false,
                right: false
            },
            mouse: {
                position: { x: 0, y: 0 },
                shot: false
            },
			joystick: {
				angle: 0,
				value: 0
			}
        }
        this.initCanvas(canvas);
    }

    initCanvas(canvas: HTMLCanvasElement) {
        if (this.$initedCanvas) {
            document.removeEventListener('keydown', this.onKeyDown.bind(this));
            document.removeEventListener('keyup', this.onKeyUp.bind(this));
            this.$initedCanvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
            this.$initedCanvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
            this.$initedCanvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        }

        this.$initedCanvas = canvas;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.$initedCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.$initedCanvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code == 'KeyW') this.$input.keyboard.top = true, this.$isUpdated = true;
        else if (event.code == 'KeyS') this.$input.keyboard.down = true, this.$isUpdated = true;
        else if (event.code == 'KeyA') this.$input.keyboard.left = true, this.$isUpdated = true;
        else if (event.code == 'KeyD') this.$input.keyboard.right = true, this.$isUpdated = true;
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.code == 'KeyW') this.$input.keyboard.top = false, this.$isUpdated = true;
        else if (event.code == 'KeyS') this.$input.keyboard.down = false, this.$isUpdated = true;
        else if (event.code == 'KeyA') this.$input.keyboard.left = false, this.$isUpdated = true;
        else if (event.code == 'KeyD') this.$input.keyboard.right = false, this.$isUpdated = true;
    }

    onMouseMove(event: MouseEvent) {
        this.$input.mouse.position.x = event.x - window.innerWidth / 2;
        this.$input.mouse.position.y = event.y - window.innerHeight / 2;
        this.$isUpdated = true;
    }

    onMouseDown(event: MouseEvent) {
        if (event.button == Buttons.LEFT) this.$input.mouse.shot = true, this.$isUpdated = true;
    }

    onMouseUp(event: MouseEvent) {
        if (event.button == Buttons.LEFT) this.$input.mouse.shot = false, this.$isUpdated = true;
    }
}
