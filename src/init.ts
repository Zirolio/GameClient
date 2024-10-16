import { Node } from 'lib/scenes/Node';
import { ProcessSystem } from 'lib/scenes/Node';
import { RenderSystem } from 'lib/scenes/CanvasItem';
import { ControllersSystem } from 'lib/scenes/Control';

import { AnimationManager } from '@/animations';
import { canvas, mainloop, touches, viewport } from '@/canvas';
import { socket } from '@/socket';

import { MainScene } from '@/scenes/MainScene';


const app = document.querySelector<HTMLDivElement>('#app')!;
//@ts-ignore
window.ondblclick = () => app.webkitRequestFullscreen();

const GUIElement = document.querySelector<HTMLDivElement>('#GUI')!;
GUIElement; // NOTE: можно подключить react или что то еще по желанию


canvas.on('resize', size => viewport.size.set(size), 1000).call(canvas, canvas.size, canvas.pixelRatio);


export const processSystem = new ProcessSystem();
export const renderSystem = new RenderSystem();
export const controllersSystem = new ControllersSystem(touches, viewport);

mainloop.on('update', dt => controllersSystem.update(dt), 1000);
mainloop.on('update', dt => processSystem.update(dt), -50);
mainloop.on('update', () => renderSystem.update(viewport), -100);
mainloop.on('update', () => canvas.render(), -100);
mainloop.on('update', dt => touches.nullify(dt), -10000);


export const anims = new AnimationManager();
mainloop.on('update', dt => { for(const anim of anims.anims) anim.tick(dt); }, -200);


(async () => {
	await socket.connect('ws://localhost:5000/server');

	await Node.load();
	const root_node = new Node();
	await root_node.init();

	processSystem.addRoot(root_node);
	renderSystem.addRoot(root_node);
	controllersSystem.addRoot(root_node);

	await MainScene.load();
	const main_scene = new MainScene();
	await main_scene.init();

	root_node.addChild(main_scene);
})();
